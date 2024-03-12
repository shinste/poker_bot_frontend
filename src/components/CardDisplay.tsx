import {Typography, Box} from '@mui/material';
import { useState, useEffect } from 'react';
import Card from './Card';
import determineBestHand from '../functions/handDetect';

interface DisplayProps {
    turn: number,
    cardsData: {
        [key: number]: [string, string][];
        playing: [string, string][];
    };
}

const CardDisplay = ({ turn, cardsData}: DisplayProps) => {

    const [bestHand, setBestHand] = useState('');

    useEffect(() => {
        // Call the determineBestHand function when the turn or cardsData change
        const newBestHand = determineBestHand(turn, 1, cardsData);
        setBestHand(String(newBestHand[0]));
    }, [turn, cardsData]);

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Box sx={{display: 'flex', margin: 'auto'}}>
                <Card value={cardsData['playing'][0][0]} suit={cardsData['playing'][0][1]} status={turn >= 1}/>
                <Card value={cardsData['playing'][1][0]} suit={cardsData['playing'][1][1]} status={turn >= 1}/>
                <Card value={cardsData['playing'][2][0]} suit={cardsData['playing'][2][1]} status={turn >= 1}/>
                <Card value={cardsData['playing'][3][0]} suit={cardsData['playing'][3][1]} status={turn >= 2}/>
                <Card value={cardsData['playing'][4][0]} suit={cardsData['playing'][4][1]} status={turn >= 3}/>
            </Box>
            <Box sx={{display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginTop: 2}}>
                <Card value={cardsData[1][0][0]} suit={cardsData[1][0][1]} status={true}/>
                <Card value={cardsData[1][1][0]} suit={cardsData[1][1][1]} status={true}/>
            </Box>
            <Typography sx={{color: 'white'}}my={2}>{bestHand}</Typography>
        </Box>
    );
}

export default CardDisplay;