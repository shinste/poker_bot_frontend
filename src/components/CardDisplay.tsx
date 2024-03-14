import {Typography, Box} from '@mui/material';
import { useState, useEffect } from 'react';
import Card from './Card';
import Person from '../icons/Person.png';
import PersonTable from './PersonTable';

interface DisplayProps {
    turn: number,
    cardsData: {
        [key: number]: [string, string][];
        playing: [string, string][];
    };
    turnWord: string;
    commitByRound: {
                        [key: number] : number;
                   };
    players: number;
    folds: number[];
    pots: {
        total: number;
        current_bet: number;
        committed: number;
        totalPot: number
    };
    playerTurn: number;
}

const CardDisplay = ({ turn, cardsData, turnWord, commitByRound, players, folds, pots, playerTurn}: DisplayProps) => {

    return (
        <Box>
            <Box my={0}sx={{display: 'flex', width: '30%', marginLeft: 'auto', marginRight:'auto'}}>
                    {players >= 3 && <PersonTable position={'left'} commit={commitByRound.hasOwnProperty(3) ? commitByRound[3] : 0}player={3} fold={folds.includes(3)} playerTurn={playerTurn}/>}
                    {players >= 4 && <PersonTable position={'right'} commit={commitByRound.hasOwnProperty(4) ? commitByRound[4] : 0}player={4} fold={folds.includes(4)} playerTurn={playerTurn}/>}
            </Box>
            <Box mb={-8} mt={-8}sx={{display: 'flex', flexDirection: 'column', border: '5px solid #000000', backgroundColor: '#006600', borderRadius: 30, width: '30%', height: '15rem', marginLeft: 'auto', marginRight: 'auto', overflowY:'visible'}}>
                <Typography m={2} sx={{color: 'white', marginLeft:'auto', marginRight:'auto'}}>{turnWord}</Typography>
                <Box sx={{display: 'flex', margin: 'auto', marginTop: 2, marginBottom: 2}}>
                    <Card value={cardsData['playing'][0][0]} suit={cardsData['playing'][0][1]} status={turn >= 1}/>
                    <Card value={cardsData['playing'][1][0]} suit={cardsData['playing'][1][1]} status={turn >= 1}/>
                    <Card value={cardsData['playing'][2][0]} suit={cardsData['playing'][2][1]} status={turn >= 1}/>
                    <Card value={cardsData['playing'][3][0]} suit={cardsData['playing'][3][1]} status={turn >= 2}/>
                    <Card value={cardsData['playing'][4][0]} suit={cardsData['playing'][4][1]} status={turn >= 3}/>
                </Box>
                <Typography sx={{color: 'BLACK'}}>TOTAL POT: {pots['totalPot']}</Typography>
                <Typography sx={{color: 'gray'}}>CURRENT BET: {pots['current_bet']}</Typography>
            </Box>
            <Box my={0} mb={-10}sx={{display: 'flex', width: '30%', marginLeft: 'auto', marginRight:'auto'}}>
                    {players >= 2 && <PersonTable position={'left'} commit={commitByRound.hasOwnProperty(2) ? commitByRound[2] : 0}player={2} fold={folds.includes(2)} playerTurn={playerTurn}/>}
                    {players >= 5 && <PersonTable position={'right'} commit={commitByRound.hasOwnProperty(5) ? commitByRound[5] : 0}player={5} fold={folds.includes(5)} playerTurn={playerTurn}/>}
            </Box>
            <Box my={0}sx={{marginLeft: 'auto', marginRight:'auto', width: '80px'}}>
                    <PersonTable position={'left'} commit={commitByRound.hasOwnProperty(1) ? commitByRound[1] : 0}player={1} fold={folds.includes(1)} playerTurn={playerTurn}/>
            </Box>
        </Box>
        
    );
}

export default CardDisplay;