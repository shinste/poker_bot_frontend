import * as React from 'react';
import { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
    conversation: string[];
}

const DialogBox: React.FC<Props> = ({ conversation }) => {

    const scrollableRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        // Scroll to the bottom when conversation updates
        if (scrollableRef.current) {
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }
    }, [conversation]);

    return (
        <Box mt={3} mb={1} sx={{ width: '40%', height: '10rem', backgroundColor: "#BEBEBE", marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, overflow: 'hidden', overflowY: 'auto' }} ref={scrollableRef}>
            <Box m={2}>
                {conversation.map((item: string, index: number) => (
                    <div style={{textAlign:'left', margin: 2}} key={index}>
                        {item.includes('Player') && <strong>Game Move: </strong>}
                        {item}
                    </div>
                ))}
            </Box>
            
        </Box>
    );
}

export default DialogBox;
