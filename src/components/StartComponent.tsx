import { Box, Text, NumberInput, NumberInputField, InputLeftElement, Icon, InputGroup } from '@chakra-ui/react'
import { Select } from '@chakra-ui/react'
import NumbInput from './NumbInput';
import React, { useState, SetStateAction, Dispatch, useContext} from 'react';

interface StartComponentProps {
  setInitial: Dispatch<SetStateAction<boolean>>;
}

const StartComponent: React.FC<StartComponentProps> = ({ setInitial }) => {
    return (
        <div>
            <div>
                <Text m={0} >PokerBot is a hands-on learning poker experience where you can</Text>
                <Text m={0} >enjoy fun games of poker while improving each hand!</Text>
                <Text m={0} >We provide move recommendations, statistical </Text>
                <Text m={0} >analysis, and strategic insight.</Text>
                <Text m={0} >Press Play Game to Start</Text>
            </div>
            <div style={{alignItems: 'center', marginTop:80}}>
                <Box bg='#BEBEBE' w="30%" h='30rem' borderRadius={8} style={{border: '2px solid #A8A8A8', margin: 'auto'}}>
                    <Box className='vertical-flex' style={{height: '100%'}}>
                        <NumbInput text={'Number of Player'} defaultNumber={15} min={3} max={5}/>
                        <NumbInput text={'Buy-In'} defaultNumber={20} min={20} max={500}/>
                        <NumbInput text={'Ante'} defaultNumber={5} min={0} max={100000}/>
                        <Box margin={10}>
                            <Text>Difficulty</Text>
                                <Select icon={<></>}>
                                    <option value='Option 1'>Easy</option>
                                    <option value='Option 2'>Medium</option>
                                    <option value='Option 3'>Difficult</option>
                                </Select>
                                
                        </Box>
                    </Box>
                </Box>
            </div>

        </div>

    );
};

export default StartComponent;