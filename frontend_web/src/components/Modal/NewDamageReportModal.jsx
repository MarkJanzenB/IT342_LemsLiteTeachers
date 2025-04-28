import React, { useState } from "react";
import { Box, Button, TextField, Modal, Typography } from "@mui/material";

const NewDamageReportModal = ({ open, onClose}) => {
    const [serialNo, setSerialNo] = useState('');
    const [itemName, setItemName] = useState('');
    const [dateBorrowed, setDateBorrowed] = useState('');
    const [subject, setSubject] = useState('');
    const [yearSec, setYearSec] = useState('');
    const [instructor, setInstructor] = useState('');
    const [photo, setPhoto] = useState('');
    const [accountable, setAccountable] = useState('');
    const [searchItem, setSearchItem] = useState('');

    const handleAddReport = () => {
        if (!serialNo || !itemName || !dateBorrowed || !subject || !yearSec || !instructor || !accountable) {
            alert('Please fill in all required fields');
            return;
        }

        const newReport = {
            serialNo,
            itemName,
            dateBorrowed,
            subject,
            yearSec,
            instructor,
            photo,
            accountable,
            status: 'Unresolved'
        };

        onClose();
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxHeight: '90%',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                borderRadius: '20px',
                boxShadow: 24,
                p: 4
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <Typography 
                        id="simple-modal-title" 
                        variant="h6" 
                        component="h2"
                    >
                        *New Damage Report*
                    </Typography>
                    
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        color="secondary"
                    >
                        X
                    </Button>
                </Box>
                            
                <br/>

                <TextField
                    label="Search Item"
                    variant="outlined"
                    fullWidth
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    sx={{ marginBottom: '10px' }}
                />

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <TextField
                        label="Serial No"
                        variant="outlined"
                        fullWidth
                        value={serialNo}
                        onChange={(e) => setSerialNo(e.target.value)}
                        sx={{ marginBottom: '10px', 
                            marginRight: '10px' 
                        }}
                    />

                    <TextField
                        label="Item Name"
                        variant="outlined"
                        fullWidth
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        sx={{ marginBottom: '10px' }}
                    />
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <TextField
                        label="Date Borrowed"
                        variant="outlined"
                        fullWidth
                        value={dateBorrowed}
                        onChange={(e) => setDateBorrowed(e.target.value)}
                        sx={{ 
                            marginBottom: '10px', 
                            marginRight: '10px' 
                        }}
                    />

                    <TextField
                        label="Subject"
                        variant="outlined"
                        fullWidth
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        sx={{ marginBottom: '10px' }}
                    />
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <TextField
                        label="Year & Section"
                        variant="outlined"
                        fullWidth
                        value={yearSec}
                        onChange={(e) => setYearSec(e.target.value)}
                        sx={{ 
                            marginBottom: '10px', 
                            marginRight: '10px' 
                        }}
                    />

                    <TextField
                        label="Instructor"
                        variant="outlined"
                        fullWidth
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        sx={{ marginBottom: '10px' }}
                    />
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <TextField
                        label="Photo [proof of damage]"
                        variant="outlined"
                        fullWidth
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        sx={{ 
                            marginBottom: '10px', 
                            marginRight: '10px' 
                        }}
                    />

                    <Button
                        variant={'contained'}
                        sx={{ 
                            marginBottom: '10px', 
                            width: '150px' 
                        }}
                    >
                        Upload File
                    </Button>
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                    <TextField
                        label="Accountable"
                        variant="outlined"
                        fullWidth
                        value={accountable}
                        onChange={(e) => setAccountable(e.target.value)}
                        sx={{ 
                            marginBottom: '10px',
                             marginRight: '10px' 
                        }}
                    />
                </Box>

                <Button 
                    onClick={handleAddReport} 
                    variant="contained" 
                    color="primary">
                        Add Report
                </Button>
            </Box>
        </Modal>
    );
};

export default NewDamageReportModal;