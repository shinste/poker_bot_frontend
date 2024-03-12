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
        // if (scrollableRef.current) {
        //     scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        // }
        if (scrollableRef.current) {
            scrollableRef.current.scrollIntoView()
        }
    }, [conversation]);

    return (
        <Box mt={3} mb={1} sx={{ width: '40%', height: '10rem', backgroundColor: "#BEBEBE", marginLeft: 'auto', marginRight: 'auto', borderRadius: 3, overflow: 'hidden', overflowY: 'auto' }} ref={scrollableRef}>
            <Box m={2}>
                {conversation.map((item: string, index: number) => (    
                    <div ref={scrollableRef}style={{textAlign:'left', margin: 2}} key={index}>
                            {item.includes('ERROR') || item.includes('YOU HAVE LOST') && <Typography sx={{color: 'red'}}>{item}</Typography>}
                            {item.includes('Round Feedback') || item.includes('Suggestion') ? 
                                <Typography sx={{color: 'green'}}> {item}</Typography>
                                    :
                                <Typography>
                                    {item.includes('Move:') && <strong>Game Move: </strong>}
                                    {item.includes('wins') && <strong>Round Conclusion: </strong>}
                                    {item}
                                </Typography>
                            }
                            
                            
                            
                        
                    </div>
                ))}
            </Box>
            
        </Box>
    );
}

export default DialogBox;
