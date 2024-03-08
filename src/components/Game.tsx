import React, { useState, SetStateAction, Dispatch, useContext, useEffect} from 'react';
import getApi from '../functions/getApi';
import {Button, Typography, Box, InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import CardDisplay from './CardDisplay';
import DialogBox from './DialogBox';
import GameDisplay from './GameDisplay';
import axios from 'axios';
import blinds from '../functions/blinds';
import determineBestHand from '../functions/handDetect';

interface GameProps {
    settings: number[];
    // sessionId: string;
  }
interface CardProps {
    cards: {
        [key: number]: [string,string][];
        playing: [string,string][];
        // session_id: string;
    };
    pots: {
        total: number;
        current_bet: number;
        committed: number;
        totalPot: number
    }
    opponents: {
        [key: number]: {
            total: number;
            commit: number;
            cards: [string | number, string][];
        }
    }
    commitTracker: {
        [key: number] : number;
    }
    active: {
        [key: number] : [string, number];
    }
}

const instance = axios.create();  
const Game: React.FC<GameProps> = ({ settings}: GameProps) => {
    const total_players = settings[0];
    const buy_in = settings[1];
    const big_bet = settings[2];
    let button = settings[4];
    const [turn, setTurn] = useState(0);
    const [turnWord, setTurnWord] = useState('Pre-Flop')
    const [conversation, setConversation] = useState<string[]>([]);
    const [cards, setCards] = useState<CardProps['cards']>({1: [], playing: []});
    const [playerTurn, setPlayerTurn] = useState(0);
    //change?
    const [currentPots, setCurrentPots] = useState<CardProps['pots']>({total: buy_in, current_bet: big_bet, committed: 0, totalPot: 0})
    //change?
    const [opponents, setOpponents] = useState<CardProps['opponents']>({})
    //change?
    const [folds, setFolds] = useState<number[]>([]);
    let blindPositions = blinds(button, total_players);
    const [commitByRound, setCommitByRound] = useState<CardProps['commitTracker']>({});
    const [roundEnd, setRoundEnd] = useState(0);
    const [broke, setBroke] = useState<number[]>([]);

    // Instructions from AI API
    const AIMove = async () => {
        if (!folds.includes(playerTurn)) {
            try {
                // updates correct committment to round
                let committedRound = 0;
                if (commitByRound.hasOwnProperty(playerTurn)) {
                    committedRound = commitByRound[playerTurn];
                }
                console.log('committedRound', commitByRound);
                const response = await instance.post('http://127.0.0.1:8000/ai_move/', {
                    player: playerTurn,
                    turn: turn,
                    current_bet: currentPots['current_bet'],
                    budget: opponents[playerTurn]['total'],
                    cards: cards,
                    committed: opponents[playerTurn]['commit'],
                    commitRound: committedRound
                });
                console.log(response.data);
                if (!commitByRound.hasOwnProperty(playerTurn)) {
                    commitByRound[playerTurn] = 0
                }
                // PROCESSING AI MOVE
                let aiDecision = response.data["move"].toLowerCase()
                if (aiDecision.includes('check') && commitByRound[playerTurn] !== currentPots['current_bet']) {
                    aiDecision = 'call';
                } else if (currentPots['current_bet'] === commitByRound[playerTurn] && aiDecision.includes('call')) {
                    aiDecision = 'check';
                }
                setConversation(prevConversation => [...prevConversation, `Player ${playerTurn}'s Move: ` + aiDecision]);
                if (aiDecision.includes('fold')) {
                    setFolds(prevFolds => [...prevFolds, playerTurn]);
                    console.log(folds, 'folds');
                    if (folds.length === total_players - 2) {
                        GameWinner(playerTurn);
                    }
                    if (playerTurn === blindPositions.smallBlind && folds.length !== total_players - 2) {
                        let newSmall = playerTurn;
                        while (newSmall === playerTurn || folds.includes(newSmall)) {
                            if (newSmall === total_players) {
                                newSmall = 1;
                            } else {
                                newSmall += 1;
                            }
                        }
                    }
                } else if (aiDecision.toLowerCase() == 'call' || aiDecision.includes('raise')) {
                    // if calling or raising past the player's budget
                    let increase = 0;

                    // Check its not an ALL IN 
                    if (opponents[playerTurn]['total'] > currentPots['current_bet'] + response.data['bet_increase']) {
                        increase = currentPots['current_bet'] + response.data['bet_increase'] - commitByRound[playerTurn];
                        currentPots['current_bet'] = currentPots['current_bet'] + response.data['bet_increase'];
                    } else {
                        // ALL IN
                        broke.push(playerTurn);
                        increase = opponents[playerTurn]['total'];
                        if (currentPots['current_bet'] < increase + commitByRound[playerTurn]) {
                            currentPots['current_bet'] = increase + commitByRound[playerTurn]
                        }
                    }

                    commitByRound[playerTurn] += increase;
                    opponents[playerTurn].commit += increase;
                    currentPots['totalPot'] += increase;
                    opponents[playerTurn].total -= increase;
                    console.log('increase for ',playerTurn, increase);
                }
            } catch (error) {
                console.log(error);
            }
        }
        PlayerChange();
    }

    const initiate = async () => {
        // console.log(sessionId);
        instance.get(`http://127.0.0.1:8000/initiate/?players=${encodeURIComponent(total_players)}`)
        .then(response => {
            console.log('response', response);
            setCards(response.data);
            Object.entries(response.data).forEach(([key, value]) => {
                console.log(key, value);
                if (key != 'playing' && key != '1') {
                    const cards: [string | number, string][] = value as [string | number, string][];
                    opponents[Number(key)].cards = cards;
                    console.log(opponents[Number(key)], 'currents');
                }
            })
        })
        .catch(error => console.error('Error fetching data: ', error));
    }

    const TurnChange = () => {
        setTurn(turn + 1)
        if (turn == 0) {
            setTurnWord('Flop')
        } else if (turn == 1) {
            setTurnWord('Turn')
        } else if (turn == 2) {
            setTurnWord('River')
        }
    }

    const PlayerChange = () => {
        if (playerTurn === total_players) {
            setPlayerTurn(1);
        } else {
            setPlayerTurn(playerTurn + 1);
        }
    }

    const handleUserMove = async (move: string, amount: number) => {
        console.log(move, amount);
        try {
            if (move == 'fold') {
                setFolds(prevFolds => [...prevFolds, 1]);
                // Detects if every player has folded except 1
                console.log(folds, 'player fold');
            } else if (move == 'call' || move == 'raise') {
                let increase = 0;

                if (commitByRound.hasOwnProperty(1)) {
                    increase = currentPots['current_bet'] + amount - commitByRound[1];
                    commitByRound[1] += increase;
                } else { 
                    increase = currentPots['current_bet'] + amount;
                    commitByRound[1] = currentPots['current_bet'] + amount;
                }
                currentPots['current_bet'] = currentPots['current_bet'] + amount;
                currentPots['committed'] += increase;
                currentPots['totalPot'] += increase;
                currentPots['total'] -= increase;
                console.log('increase', increase);
            } else {
                commitByRound[1] = 0;
            }
            move = move.charAt(0).toUpperCase() + move.slice(1);
            if (amount !== 0) {
                move = move + " " + amount;
            }
            setConversation(prevConversation => [...prevConversation, `Player 1's Move: ${move}`]);
            if (folds.length === total_players - 2) {
                GameWinner(1);
            } else {
                PlayerChange();
            }
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
    };

    const GameWinner = (folder?: number) => {
        const allPlayers = Array.from({ length: total_players }, (_, i) => i + 1);
        const activePlayers = allPlayers.filter(player => !folds.includes(player));
        const activeCards: CardProps['active'] = {}
        for (const num of activePlayers) {
            if (num !== folder) {
                activeCards[num] = determineBestHand(3, num, cards);
            }
        }
        console.log(activePlayers, 'these are the candidates');
        setPlayerTurn(-1);
        let maximum = 0;
        let winner = '';
        let tie: string[] = [];
        for (const key in activeCards) {
            if (Number(activeCards[key][1]) > maximum) {
                maximum = Number(activeCards[key][1]);
                winner = key;
                tie = [winner];
            } else if (maximum === activeCards[key][1]) {
                tie.push(key);
            }
        }
        const winnerHand = activeCards[Number(winner)][0];
        if (tie.length === 1) {
            console.log(winner, winnerHand);
            setConversation(prevConversation => [...prevConversation, `Player ${winner} wins ${currentPots['totalPot']} with a ${winnerHand} hand!`]);
            // I want to 1. reset player turns to -1 (to not immediately start initiate)?, 2. give the winner his pot, 3. reset current pot, 4. reset current bet to big blind, 5. reset commit by round and other commits, 6. reset folds, 7. allow initiate to start again?
            // To stop the game
            // Paying winner the won pot
            if (Number(winner) === 1) {
                currentPots['total'] += currentPots['totalPot'];
                console.log(currentPots['totalPot'])
            } else {
                // if ai gives us player answer
                console.log(winner, Number(winner), opponents[Number(winner)], currentPots['totalPot']);
                if (winner.length > 1) {
                    opponents[Number(winner.split(' ')[1])]['total'] += currentPots['totalPot'];
                    console.log('not good');
                } else {
                    opponents[Number(winner)]['total'] += currentPots['totalPot'];
                }
            }
        } else {
            console.log('tie', tie);
            let equalEarnings = currentPots['totalPot'] / tie.length;
            equalEarnings = Math.round(equalEarnings * 10) / 10;
            setConversation(prevConversation => [...prevConversation, `Players ${String(tie)} tied with a hand of ${winnerHand}, its a split pot of ${equalEarnings} each!`]);
            for (let i = 0; i < tie.length; i++) {
                if (tie[i] === '1') {
                    currentPots['total'] += equalEarnings;
                } else {
                    opponents[Number(tie[i])]['total'] += equalEarnings;
                }
            }
        }
        setCommitByRound([]);
        // const winner = response.data['winner'];
        
    }

    // Starting new round after game has concluded
    const NextRound = () => {
        // things to reset: cards, folds, player display (total current pot, current bet, committed), opponent committed
        // turn == 0, button = button + 1, big small blinds, turnword == pre-flop, commitbyround
        setConversation(prevConversation => [...prevConversation, 'New Game Starting!']);
        setFolds([]);
        if (settings[4] == total_players) {
            settings[4] = 1
            button = 1
        } else {
            settings[4] += 1
            button += 1
        }
        blindPositions = blinds(button, total_players);
        currentPots['committed'] = 0;
        currentPots['current_bet'] = big_bet;
        currentPots['totalPot'] = 0;
        for (const key in opponents) {
            opponents[key]['commit'] = 0;
        }
        SmallBlindStart();
        if (blindPositions.bigBlind === total_players) {
            setPlayerTurn(1);
        } else {
            setPlayerTurn(blindPositions.bigBlind + 1);
        }
        
        setTurn(0)

    }

    const SmallBlindStart = () => {
        console.log('small blind start');
        if (blindPositions.smallBlind !== 1) {
            opponents[blindPositions.smallBlind].total -= big_bet / 2;
            opponents[blindPositions.smallBlind].commit = big_bet / 2; 
            commitByRound[blindPositions.smallBlind] = big_bet / 2;
        } else {
            currentPots.total -= big_bet / 2;
            currentPots.committed = big_bet / 2; 
            commitByRound[1] = big_bet / 2;
        }
        
        if (blindPositions.bigBlind !== 1) {
            opponents[blindPositions.bigBlind].total -= big_bet;
            opponents[blindPositions.bigBlind].commit = big_bet;
            commitByRound[blindPositions.bigBlind] = big_bet;
        } else {
            currentPots.total -= big_bet;
            currentPots.committed = big_bet; 
            commitByRound[1] = big_bet;
        }
        currentPots.totalPot += big_bet * 1.5;
        initiate();
        console.log('small blind start', commitByRound);
    };

    const suggestMove = async () => {
        let conversationContext: string[] = []
        for (let i = conversation.length - 1; i > 0; i--) {
            if (conversation[i].includes('New Game Starting!')) {
                break;
            } else if (conversation[i].includes('Player') || conversation[i].includes('Betting has')) {
                conversationContext.unshift(conversation[i]);
            }
        }
        let committedRound = 0;
        if (commitByRound[playerTurn]) {
            committedRound = commitByRound[playerTurn];
        }
        const response = await instance.post('http://127.0.0.1:8000/ai_suggest/', {
            turn: turnWord,
            current_bet: currentPots['current_bet'],
            budget: currentPots['total'],
            cards: cards,
            committedRound: currentPots['committed'],
            committedTurn: committedRound,
            conversationContext: conversationContext,
            players: total_players,
        }); 
        console.log('suggestion', response);
        setConversation(prevConversation => [...prevConversation, response.data['suggest']]);
        }

        const playerDialog = () => {
            // Dialog for player's turn!
            if (playerTurn === 1 && !folds.includes(1)) {
                let currentRound = 0;
                if (commitByRound[1]) {
                    currentRound = commitByRound[1];
                }
                if (currentPots['current_bet'] === 0) {
                    setConversation(prevConversation => [...prevConversation, `It's your turn to play! The current bet is ${currentPots['current_bet']}, you can simply check to stay in this round!`]);
                } else {
                    setConversation(prevConversation => [...prevConversation, `It's your turn to play! The current bet is ${currentPots['current_bet']}, you'd need to commit ${currentPots['current_bet'] - currentRound} more to continue.`]);
                }
            }
        }

    useEffect(() => {
        if (playerTurn > 0 && !broke.includes(playerTurn)) {
            // End of round detect if current bet is 0
            if (commitByRound.hasOwnProperty(playerTurn) && currentPots['current_bet'] === commitByRound[playerTurn]) {
                // Game end detection
                console.log('hitting no bet round end');
                console.log('turn', turn);
                if (turn + 1 > 3) {
                    GameWinner(0);
                } else {
                    setTurn(turn + 1);
                    setPlayerTurn(blindPositions.smallBlind);
                    setCommitByRound([]);
                    setRoundEnd(roundEnd + 1);
                    currentPots['current_bet'] = 0
                    TurnChange();
                    let changeTurn = 'Flop';
                    if (turn === 1) {
                        changeTurn = 'Turn'
                    } else if (turn === 2) {
                        changeTurn = 'River'
                    }
                    setConversation(prevConversation => [...prevConversation, `Betting has finished! Now onto the ${changeTurn}`]);
                }
            }
            // Prompt AI to play turn if its not the user's turn and if round isn't ending
            else if (playerTurn > 1) {
                setTimeout(AIMove, 1000);
            } else {
                setTimeout(playerDialog, 1000);
                console.log('success');
            }
        }

        

        if (playerTurn === 1 && folds.includes(1) || broke.includes(playerTurn)) {
            PlayerChange();
        }

        // Initialization of opponent pots, cards, etc.
        if (playerTurn === 0) {
            for (let i = 2; i <= total_players; i++) {
                opponents[i] = {
                    total: buy_in,
                    commit: 0,
                    cards: []
                }
            }
            // Setting up small and big blinds commit and pot adjustments
            SmallBlindStart();
        }

        
        
    }, [playerTurn, roundEnd]);

    if (cards[1].length === 0) {
            console.log('condition met');
            return <div>Loading...</div>;
        }

    return (
        <div className='vertical-flex'>
            <Typography m={2}>{turnWord}</Typography>
            <CardDisplay turn={turn} cardsData={cards}/>
            <Box sx={{backgroundColor: '#FBFBFB', width: '70%', height: '30rem', marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                <GameDisplay settings={settings} pots={currentPots} opponents = {opponents} whos_turn={playerTurn} folds={folds} userMove = {handleUserMove} commitByRound={commitByRound[1]}/>
                <DialogBox conversation={conversation}/>
                <Button onClick={suggestMove}>Give me a Suggestion!</Button>
            </Box>
            {playerTurn === 0 && <Button onClick={() => {setPlayerTurn(settings[4] + 3 % total_players)
                                                         setConversation(prevConversation => [...prevConversation, 'New Game Starting!'])}}>Start Game</Button>}
            {<Button disabled={playerTurn !== -1} onClick={NextRound}>Next Game</Button>}
            <Button onClick={() => console.log(playerTurn)}>checker</Button>
        </div>
    );
}

export default Game;