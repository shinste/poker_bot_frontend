import * as React from 'react';
import {useEffect, useState} from 'react';
import { Box, Typography, Button } from '@mui/material';
import Person from '../icons/Person.png'
import PersonFold from '../icons/PersonFold.png'
import Card from './Card';
import IncrementNumber from './IncrementNumber';
import blinds from '../functions/blinds';
import RubberDuck from '../icons/RubberDuck.png';
import determineBestHand from '../functions/handDetect';


interface GameDisplayProps {
    settings: number[];
    pots: {
        total: number;
        current_bet: number;
        committed: number;
        totalPot: number;
    };
    opponents: {
        [key: number]: {
            total: number;
            commit: number;
            cards: [string | number, string][];
        }
    };
    cards: {
        [key: number]: [string, string][];
        playing: [string, string][];
    };
    whos_turn: number;
    folds: number[];
    userMove: (move: string, amount: number) => Promise<void>;
    show: boolean;
    commitByRound: {
        [key: number]: number
    };
    startButton: () => void;
    nextRound: () => void;
    turn: number;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ settings, pots, opponents, whos_turn, folds, userMove, show, commitByRound, startButton, nextRound, cards, turn}: GameDisplayProps) => {
    const [raise, setRaise] = useState(0);
    const [bestHand, setBestHand] = useState('');
    const [raisePress, setRaisePress] = useState(false);
    const handleRaisePress = () => {
        console.log(raise, 'raise amount');
        if (!raisePress) {
            setRaisePress(true);
        } else if (raise === 0){
            setRaisePress(false);
        } else {
            setRaisePress(false);
            userMove('raise', raise);
        }
    }
    let playerCommit: number = 0;
    if (commitByRound[1]) {
        playerCommit = commitByRound[1];
    }

    useEffect(() => {
        setRaise((pots['current_bet'] === 0) ? settings[2] : pots['current_bet']);
        const newBestHand = determineBestHand(turn, 1, cards);
        setBestHand(String(newBestHand[0]));
    }, [whos_turn, cards, turn]);

    return (
        <Box mb={-2}sx={{display:'flex', width: '100%', height: '50%', marginTop:0, justifyContent: 'space-between'}}>
            <Box sx={{display: 'flex', flexDirection:'column', width: '30%'}}>
                    <h3>Moves</h3>
                    <Box sx={{display: 'flex', justifyContent: 'space-evenly', marginBottom: 0}}>
                        
                    {pots['current_bet'] !== 0 ? (
                        <Button variant='contained' disabled={whos_turn !== 1} onClick={() => {userMove('call', 0);
                                                                                            setRaisePress(false);}} sx={{ backgroundColor: '#BEBEBE', margin: 1, color: 'black' }}>
                            Call {pots['current_bet']}
                        </Button>
                        ) : (
                        <Button variant='contained' disabled={whos_turn !== 1} onClick={() => {userMove('check', 0);
                                                                                            setRaisePress(false); }} sx={{ backgroundColor: '#BEBEBE', margin: 1, color: 'black' }}>
                            Check
                        </Button>
                        )}
                        <Button variant='contained' disabled={whos_turn !== 1} onClick={handleRaisePress}sx={{backgroundColor: '#BEBEBE', margin:1, color: raisePress ? 'green' : 'black'}}>
                            Raise
                        </Button>
                        <Button variant='contained' disabled={whos_turn !== 1} onClick={() => {userMove('fold', 0);
                                                                                            setRaisePress(false);}} sx={{backgroundColor: '#BEBEBE', margin:1, color: 'black'}}>
                            Fold
                        </Button>
                    </Box>
                    {raisePress && 
                    <Box sx={{ marginLeft: 'auto',marginRight: 'auto', textAlign: 'center', marginTop: 0}}>
                        {pots['total'] > pots['current_bet'] - playerCommit ? <IncrementNumber aria-label="Raise Amount" defaultValue={(pots['current_bet'] === 0) ? settings[2] : pots['current_bet']} min={(pots['current_bet'] === 0) ? settings[2] : pots['current_bet']
                    } max={pots['total'] - pots['current_bet'] - playerCommit} onChange={(event,value) => setRaise(value ?? 0)}/>
                            :
                        <Typography>You do not have the funds to raise, you must CALL</Typography>}
                    </Box>}
                    <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>

                    </Box>
                    <Box sx={{marginLeft:'auto', marginRight:'auto'}}>
                        {whos_turn === 0 && <Button onClick={startButton} variant='contained' sx={{backgroundColor: '#BEBEBE'}}>Start Game</Button>}
                        {whos_turn === -1 && <Button variant='contained' sx={{backgroundColor: '#BEBEBE'}} onClick={nextRound}>Start Next Game</Button>}
                    </Box>
                    
            </Box>  
            <Box sx={{width: '30%'}}>
                <h3>Player</h3>
                <Box sx={{display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginTop: 2, width: '7rem'}}>
                    <Card value={cards[1][0][0]} suit={cards[1][0][1]} status={true}/>
                    <Card value={cards[1][1][0]} suit={cards[1][1][1]} status={true}/>
                </Box>
                <Typography sx={{color: 'white', marginLeft: 'auto', marginRight: 'auto'}}my={1}>{bestHand}</Typography>
                <Typography>Your Total Chips: {Math.round(pots['total'] * 10) / 10}</Typography>
                <Typography>Total Chips Committed This Game: {Math.round(pots['committed'] * 10) / 10} chips</Typography>
            </Box>
            <Box sx={{display:'flex', flexDirection: 'column', width: '30%'}}>
                <h3>Opponents</h3>
                <Box sx={{display:'flex', justifyContent: 'space-evenly'}}>
                    {Array.from({ length: settings[0] - 1 }, (_, index) => (
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                Total: {opponents[index + 2] && opponents[index + 2]["total"]}
                                {folds.includes(index + 2) ? (
                                    <img key={index} src={PersonFold} alt={`player ${index}`} />
                                ) : (
                                    <img key={index} src={Person} alt={`player ${index}`} />
                                    )}
                                {index + 2}
                                <Box mt={1}>
                                    <Box sx={{display:'flex'}}>
                                        {opponents[index + 2] && <Card value={opponents[index + 2]['cards'][0][0]} suit={opponents[index + 2]['cards'][0][1]} status={show} small={true}/>}
                                        {opponents[index + 2] && <Card value={opponents[index + 2]['cards'][1][0]} suit={opponents[index + 2]['cards'][1][1]} status={show} small={true}/>}
                                    </Box>
                                </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            
            
        </Box>
    );
}

export default GameDisplay;