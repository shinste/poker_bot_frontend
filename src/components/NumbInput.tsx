import { Box, Text, NumberInput, NumberInputField, InputLeftElement, Icon, InputGroup } from '@chakra-ui/react'


interface StartComponentProps {
    text: String;
    defaultNumber: number
    min: number
    max: number
  }
  

const NumbInput: React.FC<StartComponentProps> = ({text, defaultNumber, min, max}) => {
    return (
        <Box margin={10}>
            <Text>{text}</Text>
            <Box w={30} style={{marginLeft:'auto', marginRight:'auto'}}>
                <NumberInput w={20}size='lg' defaultValue={defaultNumber} min={min} max={max}>
                    <NumberInputField />
                </NumberInput>
            </Box>
        </Box>
    );
}

export default NumbInput;