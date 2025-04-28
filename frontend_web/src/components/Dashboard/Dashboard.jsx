import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import StyledPaper from "../MyPaper.jsx";
import Box from '@mui/material/Box';
import { getJWTFName } from "../Authentication/jwt.jsx"; // Importing the function to get user's first name
import Appbar from "../Appbar/Appbar.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Dashboard() {
    const navigate = useNavigate();
    const first_name = getJWTFName(); // Fetching the user's first name

    const handleSched = () => {
        navigate('/schedules/upcoming'); // Updated to match the correct route
    };
    const handleInv = () => { 
        navigate('/inventory'); // Updated to match the correct route
    };
    const handleReps = () => {
        navigate('/reports/incidents'); // Already matches
    };
    const handleBHist = () => {
        navigate('/history/list'); // Already matches
    };

    return (
        <>
            <Appbar page={'dashboard'} roleMessage={`Welcome, ${first_name}!`}/> // Passing the user's name to the Appbar

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    width: '100vw',
                    position: 'absolute',
                }}
            >
            <StyledPaper width="700px" height="510px"
                         sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 2,marginTop:'60px'}}>
                <Button variant="contained" sx={{backgroundColor: '#FFB3BA', color: 'black', fontSize:'20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                        onClick={handleSched}><img src={"/sked.png"} style={{
                    width: '100px',
                    height: '100px'
                }}/>Schedule</Button>
                <Button variant="contained" sx={{
                    backgroundColor: '#FFDFBA',
                    color: 'black',
                    fontSize: '20px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                        onClick={handleInv}><img src={"/inventory.png"} style={{
                    width: '130px',
                    height: '100px'
                }}/>Inventory</Button>
                <Button variant="contained" sx={{backgroundColor: '#FFFFBA', color: 'black', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                        onClick={handleReps}><img src={"/statistics.png"} style={{
                    width: '100px',
                    height: '100px'
                }}/>Reports</Button>
                <Button variant="contained" sx={{backgroundColor: '#BAFFC9', color: 'black', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}
                        onClick={handleBHist}><img src={"/history.png"} style={{
                    width: '100px',
                    height: '100px'
                }}/>Borrow History</Button>
            </StyledPaper>
            </Box>
        </>
    );
}
