

import { Paper, styled } from "@mui/material";

const StyledPaper = styled(Paper)(({ theme, width, height, border }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    width: width || '100%', // Default to 'auto' if width is not provided
    height: height || 'auto',
    border: border || 'none',// Default to 'auto' if height is not provided
}));

export default StyledPaper;