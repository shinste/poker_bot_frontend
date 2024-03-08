import { Box, Text, NumberInput, NumberInputField, InputLeftElement, Icon, InputGroup } from '@chakra-ui/react'
import { Typography } from '@mui/material';

interface StartComponentProps {
    defaultNumber: number;
    min: number;
    change: any;
  }
  

const NumbInput: React.FC<StartComponentProps> = ({defaultNumber, min, change}) => {
    return (
        <Box margin={10}>
            <Box w={30} style={{marginLeft:'auto', marginRight:'auto'}}>
                <NumberInput w={30}size='lg' defaultValue={defaultNumber} min={min} onChange={change}>
                    <NumberInputField />
                </NumberInput>
            </Box>
        </Box>
    );
}

export default NumbInput;