import React, { useState } from "react";
import Appbar from "../../Appbar/Appbar.jsx";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Modal, Box, TextField, Typography, useMediaQuery, Select, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Helper function to generate school year options
const generateSchoolYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Generate options for past 2 years and next year
    for (let i = -2; i <= 1; i++) {
        const startYear = (currentYear + i).toString().slice(-2);
        const endYear = (currentYear + i + 1).toString().slice(-2);
        years.push(`${startYear}${endYear}`);
    }
    return years;
};

const ResupplyHistoryData = [
    { id: 1, day: 'Monday', date: '2024-01-15', processedBy: 'John Smith' },
    { id: 2, day: 'Tuesday', date: '2024-01-16', processedBy: 'Maria Garcia' },
    { id: 3, day: 'Wednesday', date: '2024-01-17', processedBy: 'David Chen' },
    { id: 4, day: 'Thursday', date: '2024-01-18', processedBy: 'Sarah Johnson' },
    { id: 5, day: 'Friday', date: '2024-01-19', processedBy: 'James Wilson' },
    { id: 6, day: 'Monday', date: '2024-01-22', processedBy: 'Emily Brown' },
    { id: 7, day: 'Tuesday', date: '2024-01-23', processedBy: 'Michael Lee' },
    { id: 8, day: 'Wednesday', date: '2024-01-24', processedBy: 'Lisa Anderson' },
    { id: 9, day: 'Thursday', date: '2024-01-25', processedBy: 'Robert Taylor' },
    { id: 10, day: 'Friday', date: '2024-01-26', processedBy: 'Jennifer Martinez' },
];

const itemsBorrowed = [
    { 
        id: 1, 
        name: 'Test Tubes', 
        quantity: 5,
        variants: [
            { id: 1, name: 'Pyrex 100mL Test Tube', serialNumber: 'TT100-001' },
            { id: 2, name: 'Pyrex 100mL Test Tube', serialNumber: 'TT100-002' },
            { id: 3, name: 'Pyrex 100mL Test Tube', serialNumber: 'TT100-003' },
        ]
    },
    { 
        id: 2, 
        name: 'Beakers', 
        quantity: 3,
        variants: [
            { id: 1, name: 'Glass Beaker 250mL', serialNumber: 'BK250-001' },
            { id: 2, name: 'Glass Beaker 250mL', serialNumber: 'BK250-002' },
            { id: 3, name: 'Glass Beaker 250mL', serialNumber: 'BK250-003' },
        ]
    },
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

export default function ResupplyHistory() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(generateSchoolYearOptions()[2]); // Default to current school year
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (row) => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        // Here you can add logic to show item variants
        // For example, expanding the row or showing a new modal
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRows = ResupplyHistoryData.filter((row) => {
        return (
            row.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.processedBy.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                <Appbar />
                <Sidebar page={"history"} style={{ position: 'fixed', height: '100vh', width: '250px' }} />
                <div style={{ marginLeft: '15px', width: 'calc(100% - 270px)', padding: '20px', marginTop: '100px' }}>
                    <Select
                        value={selectedSchoolYear}
                        onChange={(e) => setSelectedSchoolYear(e.target.value)}
                        sx={{ marginBottom: '10px', marginRight: '10px', width: '150px' }}
                    >
                        {generateSchoolYearOptions().map((year) => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </Select>
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
                                    <TableCell>Day</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Processed By</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedRows.map((row) => (
                                    <TableRow key={row.id} onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer' }}>
                                        <TableCell>{row.day}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.processedBy}</TableCell>
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
                            Resupply Details
                        </Typography>

                        <Typography variant="body1">Date: {selectedItem?.date}</Typography>
                        <Typography variant="body1">Processed By: {selectedItem?.processedBy}</Typography>
                        <TableContainer component={Paper} style={{width: '100%', height: '100%'}} stickyHeader>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell 
                                            sx={{
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
                                       }}>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {itemsBorrowed.map((item, index) => (
                                        <React.Fragment key={item.id}>
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Accordion>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls={`panel${index}-content`}
                                                            id={`panel${index}-header`}
                                                        >
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                                <Typography>{item.name}</Typography>
                                                                <Typography sx={{ marginRight: 2 }}>Quantity: {item.quantity}</Typography>
                                                            </Box>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Item Variant</TableCell>
                                                                        <TableCell>Serial Number</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {item.variants.map((variant) => (
                                                                        <TableRow key={variant.id}>
                                                                            <TableCell>{variant.name}</TableCell>
                                                                            <TableCell>{variant.serialNumber}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button variant="outlined" sx={{color: '#800000', borderColor: '#800000'}}
                                    onClick={handleCloseModal}>Close</Button>
                        </Box>
                    </Box>
                </Modal>


            </div>
        </ThemeProvider>
    );
}
