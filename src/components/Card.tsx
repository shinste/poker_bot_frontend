import * as React from 'react';
import {Button, Typography, Box, InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import Club from '../icons/Club.png';
import Diamond from '../icons/Diamond.png'
import Spade from '../icons/Spade.png'
import Heart from '../icons/Heart.png'

interface CardProps {
    value?: string | number;
    suit?: string;
    status: boolean;
    small?: boolean;
}

const Card = ({ value, suit, status, small}: CardProps) => {
    if (small) {
        return(
            <Box sx={{backgroundColor: "#BEBEBE", width: '35px', height: '58px', borderRadius: 1, marginLeft: '2px', marginRight: '2px'}}>
                {status && 
                    <Box m={1}>
                        {value && <Typography>{value}</Typography>}
                        {suit == 'club' && <Box sx={{margin:'auto'}}><img src={Club} alt="Club" /></Box>}
                        {suit == 'diamond' && <Box sx={{margin:'auto'}}><img src={Diamond} alt="Diamond" /></Box>}
                        {suit == 'spade' && <Box sx={{margin:'auto'}}><img src={Spade} alt="Spade" /></Box>}
                        {suit == 'heart' && <Box sx={{margin:'auto'}}><img src={Heart} alt="Heart" /></Box>}
                    </Box>
                }
            </Box>
        );
    }
    return(
        <Box mx={1} sx={{backgroundColor: "#BEBEBE", width: '45px', height: '70px', borderRadius: 1}}>
            {status && 
                <Box m={1}>
                    {value && <Typography>{value}</Typography>}
                    {suit == 'club' && <Box sx={{margin:'auto'}}><img src={Club} alt="Club" /></Box>}
                    {suit == 'diamond' && <Box sx={{margin:'auto'}}><img src={Diamond} alt="Diamond" /></Box>}
                    {suit == 'spade' && <Box sx={{margin:'auto'}}><img src={Spade} alt="Spade" /></Box>}
                    {suit == 'heart' && <Box sx={{margin:'auto'}}><img src={Heart} alt="Heart" /></Box>}
                </Box>
            }
        </Box>
    );
    
}

export default Card;