import React, { useState, useEffect} from 'react';
import {Button, Typography, Box} from '@mui/material';
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
    const [currentPots, setCurrentPots] = useState<CardProps['pots']>({total: buy_in, current_bet: big_bet, committed: 0, totalPot: 0})
    const [opponents, setOpponents] = useState<CardProps['opponents']>({})
    const [folds, setFolds] = useState<number[]>([]);
    let blindPositions = blinds(button, total_players);
    const [commitByRound, setCommitByRound] = useState<CardProps['commitTracker']>({});
    const [roundEnd, setRoundEnd] = useState(0);
    const [show, setShow] = useState(false);
    const [allIns, setAllIns] = useState<number[]>(Array.from({length: total_players}, (_, i) => i + 1))
    
    const startGame = () => {
        setPlayerTurn(settings[4] + 3 % total_players)
        setConversation(prevConversation => [...prevConversation, 'New Game Starting!'])
        console.log(cards);
        console.log('Starting Game Press, Setting Player Turn to:', settings[4] + 3 % total_players)
    }

    // Instructions from AI API
    const AIMove = async () => {
        if (!folds.includes(playerTurn)) {
            try {
                // updates correct committment to round
                let committedRound = 0;
                if (commitByRound.hasOwnProperty(playerTurn)) {
                    committedRound = commitByRound[playerTurn];
                    console.log('Checking if player has committed in this round already, Player Turn: ', playerTurn, 'committment by round: ', commitByRound);
                }
                // control what cards you send to AI because it somehow sees the cards anyways?

                const response = await instance.post('https://pokerbotbackend.applikuapp.com/ai_move/', {
                    player: playerTurn,
                    turn: turn,
                    current_bet: currentPots['current_bet'],
                    budget: opponents[playerTurn]['total'],
                    cards: cards,
                    committed: opponents[playerTurn]['commit'],
                    commitRound: committedRound,
                    difficulty: settings[3],
                    best: determineBestHand(turn, playerTurn, cards)[0]
                });
                if (!commitByRound.hasOwnProperty(playerTurn)) {
                    commitByRound[playerTurn] = 0
                }
                // Fixing AI Inconsistencies and Bad Habits
                let aiDecision = response.data["move"].toLowerCase()
                let raise = response.data['bet_increase'];
                // If ai decides to raise less than the current raise amount, raise it to the current raise amount
                if (aiDecision.includes('raise') && raise < currentPots['current_bet'] - commitByRound[playerTurn]) {
                    raise = currentPots['current_bet'] - commitByRound[playerTurn];
                }

                // If ai decides to check when theres a bet, it will change to call
                if (aiDecision.includes('check') && commitByRound[playerTurn] !== currentPots['current_bet']) {
                    aiDecision = 'call';
                // If ai decides to call or fold when they have met the bet, change to check
                } else if (currentPots['current_bet'] === commitByRound[playerTurn] && (aiDecision.includes('call') || aiDecision.includes('fold'))) {
                    aiDecision = 'check';
                // If ai decides to raise when it cant or can barely meet the current bet, change to call
                } else if (currentPots['current_bet'] - commitByRound[playerTurn] >= opponents[playerTurn]['total'] && aiDecision.includes('raise')) {
                    aiDecision = 'call';
                }
                console.log('AI move', aiDecision);
                setConversation(prevConversation => [...prevConversation, `Player ${playerTurn}'s Move: ` + aiDecision]);
                if (aiDecision.includes('fold')) {
                    setFolds(prevFolds => [...prevFolds, playerTurn]);
                    // This is array to help keep track of total active players for all ins
                    allIns.splice(allIns.indexOf(playerTurn), 1)
                    console.log('this move has been detected as a fold, folds: ', folds)
                    // if (folds.length === 2) {
                    //     console.log('it has been determined that only 1 player is active in this round because opponent folded', folds);
                    //     GameWinner(playerTurn);
                    // }
                } else if (aiDecision.toLowerCase() == 'call' || aiDecision.includes('raise')) {
                    // if calling or raising past the player's budget
                    let increase = 0;

                    // Check its not an ALL IN 
                    if (aiDecision.includes('raise') && opponents[playerTurn]['total'] > response.data['bet_increase']) {
                        increase = currentPots['current_bet'] + (Math.round(response.data['bet_increase'] * 10) / 10) - commitByRound[playerTurn];
                        currentPots['current_bet'] = currentPots['current_bet'] + response.data['bet_increase'];
                    } else if (aiDecision.includes('call') && opponents[playerTurn]['total'] > currentPots['current_bet'] - commitByRound[playerTurn]) {
                        increase = currentPots['current_bet'] - commitByRound[playerTurn];
                        currentPots['current_bet'] = currentPots['current_bet'] + response.data['bet_increase'];
                    }
                     else {
                        // ALL IN
                        allIns.splice(allIns.indexOf(playerTurn), 1)
                        increase = opponents[playerTurn]['total'];
                        if (currentPots['current_bet'] < increase + commitByRound[playerTurn]) {
                            currentPots['current_bet'] = increase + commitByRound[playerTurn]
                        }
                    }

                    commitByRound[playerTurn] += increase;
                    opponents[playerTurn].commit += increase;
                    currentPots['totalPot'] += increase;
                    opponents[playerTurn].total -= increase;
                    console.log('this player has decided to ', aiDecision, currentPots, opponents, commitByRound);
                }
            } catch (error) {
                console.log(error);
            }
        }
        PlayerChange();
    }

    const initiate = async () => {
        instance.get(`https://pokerbotbackend.applikuapp.com/initiate/?players=${encodeURIComponent(total_players)}`)
        .then(response => {
            setCards(response.data);
            Object.entries(response.data).forEach(([key, value]) => {
                if (key != 'playing' && key != '1') {
                    const cards: [string | number, string][] = value as [string | number, string][];
                    opponents[Number(key)].cards = cards;
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
        console.log(`The turn is being changed from ${playerTurn}`);
        if (playerTurn === total_players) {
            setPlayerTurn(1);
        } else {
            setPlayerTurn(playerTurn + 1);
        }
    }

    const handleUserMove = async (move: string, amount: number) => {
        try {
            if (move == 'fold') {
                setFolds(prevFolds => [...prevFolds, 1]);
                console.log('User has folded');
                setShow(true);
                allIns.splice(allIns.indexOf(1), 1)
            } else if (move === 'call' || move === 'raise') {
                if (move === 'raise') {
                    if (amount < currentPots['current_bet']) {
                        setConversation(prevConversation => [...prevConversation, `ERROR: To re-raise, you must bet at least ${currentPots['current_bet']} (2x the current bet)`]);
                        return;
                    }
                }

                let increase = 0;

                if (!commitByRound.hasOwnProperty(1)) {
                    commitByRound[1] = 0;
                }

                increase = currentPots['current_bet'] + amount - commitByRound[1];

                if (amount + currentPots['current_bet'] - commitByRound[playerTurn] >= currentPots['total'] || currentPots['total'] <= currentPots['current_bet'] - commitByRound[playerTurn]) {
                    allIns.splice(allIns.indexOf(1), 1);
                    setConversation(prevConversation => [...prevConversation, 'Player 1 has went ALL-IN']);
                    increase = currentPots['total'];
                }

                commitByRound[1] += increase;
                console.log(amount + currentPots['current_bet'] - commitByRound[playerTurn] === currentPots['total'], amount, currentPots['current_bet'], commitByRound[playerTurn], currentPots['total']);

                currentPots['current_bet'] = currentPots['current_bet'] + amount;
                currentPots['committed'] += increase;
                currentPots['totalPot'] += increase;
                currentPots['total'] -= increase;
                console.log('user has called or raised', currentPots, commitByRound, increase);
            } else {
                console.log('user has checked or edge case', move);
                commitByRound[1] = 0;
            }
            move = move.charAt(0) + move.slice(1);
            if (amount !== 0) {
                move = move + " " + amount;
            }
            setConversation(prevConversation => [...prevConversation, `Player 1's Move: ${move}`]);

            if (move === 'fold' && folds.length === 2) {
                console.log('it has been determined that only 1 player is active in this round because user has folded', folds);
                GameWinner(1);
            } else {
                PlayerChange();
            }
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
    };

    const GameWinner = async (folder?: number) => {
        setPlayerTurn(-1);
        console.log(`game has been determined to have ended. folder? ${folder}`);
        setTurn(4);
        const allPlayers = Array.from({ length: total_players }, (_, i) => i + 1);
        const activePlayers = allPlayers.filter(player => !folds.includes(player));
        const activeCards: CardProps['active'] = {}
        for (const num of activePlayers) {
            if (num !== folder) {
                activeCards[num] = determineBestHand(3, num, cards);
            }
        }
        setShow(true);
        
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

        // If its Tieable
        if (tie.length > 1 && !winnerHand.includes('Royal Flush') && !winnerHand.includes('Flush') && !winnerHand.includes('Straight')) {
            setConversation(prevConversation => [...prevConversation, `Players ${tie} have the best hand this round with a ${winnerHand}, please let us calculate if one of the hands beats the other in a tiebreaker!`]);
            // then we send to API tiebreaker
            const response = await instance.post('https://pokerbotbackend.applikuapp.com/tiebreaker/', {
                cards: cards,
                hand: winnerHand,
                ties: tie
            });
            
            tie = response.data['winner'];
            winner = tie[0];
        }

        if (tie.length > 1) {
            let equalEarnings = currentPots['totalPot'] / tie.length;
            equalEarnings = Math.round(equalEarnings * 10) / 10;
            setConversation(prevConversation => [...prevConversation, `Players ${String(tie)} tied with a hand of ${winnerHand}, each player wins ${equalEarnings} chips!`]);
            for (let i = 0; i < tie.length; i++) {
                if (tie[i] === '1') {
                    currentPots['total'] += equalEarnings;
                } else {
                    opponents[Number(tie[i])]['total'] += equalEarnings;
                }
            }
        } else {

            // I want to 1. reset player turns to -1 (to not immediately start initiate)?, 2. give the winner his pot, 3. reset current pot, 4. reset current bet to big blind, 5. reset commit by round and other commits, 6. reset folds, 7. allow initiate to start again?
            // To stop the game
            // Paying winner the won pot

            if (Number(winner) === 1) {
                // Side Pot Win
                let maximumCommit = 0;
                for (const key in activePlayers) {
                    if (activePlayers[Number(key)] === 1) {
                        Math.max(maximumCommit, currentPots['committed'])
                    } else {
                        Math.max(maximumCommit, opponents[activePlayers[Number(key)]]['commit'])
                    }
                }
                if (currentPots['committed'] < maximumCommit) {
                    let winnings = allInWin(activePlayers, 1, currentPots['committed']);
                    currentPots['total'] += winnings;
                    setConversation(prevConversation => [...prevConversation, `Player 1 wins, since Player's bet size is only ${currentPots['committed']},  Player 1 will win ${winnings} chips with a ${winnerHand} hand!`]);
                } else {
                    currentPots['total'] += currentPots['totalPot'];
                    setConversation(prevConversation => [...prevConversation, `Player ${winner} wins ${currentPots['totalPot']} chips with a ${winnerHand} hand!`]);
                }
                
            } else {
                let maximumCommit = 0;
                for (const key of activePlayers) {
                    if (key === 1) {
                        Math.max(maximumCommit, currentPots['committed'])
                    } else {
                        Math.max(maximumCommit, opponents[key]['commit'])
                    }
                }
                if (opponents[Number(winner)]['commit'] < maximumCommit) {
                    let winnings = allInWin(activePlayers, Number(winner), opponents[Number(winner)]['commit']);
                    opponents[Number(winner)]['total'] += winnings;
                    setConversation(prevConversation => [...prevConversation, `Player ${winner} wins, since Player's bet size is only ${opponents[Number(winner)]['commit']},  Player will win ${winnings} chips with a ${winnerHand} hand!`]);

                } else {
                    opponents[Number(winner)]['total'] += currentPots['totalPot'];
                    setConversation(prevConversation => [...prevConversation, `Player ${winner} wins ${currentPots['totalPot']} chips with a ${winnerHand} hand!`]);
                }
            }
            
        }
        setCommitByRound([]);
        // const winner = response.data['winner'];
        console.log('What was used to determine winner:', maximum, winner,tie,winnerHand,currentPots, opponents );
        
    }

    // Starting new round after game has concluded
    const NextRound = () => {
        // things to reset: cards, folds, player display (total current pot, current bet, committed), opponent committed
        // turn == 0, button = button + 1, big small blinds, turnword == pre-flop, commitbyround
        setConversation(prevConversation => [...prevConversation, 'New Game Starting!']);
        if (currentPots['total'] <= 0) {
            setConversation(prevConversation => [...prevConversation, `YOU HAVE LOST! YOU WILL BUY BACK IN`]);
            currentPots['total'] = 200
        }
        setShow(false);
        setFolds([]);
        if (settings[4] == total_players) {
            settings[4] = 1
            button = 1
        } else {
            settings[4] += 1
            button += 1
        }
        setAllIns(Array.from({length: total_players}, (_, i) => i + 1));
        blindPositions = blinds(button, total_players);
        currentPots['committed'] = 0;
        currentPots['current_bet'] = big_bet;
        currentPots['totalPot'] = 0;
        for (const key in opponents) {
            opponents[key]['commit'] = 0;
            if (opponents[key]['total'] === 0) {
                opponents[key]['total'] = buy_in;
                setConversation(prevConversation => [...prevConversation, `Player ${key} has bought back in!`]);
            }
        }

        SmallBlindStart();
        if (blindPositions.bigBlind === total_players) {
            setPlayerTurn(1);
        } else {
            setPlayerTurn(blindPositions.bigBlind + 1);
        }
        setTurn(0);
        setTurnWord('Pre-Flop');
        console.log('New game has started, the things taht should be changed are', button,currentPots,opponents,blindPositions);

    }

    const SmallBlindStart = () => {
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
        console.log('were setting up the blinds and pots and stuff for the this game', opponents, commitByRound, currentPots);
    };

    const suggestMove = async () => {
        setConversation(prevConversation => [...prevConversation, 'Suggestion: Please wait one suggestion, a suggestion is being generated!']);
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
        let slicing = turn;
        if (slicing === 0) {
            slicing = -2;
        }
        const response = await instance.post('https://pokerbotbackend.applikuapp.com/ai_suggest/', {
            turn: turnWord,
            current_bet: currentPots['current_bet'],
            budget: currentPots['total'],
            hand: cards['1'],
            community: cards['playing'].slice(0, slicing + 2),
            committedRound: currentPots['committed'],
            committedTurn: committedRound,
            conversationContext: conversationContext,
            players: total_players,
            best: determineBestHand(turn, 1, cards)[0]
        }); 
        setConversation(prevConversation => [...prevConversation, 'Suggestion: ' + response.data['suggest']]);
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

        const roundFeedback = async () => {
            let roundContext: string[] = []
            for (let i = conversation.length - 1; i > 0; i--) {
                if (conversation[i].includes('New Game Starting!')) {
                    break;
                } else if (conversation[i].includes('Player') || conversation[i].includes('Betting has' || conversation[i].includes('Round Conclusion'))) {
                    roundContext.unshift(conversation[i]);
                }
            }
            const response = await instance.post('https://pokerbotbackend.applikuapp.com/ai_feedback/', {
                cards: cards,
                history: roundContext
            });
            setConversation(prevConversation => [...prevConversation, `Round Feedback: ${response.data['feedback']}`]);
        }

        const allInWin = (activePlayers: number[], winner: number, winningPotSize: number) => {
            let leftoverPlayers: CardProps['commitTracker'] = {};
            let winnings = 0;
            for (const num in activePlayers) {
                if (Number(num) !== winner) {
                    let committment = currentPots['committed'];
                    if (Number(num) !== 1) {
                        committment = opponents[Number(num)]['commit'];
                    }
                    if (committment > winningPotSize) {
                        winnings += winningPotSize;
                        leftoverPlayers[Number(num)] = committment - winningPotSize;
                    } else {
                        winnings += committment;
                    }
                }
            };
            for (const key in Object.keys(leftoverPlayers)) {
                if (key === '1') {
                    currentPots['total'] += leftoverPlayers[key];
                } else {
                    opponents[key]['total'] += leftoverPlayers[key];
                }
                
            }
            return winnings;
        }

    useEffect(() => {
        // Playing Game
        if (playerTurn > 0) {
            // Detect if game is over because of folders or people who are all in
            // End of round detect if current bet is 0
            if (commitByRound.hasOwnProperty(playerTurn) && currentPots['current_bet'] === commitByRound[playerTurn]) {
                if (turn === 0 && playerTurn === blindPositions.bigBlind && currentPots['current_bet'] == big_bet) {
                    console.log('Everyone has matched bet but its big blinds turn but on pre-flop therefore ai function or user turn will start, PlayerTurn: ', playerTurn);
                    // This is to prompt a move for last bet of pre-flop, special case
                    if (playerTurn === 1) {
                        setTimeout(playerDialog, 500);
                    } else {
                        setTimeout(AIMove, 1000);
                    }
                    
                }
                // All In Scenario 1
                else if (allIns.length < 2) {
                    GameWinner(0);
                }
                // Game end detection
                else if (turn + 1 > 3) {
                    GameWinner(0);
                    console.log('The turn is now past 3, indicating a natural game end', turn);
                } else {
                    setTurn(turn + 1);
                    setPlayerTurn(blindPositions.smallBlind);
                    setCommitByRound([]);
                    currentPots['current_bet'] = 0
                    TurnChange();
                    let changeTurn = 'Flop';
                    if (turn === 1) {
                        changeTurn = 'Turn'
                    } else if (turn === 2) {
                        changeTurn = 'River'
                    }
                    setConversation(prevConversation => [...prevConversation, `Betting has finished! Now onto the ${changeTurn}`]);
                    setRoundEnd(roundEnd + 1);
                    console.log(`It has been determined that the round is over, its player turn ${playerTurn}, turn add 1, playerturn now to small blind: ${blindPositions.smallBlind}`);
                }
            } else if (!allIns.includes(playerTurn)) {
                console.log('This person has either folded or has already gone all in!');
                PlayerChange();
            }
            // Prompt AI to play turn if its not the user's turn and if round isn't ending
            else if (playerTurn > 1) {
                console.log('Player turn is not 1, therefore ai function will start, PlayerTurn: ', playerTurn);
                setTimeout(AIMove, 1000);
            } else if (playerTurn === 1) {
                setTimeout(playerDialog, 1000);
            }
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
            return <div>Loading...</div>;
        }

    return (
        <div className='vertical-flex'>
            {/* <Box sx={{width: '40%', marginLeft: 'auto', marginRight: 'auto'}}>
                {playerTurn === 0 && <Button onClick={() => {setPlayerTurn(settings[4] + 3 % total_players)
                                                             setConversation(prevConversation => [...prevConversation, 'New Game Starting!'])
                                                             console.log(cards);
                                                             console.log('Starting Game Press, Setting Player Turn to:', settings[4] + 3 % total_players)}} variant='contained' sx={{backgroundColor: '#BEBEBE'}}>Start Game</Button>}
                {playerTurn === -1 && <Button variant='contained' sx={{backgroundColor: '#BEBEBE'}} onClick={NextRound}>Start Next Game</Button>}
                <Button variant='contained' sx={{backgroundColor: '#BEBEBE'}} onClick={() => console.log(allIns)}>checker</Button>
            </Box> */}
            
            <CardDisplay turn={turn} cardsData={cards} turnWord={turnWord} commitByRound={commitByRound} players={total_players} folds={folds} pots={currentPots} playerTurn={playerTurn}/>
            <Box sx={{backgroundColor: '#8B8B8B', width: '70%', height: '30rem', marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                <GameDisplay settings={settings} pots={currentPots} opponents = {opponents} whos_turn={playerTurn} folds={folds} userMove = {handleUserMove} show={show} commitByRound={commitByRound} startButton={startGame} nextRound={NextRound} cards={cards} turn={turn}/>
                <DialogBox conversation={conversation}/>
                
                <Button disabled={playerTurn !== 1} variant='contained' sx={{backgroundColor: '#BEBEBE'}} onClick={suggestMove}>Give me a Suggestion!</Button>
                <Button disabled={playerTurn !== -1} variant='contained' sx={{backgroundColor: '#BEBEBE'}} onClick={roundFeedback}>Feedback for Round</Button>
                
            </Box>
            
            
            
        </div>
    );
}

export default Game;