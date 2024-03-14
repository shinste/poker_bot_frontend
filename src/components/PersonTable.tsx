import Person from '../icons/Person.png';
import PersonFold from '../icons/PersonFold.png';
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import Indicator from '../icons/Indicator.png';


interface Props {
    position: string;
    commit: number;
    player: number;
    fold: boolean;
    playerTurn: number;
}

const PersonTable: React.FC<Props> = ({ position, commit, player, fold, playerTurn}) => {
    let pos: string | number = 0;
    if (position === 'right') {
        pos = 'auto'
    }
        return(
            <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: pos}}>
                <Typography sx={{color:'whitesmoke'}}>Player {player}</Typography>
                {fold ? <img src={PersonFold} /> : <img src={Person} />}
                <Typography sx={{color:'whitesmoke'}}>{commit} Chips</Typography>
                <Box sx={{height: '20px', marginLeft: 'auto', marginRight: 'auto'}}>
                    {player === playerTurn && <img src={Indicator}/>}
                </Box>
                
            </Box>
        )
};

export default PersonTable;