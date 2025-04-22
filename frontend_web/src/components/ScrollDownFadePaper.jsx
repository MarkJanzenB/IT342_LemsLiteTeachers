import React from 'react';
import { useScrollTrigger, Paper, Box } from '@mui/material';
import { styled } from "@mui/material";

const FadeInPaper = styled(Paper)(({ theme, trigger }) => ({
    transition: theme.transitions.create(['opacity', 'visibility'], {
        duration: theme.transitions.duration.standard,
    }),
    opacity: trigger ? 1 : 0,
    visibility: trigger ? 'visible' : 'hidden',
}));

export default function ScrollFadePaper() {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    return (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
            <FadeInPaper trigger={trigger} elevation={4}>
                <Box p={2}>
                    This is a popover paper that fades in when you scroll down.
                </Box>
            </FadeInPaper>
        </Box>
    );
}