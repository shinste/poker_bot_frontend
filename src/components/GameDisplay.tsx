import * as React from 'react';
import {useEffect, useState} from 'react';
import { Box, Typography, Button } from '@mui/material';
import Person from '../icons/Person.png'
import PersonFold from '../icons/PersonFold.png'
import Card from './Card';
import IncrementNumber from './IncrementNumber';
import blinds from '../functions/blinds';

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
    commitByRound: number;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ settings, pots, opponents, whos_turn, folds, userMove, commitByRound}: GameDisplayProps) => {
    const [raise, setRaise] = useState(pots['current_bet'] * 2);
    const handleRaise = () => {
        userMove('raise', raise);
    };
    const bigSmall = blinds(settings[4], settings[0])

    return (
        <Box m={3} sx={{display:'flex', width: '100%', height: '45%', justifyContent: 'space-evenly'}}>
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography>
                    Total Players: {settings[0]}
                </Typography>
                <Typography>
                    Players in Round: TODO
                </Typography>
                <Box sx={{display:'flex', justifyContent: 'space-evenly'}}>
                    {Array.from({ length: settings[0] }, (_, index) => (
                        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                            {folds.includes(index + 1) ? (
                                <img key={index} src={PersonFold} alt={`player ${index}`} />
                                ) : (
                                <img key={index} src={Person} alt={`player ${index}`} />
                                )}
                            <Box sx={{margin: 'auto', height: '100%'}}>
                                {index === 0 ? '1 (YOU)' : `${index + 1}`}
                            </Box>
                            {/* keeping track of button and blinds */}
                            <Box my={1}>
                                {settings[4] === index + 1 && <Typography>Button</Typography>}
                                {bigSmall.smallBlind === index + 1 && <Typography>Small</Typography>}
                                {bigSmall.bigBlind === index + 1 && <Typography>Big</Typography>}
                            </Box>
                            <Box>
                                {whos_turn === index + 1 && <strong>Turn</strong>}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{display: 'flex', flexDirection:'column'}}>
                <Typography>Total Chips: {pots['total']}</Typography>
                <Typography>Total Current Pot: {pots['totalPot']} chips</Typography>
                {/* <Typography>Current Bet: {pots['current_bet']} chips</Typography> */}
                <Typography>Your Committed Chips: {pots['committed']} chips</Typography>
                <Typography sx={{marginLeft: 'auto', marginRight: 'auto', fontWeight: '600'}}>CURRENT BET: {pots['current_bet']} chips</Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-evenly', marginBottom: 0}}>
                    
                {pots['current_bet'] !== 0 ? (
                    <Button disabled={whos_turn !== 1} onClick={() => userMove('call', 0)} sx={{ backgroundColor: '#BEBEBE', margin: 1, color: 'black' }}>
                        Call {pots['current_bet']}
                    </Button>
                    ) : (
                    <Button disabled={whos_turn !== 1} onClick={() => userMove('check', 0)} sx={{ backgroundColor: '#BEBEBE', margin: 1, color: 'black' }}>
                        Check
                    </Button>
                    )}
                    <Button disabled={whos_turn !== 1} onClick={handleRaise}sx={{backgroundColor: '#BEBEBE', margin:1, color: 'black'}}>
                        Raise
                    </Button>
                    <Button disabled={whos_turn !== 1} onClick={() => userMove('fold', 0)} sx={{backgroundColor: '#BEBEBE', margin:1, color: 'black'}}>
                        Fold
                    </Button>
                </Box>
                <Box sx={{ marginLeft: 'auto',marginRight: 'auto', textAlign: 'center', marginTop: 0}}>
                    <IncrementNumber aria-label="Raise Amount" defaultValue={pots['current_bet'] * 2} min={pots['current_bet'] * 2} max={pots['total']} onChange={(event,value) => setRaise(value ?? pots['current_bet'] * 2)}/>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>

                </Box>
            </Box>
            <Box sx={{display:'flex', flexDirection: 'column', width: '250px'}}>
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
                                <Typography mb={1}>{opponents[index + 2]['commit']}</Typography>
                                <Box>
                                    <Box sx={{display:'flex'}}>
                                        {opponents[index + 2] && <Card value={opponents[index + 2]['cards'][0][0]} suit={opponents[index + 2]['cards'][0][1]} status={true} small={true}/>}
                                        {opponents[index + 2] && <Card value={opponents[index + 2]['cards'][1][0]} suit={opponents[index + 2]['cards'][1][1]} status={true} small={true}/>}
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