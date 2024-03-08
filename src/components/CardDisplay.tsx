import * as React from 'react';
import {Button, Typography, Box, InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import { useState, useEffect } from 'react';
import Card from './Card';
import getApi from '../functions/getApi';
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
    const [highCard, setHighCard] = useState('');

    useEffect(() => {
        // Function to determine the best hand based on the turn and cardsData
        // const determineBestHand = () => {
        //     // Combine hole cards and community cards based on the turn

        //     const convertMap: { [key: string | number]: number | string} = {
        //         'J': 11,
        //         'Q': 12,
        //         'K': 13,
        //         'A': 14,
        //         11: 'J',
        //         12: 'Q',
        //         13: 'K',
        //         14: 'A',
        //     };

        //     const convert = (cardValue: number) => {
        //         if (cardValue > 10) {
        //             return convertMap[cardValue];
        //         }
        //         return cardValue;
        //     }

        //     const straight = (deck: [string | number, string][]) => {
        //         let consecutive = 1
        //         let maximum = 0
        //         let lastValue = 0
        //         const numbers = deck.map(card => {
        //             return card[0];
        //         })
        //         numbers.sort().forEach(card => {
        //             if (card == lastValue + 1) {
        //                 consecutive += 1
        //                 if (consecutive > 4) {
        //                     maximum = Number(card)
        //                 }
        //             } else if (lastValue != Number(card)){
        //                 consecutive = 1
        //             }
        //             lastValue = Number(card);
        //         })
        //         return maximum
        //     }

        //     const handCards = (hands: [string | number, string][]) => {               
        //         if (hands[0][0] == hands[1][0]) {
        //             return `${convert(Number(hands[0][0]))} Pair`
        //         } else {
        //             return `${convert(Math.max(Number(hands[0][0]), Number(hands[1][0])))} High`
        //         }
        //     }

        //     let allCards: [string | number, string][] = [];
        //     if (turn >= 1) allCards.push(...cardsData['playing'].slice(0, 3));
        //     if (turn >= 2) allCards.push(cardsData['playing'][3]);
        //     if (turn === 3) allCards.push(cardsData['playing'][4]);
        //     allCards.push(...cardsData[1]);
            
        //     allCards = allCards.map(card => {
        //         if (typeof card[0] === 'string') {
        //             const value = convertMap[card[0]];
        //             return [value, card[1]];
        //         } else {
        //             return [card[0], card[1]];
        //         }
                
        //     });
        //     setValueMap({});
        //     allCards.map(card => {
        //         if (valueMap[Number(card[0])]) {
        //             valueMap[Number(card[0])] += 1
        //         } else {
        //             valueMap[Number(card[0])] = 1
        //         }});

        //     // IF 
        //     if (allCards.length == 2) {
        //         // setHighCard(allCards);
        //         return handCards(allCards);
        //     } 

        //     // FLUSH CHECK
        //     const suitMap: { [key: string]: number}= {
        //         'spade': 0,
        //         'club': 0,
        //         'heart': 0,
        //         'diamond': 0
        //     }
        //     // Updating suitmap to keep track of suits
        //     allCards.forEach(card => {
        //         suitMap[card[1]] += 1
        //     })
        //     // check if flush is available
        //     let flushMax = 0
        //     if (Math.max(...Object.values(suitMap)) > 4) {
        //         // FLUSH STRAIGHT CHECK
        //         let flushSuit: String = '';
        //         for (let [key, value] of Object.entries(suitMap)) {
        //             if (value > 4) {
        //                 flushSuit = key;
        //             }
        //         }

        //         // taking only the cards that have this suit, also laying out all values for 4 of a kind, trips, 2pair and pair
        //         let suitOnly: [string | number, string][] = [];
        //         allCards.forEach(card => {
        //             if (card[1] === flushSuit) {
        //                 flushMax = Math.max(flushMax, Number(card[0]));
        //                 suitOnly.push(card);
        //             }
        //         });
        //         //checking if straight flush is available
        //         const check = straight(suitOnly);

        //         // ROYAL FLUSH CHECK
        //         if (check > 0 && flushMax == 14) {
        //             return 'ROYAL FLUSH!'
        //         // STRAIGHT FLUSH
        //         } else if (check > 0) {
        //             return `${convert(flushMax)} High Straight Flush`;
        //         }
        //     }
        //     // Checking values for 4 of a kind, Full House, Trips, Two Pair, Pair 
        //     let trips = 0
        //     let pairs = []
        //     for (let [key, value] of Object.entries(valueMap)) {
        //         // 4 OF A KIND CHECK
        //         if (value == 4) {
        //             return `${key} High Four of a Kind`;
        //         } else if (value == 3) {
        //             trips = Math.max(trips, Number(key));
        //         } else if (value == 2) {
        //             pairs.push(Number(key));
        //         }
        //     }

        //     // FULL HOUSE CHECK
        //     if (trips > 0 && pairs.length > 0) {
        //         return `${convert(trips)} High Full House`;
        //     }

        //     // FLUSH CHECK
        //     if (flushMax > 0) {
        //         return `${convert(flushMax)} High Flush`;
        //     }

        //     const straightChecker = straight(allCards);

        //     // STRAIGHT CHECK
        //     if (straightChecker > 0) {
        //         return `${convert(straightChecker)} High Straight`;
        //     }
            
        //     // THREE OF A KIND CHECK
        //     if (trips > 0) {
        //         return `${convert(trips)} High Three of a Kind`;
        //     }

        //     // TWO PAIR CHECK
        //     if (pairs.length > 1) {
        //         return `${convert(Math.max(...pairs))} High Two Pair`;
        //     }

        //     // ONE PAIR CHECK
        //     if (pairs.length == 1) {
        //         return `${convert(pairs[0])} Pair`;
        //     }
        //     return handCards(allCards.slice(-2));
        // };

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
            <Box sx={{display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginTop: 6}}>
                <Card value={cardsData[1][0][0]} suit={cardsData[1][0][1]} status={true}/>
                <Card value={cardsData[1][1][0]} suit={cardsData[1][1][1]} status={true}/>
            </Box>
            <Typography my={2}>{bestHand}</Typography>
        </Box>
    );
}

export default CardDisplay;