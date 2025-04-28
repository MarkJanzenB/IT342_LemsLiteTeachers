import React, { useState, useEffect } from 'react';
                  import { AppBar, Toolbar, Button, Typography } from '@mui/material';
                  import { useNavigate, Link } from 'react-router-dom';
                  import './Appbar.css';
                  import Modal from "@mui/material/Modal";
                  import Box from "@mui/material/Box";
                  import profile from '/src/assets/static/img/profile2.gif';
                  import m1 from '/src/assets/static/img/menu.png';
                  import logo from '/src/assets/static/img/LEMS1.png';
                  import axios from 'axios';
                  import { getJWTUid } from '../Authentication/jwt';

                  const Appbar = ({ page, roleMessage }) => {
                    const navigate = useNavigate();
                    const [open, setOpen] = useState(false);
                    const handleOpen = () => setOpen(true);
                    const handleClose = () => setOpen(false);
                    const [isAuthenticated, setIsAuthenticated] = useState(false);
                    const [fetchedData, setFetchedData] = useState({});

                    useEffect(() => {
                      const jwtToken = localStorage.getItem("jwtToken");
                      if(jwtToken){
                        setIsAuthenticated(true);
                        axios.get(`http://localhost:8080/user/getuser?uid=${getJWTUid()}`, {
                          headers: {
                              "Authorization": `Bearer ${jwtToken}`
                          }
                          })
                          .then(response => {
                              setFetchedData(response.data);
                          })
                          .catch(error => {
                              console.log("Thy error: ",error.data);
                          })
                      }else{
                        setIsAuthenticated(false);
                      }
                      
                    }, []);

                      const handleLogout = () => {
                          localStorage.clear(); // Clears all stored items
                          navigate('/login', { replace: true });
                      };


                      useEffect(() => {
                          const jwtToken = localStorage.getItem("jwtToken");
                          const instiId = localStorage.getItem("instiId");

                          if (jwtToken && instiId) {
                              // You might want to validate instiId pattern or even make a backend call here
                              const isValidInstiId = /^[a-zA-Z0-9-_]+$/.test(instiId); // Example validation

                              if (!isValidInstiId) {
                                  console.warn("InstiId tampering detected!");
                                  handleLogout(); // Force logout if it's tampered
                                  return;
                              }

                              // Continue your normal logic here (e.g., fetch user)
                          } else {
                              setIsAuthenticated(false);
                          }
                      }, []);

                      const style = {
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 400,
                      bgcolor: '#F2EE9D',
                      border: '2px solid #000',
                      boxShadow: 24,
                      p: 4,
                      borderRadius: '10px',
                    };

                    const buttonStyle = {
                      border: '1px solid #056765',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      margin: '8px 0',
                      display: 'block',
                      textAlign: 'center',
                      textDecoration: 'none',
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: '#FFF1DB',
                      }
                    };

                    const closeButtonStyle = {
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      color: '#056765',
                      border: '1px solid #056765',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        backgroundColor: '#056765',
                        color: '#FFF'
                      }
                    };

                    return (
                        <AppBar className="appbar">
                          <Toolbar className="appbar-toolbar">
                            {isAuthenticated ? (
                                <img src={logo} alt="Logo" className="appbar-logo" />
                            ) : (
                                <Link to="/" style={{ textDecoration: 'none' }}>
                                  <img src={logo} alt="Logo" className="appbar-logo" />
                                </Link>
                            )}
                            <div style={{ flexGrow: 1 }} />
                            <Typography variant="h6" className="appbar-typography" sx={{ color: '#036464' }}>
                              {roleMessage}
                            </Typography>
                            {page === 'home' ? (
                                <>
                                  <Button
                                      variant={'outlined'}
                                      sx={{
                                        fontSize: '1.5em',
                                        '&:hover': {
                                          backgroundColor: '#FFF1DB',
                                          color: '#BAFFC9',
                                        },
                                      }}
                                      onClick={handleOpen}
                                  >
                                    <img src={m1} alt="menu" style={{ width: '50px', height: '50px' }} />
                                  </Button>
                                  <Modal
                                      open={open}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <div style={{ position: 'absolute', top: 20, right: 7 }}>
                                        <Button onClick={handleClose}><img src={"/exit.gif"} style={{
                                          width: '20px',
                                          height: '20px',
                                        }}/></Button>
                                      </div><br/>

                                      <Typography id="modal-modal-title" variant="h6" component="h2" align={"center"}>
                                        <Link to="/register" style={{ textDecoration: 'none' }}>
                                          <Box sx={{
                                            ...buttonStyle,
                                            '&:hover': {
                                              bgcolor: '#056765',
                                              '& button': {
                                                color: '#FFF'
                                              }
                                            }
                                          }}>
                                            <Button sx={{
                                              fontFamily: 'monospace',
                                              fontWeight: 'bold',
                                              color: '#056765',
                                            }}>Create An Account</Button><br />
                                          </Box>
                                        </Link>
                                        <Link to="/login" style={{ textDecoration: 'none' }}>
                                          <Box sx={{
                                            ...buttonStyle,
                                            '&:hover': {
                                              bgcolor: '#056765',
                                              '& button': {
                                                color: '#FFF'
                                              }
                                            }
                                          }}>
                                            <Button sx={{
                                              fontFamily: 'monospace',
                                              fontWeight: 'bold',
                                              color: '#056765',
                                            }}>Sign In</Button><br />
                                          </Box>
                                        </Link>
                                      </Typography>
                                    </Box>
                                  </Modal>
                                </>
                            ) : (
                                <>
                                  <div className="vertical-line"></div>
                                  <Button
                                      variant={'outlined'}
                                      sx={{
                                        fontSize: '1.5em',
                                        '&:hover': {
                                          backgroundColor: '#FFF1DB',
                                          color: 'white',
                                        },
                                      }}
                                      onClick={handleOpen}
                                  >
                                    {/* <img src={fetchedData.pfp} alt="Profile" style={{ width: '50px', height: '50px' }} /> */}
                                    <div className='appbar-profile-pic' style={{backgroundImage: `url(${fetchedData.pfp ? fetchedData.pfp : profile})`}}></div>
                                  </Button>
                                  <Modal
                                      open={open}
                                      aria-labelledby="modal-modal-title"
                                      aria-describedby="modal-modal-description"
                                  >
                                    <Box sx={style}>
                                      <div style={{ position: 'absolute', top: 20, right: 7 }}>
                                        <Button onClick={handleClose}><img src={"/exit.gif"} style={{
                                          width: '20px',
                                          height: '20px',
                                        }}/></Button>
                                      </div><br/>
                                      <Typography id="modal-modal-title" variant="h6" component="h2" align={"center"}>
                                        <Link to="/updateuser" style={{ textDecoration: 'none' }}>
                                          <Box sx={{
                                            ...buttonStyle,
                                            '&:hover': {
                                              bgcolor: '#056765',
                                              '& button': {
                                                color: '#FFF'
                                              }
                                            }
                                          }}>
                                            <Button sx={{
                                              fontFamily: 'monospace',
                                              fontWeight: 'bold',
                                              color: '#056765',
                                            }}>Edit Profile</Button><br />
                                          </Box>
                                        </Link>
                                          <Box sx={{ ...buttonStyle }}>
                                              <Button
                                                  sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#056765' }}
                                                  onClick={handleLogout} // Only handleLogout
                                              >
                                                  Log out
                                              </Button>
                                          </Box>

                                      </Typography>
                                    </Box>
                                  </Modal>
                                </>
                            )}
                          </Toolbar>
                        </AppBar>
                    );
                  };

                  export default Appbar;