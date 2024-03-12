import * as React from 'react';
import {useEffect, useState} from 'react';
import { Box, Typography, Button } from '@mui/material';
import Person from '../icons/Person.png'
import PersonFold from '../icons/PersonFold.png'
import Card from './Card';
import IncrementNumber from './IncrementNumber';
import blinds from '../functions/blinds';
import RubberDuck from '../icons/RubberDuck.png';

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
    whos_turn: number;
    folds: number[];
    userMove: (move: string, amount: number) => Promise<void>;
    show: boolean;
    commitByRound: {
        [key: number]: number
    };
    startButton: () => void;
    nextRound: () => void;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ settings, pots, opponents, whos_turn, folds, userMove, show, commitByRound, startButton, nextRound}: GameDisplayProps) => {
    const [raise, setRaise] = useState(0);

    const bigSmall = blinds(settings[4], settings[0])
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
    }, [whos_turn]);

    return (
        <Box sx={{display:'flex', width: '100%', height: '50%', marginTop:1}}>
            <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto', alignSelf:'start'}}>
                <Typography>
                    Total Players: {settings[0]}
                </Typography>
                <Typography>
                    Players in Round: TODO
                </Typography>
                <Box sx={{display:'flex', justifyContent: 'space-evenly', height: '10rem'}}>
                    {Array.from({ length: settings[0] }, (_, index) => (
                        <Box sx={{display: 'flex', flexDirection: 'column', height: '20rem'}}>
                            {folds.includes(index + 1) ? (
                                <img key={index} src={PersonFold} alt={`player ${index}`} />
                                ) : (
                                <img key={index} src={Person} alt={`player ${index}`} />
                                )}
                            <Box >
                                {index === 0 ? '1 (YOU)' : `${index + 1}`}
                            </Box>
                            {/* keeping track of button and blinds */}
                            <Box my={1}>
                                {settings[4] === index + 1 && <Typography>Button</Typography>}
                                {bigSmall.smallBlind === index + 1 && <Typography>Small</Typography>}
                                {bigSmall.bigBlind === index + 1 && <Typography>Big</Typography>}
                            </Box>
                            <Box>
                                {whos_turn === index + 1 && <img key={index + 1} src={RubberDuck} alt={`player ${index + 1}'s turn`} />}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
                <Box sx={{display: 'flex', flexDirection:'column', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Typography>Your Total Chips: <strong>{Math.round(pots['total'] * 10) / 10}</strong></Typography>
                    <Typography>Total Current Pot: {Math.round(pots['totalPot'] * 10) / 10} chips</Typography>
                    {/* <Typography>Current Bet: {pots['current_bet']} chips</Typography> */}
                    <Typography>Your Committed Chips: {Math.round(pots['committed'] * 10) / 10} chips</Typography>
                    <Typography sx={{marginLeft: 'auto', marginRight: 'auto', fontWeight: '600'}}>CURRENT BET: {pots['current_bet']} chips</Typography>
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
                    {whos_turn === 0 && <Button onClick={startButton} variant='contained' sx={{backgroundColor: '#BEBEBE'}}>Start Game</Button>}
                    {whos_turn === -1 && <Button variant='contained' sx={{backgroundColor: '#BEBEBE'}} onClick={nextRound}>Start Next Game</Button>}
                </Box>  
            <Box sx={{display:'flex', flexDirection: 'column', marginLeft: 'auto', marginRight: 'auto', alignSelf:'end'}}>
                <Typography>Opponent display</Typography>
                <Box sx={{display:'flex', justifyContent: 'space-evenly'}}>
                    {Array.from({ length: settings[0] - 1 }, (_, index) => (
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                                {opponents[index + 2] && opponents[index + 2]["total"]}
                                {folds.includes(index + 2) ? (
                                    <img key={index} src={PersonFold} alt={`player ${index}`} />
                                ) : (
                                    <img key={index} src={Person} alt={`player ${index}`} />
                                    )}
                                {index + 2}
                                <Typography mt={1}>Commit</Typography>
                                <Typography mb={1}>{Math.round(opponents[index + 2]['commit'] * 10) / 10}</Typography>
                                <Box>
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