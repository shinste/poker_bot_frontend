import * as React from 'react';
import {Box} from '@mui/material';
interface Props {
    small: boolean;
    big: boolean;
    right: boolean;
    center: boolean;

}

const Blind = ({small, big, right, center} : Props) => {
    if (!small && !big) {
        return (<div></div>);
    }
    let blind = 'SB';
    if (big) { 
        blind = 'BB';
    }
    if (right) {
        return (
            <Box sx={{width: '30px', marginLeft: 'auto'}}>{blind}</Box>
        );
    }
    if (center) {
        return (
            <Box sx={{width: '30px', marginLeft: 'auto', marginRight: 'auto'}}>{blind}</Box>
        );
        
    }
    return (
        <Box sx={{width: '30px'}}>{blind}</Box>
    )
};

export default Blind;