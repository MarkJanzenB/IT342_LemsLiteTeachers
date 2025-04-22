import React, { useState } from "react";
import Appbar from "../../Appbar/Appbar.jsx";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Modal, Box, TextField, Typography, Checkbox, FormControlLabel, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ReturnHistoryData = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    instructor: `Instructor ${index + 1}`,
    time: `1${index + 1}:30`,
    yearSec: `Year & Sec ${index + 1}`,
    dateBorrowed: `2023-10-${index + 1}`,
}));

const itemsBorrowed = [
    { id: 1, name: 'Item placeholder', quantity: 12, serialNumbers: ['WAT003'] },
    { id: 2, name: 'Item placeholder', quantity: 12, serialNumbers: ['ASDASDW'] },
    { id: 3, name: 'Item placeholder', quantity: 12, serialNumbers: ['ASDWA'] },
    { id: 4, name: 'Item placeholder', quantity: 12, serialNumbers: ['WAASDASD03'] },
    { id: 5, name: 'Item placeholder', quantity: 12, serialNumbers: ['WAT00ASDAS3'] },
    { id: 6, name: 'Item placeholder', quantity: 12, serialNumbers: ['WAASDAS03'] },
    { id: 7, name: 'Item placeholder', quantity: 12, serialNumbers: ['WATGFDAVD3'] },
];

const theme = createTheme({
    palette: {
        primary: { main: '#016565' },
        secondary: { main: '#000000' }
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#016565',
                    color: '#FFFFFF',
                },
                body: {
                    fontSize: 14,
                },
            },
        },
    },
});

export default function ReturnHistory() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [serialNumberModalOpen, setSerialNumberModalOpen] = useState(false);
    const [incidentReportModalOpen, setIncidentReportModalOpen] = useState(false);
    const [combinedSuccessModalOpen, setCombinedSuccessModalOpen] = useState(false);
    const [selectedSerialNumbers, setSelectedSerialNumbers] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [breakageDescription, setBreakageDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState("");
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenConfirmModal = () => {
        if (selectedItems.length > 0) {
            setIncidentReportModalOpen(true);
        } else {
            setConfirmModalOpen(true);
        }
    };

    const handleCloseConfirmModal = () => {
        setConfirmModalOpen(false);
    };

    const handleConfirmReport = () => {
        setConfirmModalOpen(false);
        setIncidentReportModalOpen(false); // Close the incident reports modal
        if (selectedItems.length > 0) {
            setCombinedSuccessModalOpen(true);
        } else {
            setSuccessModalOpen(true);
        }
    };

    const handleCloseSuccessModal = () => {
        setSuccessModalOpen(false);
        setOpenModal(false);
    };

    const handleCloseCombinedSuccessModal = () => {
        setCombinedSuccessModalOpen(false);
        setOpenModal(false);
    };

    const handleCloseSerialNumberModal = () => {
        setSerialNumberModalOpen(false);
    };

    const handleCloseIncidentReportModal = () => {
        setIncidentReportModalOpen(false);
    };

    const handleItemSelection = (itemId) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    };

    const handleBreakageDescriptionChange = (event) => {
        setBreakageDescription(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRows = ReturnHistoryData.filter((row) => {
        return (
            row.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.yearSec.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.dateBorrowed.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (

        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                <Appbar page={"history"}/>
                <Sidebar page={"history"} style={{ position: 'fixed', height: '100vh', width: '250px' }} />
                <div style={{ marginLeft: '15px', width: 'calc(100% - 270px)', padding: '20px', marginTop: '100px' }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ marginBottom: '10px', width: isSmallScreen ? '90vw' : '80vw' }}
                    />
                    <TableContainer component={Paper} style={{ width: '100%', height: '80%' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Instructor</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Section</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedRows.map((row) => (
                                    <TableRow key={row.id} onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
                                        <TableCell>{row.instructor}</TableCell>
                                        <TableCell>{row.time}</TableCell>
                                        <TableCell>{row.yearSec}</TableCell>
                                        <TableCell>{row.dateBorrowed}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[10]}
                            component="div"
                            count={filteredRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </div>

                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '90%',
                            maxHeight: '90%',
                            bgcolor: '#FFF',
                            boxShadow: 24,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: '25px',
                            overflow: 'auto',
                            color: '#016565',
                        }}
                    >
                        <div style={{position: 'absolute', top: 24, right: 8}}>
                            <Button onClick={handleCloseModal}><img src={"/exit.gif"} style={{
                                width: '30px',
                                height: '30px',
                            }}/></Button>
                        </div>
                        <Typography variant="h6" component="h2"
                                    sx={{fontWeight: 'bold', color: '#016565', textAlign: 'center'}}>
                            Borrowed Items
                        </Typography>

                        <Typography variant="body1"> Teacher's name: Mr. Instructor</Typography>
                        <Typography variant="body1">Schedule: Nov 21, 2024 | 10:00 AM - 12:00 PM</Typography>
                        <Typography variant="body1">Items borrowed list:</Typography>
                        <TableContainer component={Paper} style={{width: '100%', height: '100%'}} stickyHeader>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#F2EE9D',
                                            zIndex: 1,
                                            color: '#016565'
                                        }}>Item Name</TableCell>
                                        <TableCell sx={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#F2EE9D',
                                            zIndex: 1,
                                            color: '#016565'
                                        }}>Quantity Borrowed</TableCell>
                                        <TableCell sx={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#F2EE9D',
                                            zIndex: 1,
                                            color: '#016565'
                                        }}>Quantity To Return</TableCell>
                                        <TableCell sx={{
                                            position: 'sticky',
                                            top: 0,
                                            backgroundColor: '#F2EE9D',
                                            zIndex: 1,
                                            color: '#016565'
                                        }}>Unreturned items Broken or lost?</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemsBorrowed.map((item, index) => {
                                        const [currentQuantity, setCurrentQuantity] = useState(item.quantity);

                                        const handleIncrement = () => {
                                            if (currentQuantity < item.quantity) {
                                                setCurrentQuantity(currentQuantity + 1);
                                            }
                                        };

                                        const handleDecrement = () => {
                                            if (currentQuantity > 0) {
                                                setCurrentQuantity(currentQuantity - 1);
                                            }
                                        };

                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    <Button onClick={handleDecrement}>-</Button>
                                                    {currentQuantity}
                                                    <Button onClick={handleIncrement}>+</Button>
                                                </TableCell>
                                                <TableCell>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => handleItemSelection(item.id)}
                                                            />
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button variant="outlined" sx={{color: '#800000', borderColor: '#800000'}}
                                    onClick={handleCloseModal}>Close</Button>
                            <Button variant="contained" sx={{
                                backgroundColor: '#800000',
                                color: '#FFF',
                                '&:hover': {backgroundColor: '#5c0000'}
                            }} onClick={handleOpenConfirmModal}>Return Items</Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal open={serialNumberModalOpen} onClose={handleCloseSerialNumberModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                            bgcolor: '#FFF',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '15px',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#016565' }}>Serial Numbers</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Serial Number</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedSerialNumbers.map((serialNumber, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{serialNumber}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button variant="contained" onClick={handleCloseSerialNumberModal} sx={{ mt: 2, color: 'white', backgroundColor: 'maroon' }}>Close</Button>
                    </Box>
                </Modal>

                <Modal open={confirmModalOpen} onClose={handleCloseConfirmModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            boxShadow: 24,
                            bgcolor: '#FFF',
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: '15px',
                            textAlign: 'center'
                        }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#016565' }} variant="h6">
                            Are you sure you want to return these Items?
                        </Typography>
                        <Typography sx={{ color: '#016565' }}>
                            Make sure to check the items you are returning.
                        </Typography>
                        <Box display="flex" justifyContent="space-around" mt={2}>
                            <Button variant="contained" sx={{ backgroundColor: 'maroon' }} onClick={handleConfirmReport}>Yes</Button>
                            <Button variant="outlined" sx={{ backgroundColor: 'maroon', color: 'white' }} onClick={handleCloseConfirmModal}>No</Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal open={incidentReportModalOpen} onClose={handleCloseIncidentReportModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            boxShadow: 24,
                            bgcolor: '#FFF',
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: '15px',
                            textAlign: 'center'
                        }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#016565' }} variant="h6">
                            Incident Report
                        </Typography>
                        <TextField
                            sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                            label="Description of Incident"
                            variant="outlined"
                            fullWidth
                            value={breakageDescription}
                            onChange={handleBreakageDescriptionChange}
                        />
                        <Box display="flex" justifyContent="space-around" mt={2}>
                            <Button variant="contained" sx={{ backgroundColor: 'maroon' }} onClick={handleConfirmReport}>Submit</Button>
                            <Button variant="outlined" sx={{ backgroundColor: 'maroon', color: 'white' }} onClick={handleCloseIncidentReportModal}>Cancel</Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal open={successModalOpen} onClose={handleCloseSuccessModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                            bgcolor: '#FFF',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '15px',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#016565' }}>Items Successfully Returned</Typography>
                        <Button variant="contained" onClick={handleCloseSuccessModal} sx={{ mt: 2, color: 'white', backgroundColor: 'maroon' }}>OK</Button>
                    </Box>
                </Modal>

                <Modal open={combinedSuccessModalOpen} onClose={handleCloseCombinedSuccessModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 300,
                            bgcolor: '#FFF',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: '15px',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#016565' }}>Items Returned and Damage Report Submitted Successfully</Typography>
                        <Button variant="contained" onClick={handleCloseCombinedSuccessModal} sx={{ mt: 2, color: 'white', backgroundColor: 'maroon' }}>OK</Button>
                    </Box>
                </Modal>
            </div>
        </ThemeProvider>
    );
}