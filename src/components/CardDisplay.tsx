import {Typography, Box} from '@mui/material';
import Card from './Card';
import PersonTable from './PersonTable';
import Blind from './Blind';
import blinds from '../functions/blinds';

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
    settings: number[];
}

const CardDisplay = ({ turn, cardsData, turnWord, commitByRound, players, folds, pots, playerTurn, settings}: DisplayProps) => {
    let bigSmall = blinds(settings[4], settings[0]);

    

    return (
        <Box mt={10}>
            <Box mb={-15}sx={{display:'flex', width:'28rem', marginLeft:'auto', marginRight:'auto'}}>
                <Blind small={3 === bigSmall.smallBlind} big={3 === bigSmall.bigBlind} right={false} center={false}/>
                <Blind small={4 === bigSmall.smallBlind} big={4 === bigSmall.bigBlind} right={true} center={false}/>
            </Box>
            <Box my={0}sx={{display: 'flex', width: '30%', marginLeft: 'auto', marginRight:'auto', marginTop: -5}}>
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
            <Box mt={-15} sx={{width:'28rem', marginLeft:'auto', marginRight:'auto'}}>
                <Blind small={2 === bigSmall.smallBlind} big={2 === bigSmall.bigBlind} right={false} center={false}/>
                <Blind small={1 === bigSmall.smallBlind} big={1 === bigSmall.bigBlind} right={false} center={true}/>
                <Blind small={5 === bigSmall.smallBlind} big={5 === bigSmall.bigBlind} right={true} center={false}/>
            </Box>
            <Box my={0}sx={{marginLeft: 'auto', marginRight:'auto', width: '80px'}}>
                    <PersonTable position={'left'} commit={commitByRound.hasOwnProperty(1) ? commitByRound[1] : 0}player={1} fold={folds.includes(1)} playerTurn={playerTurn}/>
            </Box>
        </Box>
        
    );
}

export default CardDisplay;