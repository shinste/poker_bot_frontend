import {Button, Typography, Box, InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import React, { useState, SetStateAction, Dispatch} from 'react';
import IncrementNumber from './IncrementNumber';

interface StartComponentProps {
  setInitial: Dispatch<SetStateAction<boolean>>;
  setSettings: Dispatch<SetStateAction<number[]>>;
}

const StartComponent: React.FC<StartComponentProps> = ({ setInitial, setSettings }) => {
    const [difficulty, setDifficulty] = useState(2);
    const [players, setPlayers] = useState(3);
    const [buyIn, setBuyIn] = useState(200);
    const [bigBlind, setBigBlind] = useState(5);


    const handleDifficulty = (event: any) => {
        setDifficulty(event.target.value);
    };
      const handlePlayers = (event: any) => {
        setPlayers(event.target.value);
    };

    const handleButtonClick = async () => {
        setSettings([players + 1, buyIn, bigBlind, difficulty, 1]);
          setInitial(false);
        };
    

    return (
        <div>
            <div className='gray'>
                <Typography m={0} sx={{color: 'white'}} >PokerBot is a hands-on learning poker experience where you can</Typography>
                <Typography m={0}sx={{color: 'white'}} >enjoy fun games of poker while improving each hand!</Typography>
                <Typography m={0} sx={{color: 'white'}}>We provide move recommendations, statistical </Typography>
                <Typography m={0} sx={{color: 'white'}}>analysis, and strategic insight.</Typography>
                <Typography m={0} sx={{color: 'white'}}>Press Play Game to Start</Typography>
            </div>
            <div style={{alignItems: 'center', marginTop:80}}>
                <Box sx={{border: '2px solid #A8A8A8', margin: 'auto', width: '30%', height: '30rem', backgroundColor: "#BEBEBE", borderRadius: 8}}>
                    <Box className='vertical-flex' style={{height: '100%'}}>
                        <Box mt={2} mb={4}>
                            <Typography>Buy-In</Typography>
                            <Box sx={{width: "44%", margin: 'auto'}}>
                                <IncrementNumber aria-label="Buy-In" defaultValue={200} min={10} onChange={(event,value) => setBuyIn(value ?? 200)}/>
                            </Box>
                        </Box>
                        <Box mb={4}>
                            <Typography>Big Blind</Typography>
                            <Box sx={{width: "44%", margin: 'auto', textAlign: 'center'}}>
                                <IncrementNumber aria-label="BigBlind" defaultValue={2} min={0} onChange={(event,value) => setBigBlind(value ?? 5)}/>
                            </Box>
                        </Box>
                        <Box mb={4} sx={{width: '44%', marginLeft: 'auto',marginRight: 'auto'}}>
                            <Typography>Number of Bots</Typography>
                            <FormControl fullWidth sx={{backgroundColor: 'white'}}>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                sx={{backgroundColor: 'white',"& .MuiSelect-select": {paddingLeft: '30px'}}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={players}
                                onChange={handlePlayers}
                                >
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mb={2}sx={{width: '44%', marginLeft: 'auto',marginRight: 'auto'}}>
                            <Typography>Bot Difficulty</Typography>
                            <FormControl fullWidth sx={{backgroundColor: 'white'}}>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                sx={{backgroundColor: 'white', "& .MuiSelect-select": {paddingLeft: '30px'}}}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={difficulty}
                                onChange={handleDifficulty}
                                >
                                <MenuItem value={1}>Beginner</MenuItem>
                                <MenuItem value={2}>Medium</MenuItem>
                                <MenuItem value={3}>Professional</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ height: 300 }}>
                            <Button onClick={handleButtonClick}>Play Game</Button>
                        </Box>
                        
                        
                    </Box>
                </Box>
            </div>

        </div>

    );
};

export default StartComponent;