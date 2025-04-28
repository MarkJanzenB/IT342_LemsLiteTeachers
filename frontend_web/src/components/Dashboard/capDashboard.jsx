import React, { useEffect, useState } from 'react';
            import { useNavigate } from "react-router-dom";
            import { Button, Typography, CircularProgress } from '@mui/material';
            import StyledPaper from "../MyPaper.jsx";
            import Box from '@mui/material/Box';
            import Chart from "../Chart.jsx";
            import Appbar from "../Appbar/Appbar.jsx";
            import { getJWTFName, getJWTSub, isJWTExpired } from "../Authentication/jwt.jsx";
            import axios from "axios";
            import GetStarted from '../GetStarted/GetStarted.jsx';
            import { useLocation } from 'react-router-dom';
            


            export default function Dashboard() {
                const [isNew, setIsNew] = useState(false);
                const [loading, setLoading] = useState(true);
                const navigate = useNavigate();
                const first_name = getJWTFName();
                const location = useLocation(); // Get the current location

                const roleid = localStorage.getItem("userRole"); // Retrieve the user's role
                const instiId = localStorage.getItem("instiId"); // Retrieve instiId from localStorage
                const [showFullWelcome, setShowFullWelcome] = useState(true);

                useEffect(() => {
                    // Reset to full welcome if coming from login or fresh load
                    if (location.key && !location.state?.fromDashboardNav) {
                        setShowFullWelcome(true);
                    }
                    // If coming back from a subpage, show minimal message
                    else if (location.state?.fromDashboardNav) {
                        setShowFullWelcome(false);
                    }
                }, [location]);

                const handleNavigation = (path) => {
                    navigate(path, { 
                        state: { fromDashboardNav: true } // Mark that we're navigating away
                    });
                };
            

                useEffect(() => {
                    const checkAuthentication = async () => {
                        const jwtToken = localStorage.getItem("jwtToken");
                        if (!jwtToken || isJWTExpired()) {
                            navigate("/login");
                            return;
                        }

                        try {
                            const jwtSub = getJWTSub(); // Extract instiId from JWT
                            localStorage.setItem("instiId", jwtSub); // Store it in localStorage

                            const response = await axios.get(`http://localhost:8080/user/isusernew?instiId=${jwtSub}`, {
                                headers: { "Authorization": `Bearer ${jwtToken}` },
                            });

                            setIsNew(response.data);
                        } catch (error) {
                            console.error("Error in checkAuthentication:", error);
                            if (error.response && error.response.status === 401) {
                                localStorage.removeItem("jwtToken");
                                localStorage.removeItem("instiId"); // Clear instiId if unauthorized
                                navigate("/login");
                            }
                        } finally {
                            setLoading(false);
                        }
                    };

                    checkAuthentication();
                }, [navigate]);

                
                

                const handleSched = () => navigate('/schedules/upcoming');
                const handleInv = () => navigate('/inventory');
                const handleReps = () => navigate('/reports/incidents');
                const handleBHist = () => navigate('/history/list');

                if (loading) {
                    return (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                            <CircularProgress />
                        </Box>
                    );
                }

                // Function to render role-specific content
                const renderRoleSpecificContent = () => {
                    if (showFullWelcome) {
                    switch (roleid) {
                        case "3":
                            return (
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    Welcome, Teacher {first_name}! You have full access to the system.
                                </Typography>
                            );
                        case "2":
                            return (
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    Welcome, {first_name}! You can manage inventory and reports.
                                </Typography>
                            );
                        case "1":
                            return (
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    Welcome, Teacher {first_name}! You can borrow equipment, view your history and submit reports.
                                </Typography>
                            );
                        default:
                            return (
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    Welcome! Please contact support to assign your role.
                                </Typography>
                            );
                    } 
                }else {
                        return (
                            <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                {first_name}
                            </Typography>
                        );
                    }
                };

                return (
                    <>
                        <Appbar page={'dashboard'} roleMessage={renderRoleSpecificContent()} />

                        {isNew && <GetStarted />}

                        <Box
                            sx={{
                                display: 'flex',
                                height: '100vh',
                                width: '100vw',
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 0.35,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRight: '1px solid #ccc',
                                }}
                            >
                                <StyledPaper
                                    width="500px"
                                    height="410px"
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 2,
                                        padding: 2,
                                        marginTop: '60px'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#FFB3BA',
                                            color: 'black',
                                            fontSize: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                        onClick={handleSched}
                                    >
                                        <img src="/sked.png" style={{ width: '100px', height: '100px' }} alt="Schedule Icon" />
                                        Schedules
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#FFDFBA',
                                            color: 'black',
                                            fontSize: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                        onClick={handleInv}
                                    >
                                        <img src="/inventory.png" style={{ width: '130px', height: '100px' }} alt="Inventory Icon" />
                                        Inventory
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#FFFFBA',
                                            color: 'black',
                                            fontSize: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                        onClick={handleReps}
                                    >
                                        <img src="/statistics.png" style={{ width: '100px', height: '100px' }} alt="Reports Icon" />
                                        Reports
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#BAFFC9',
                                            color: 'black',
                                            fontSize: '20px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                        onClick={handleBHist}
                                    >
                                        <img src="/history.png" style={{ width: '100px', height: '100px' }} alt="History Icon" />
                                        History
                                    </Button>
                                </StyledPaper>
                            </Box>
                            {/* Right Section Content */}
                            <Box
                                sx={{
                                    flex: 0.65,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <StyledPaper
                                    width="900px"
                                    height="700px"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 1,
                                    }}
                                >

                                    <Chart />
                                </StyledPaper>
                            </Box>
                            {/* End Right Section Content */}
                        </Box>
                    </>
                );
            }