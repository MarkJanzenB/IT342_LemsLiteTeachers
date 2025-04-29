import React, { useEffect, useState } from "react";
import Appbar from "../../Appbar/Appbar.jsx";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination, Modal, Box, TextField, Typography, useMediaQuery, Select, MenuItem } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";

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
    const jwtToken = localStorage.getItem("jwtToken");
    const [ResupplyHistoryData, setResupplyHistoryData] = useState([]);
    const [itemsBorrowed, setItemsBorrowed] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(generateSchoolYearOptions()[2]); // Default to current school year
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        getAllDistinct()
    }, [])

    const getAllDistinct = () => {
        axios.get(`https://it342-lemsliteteachers.onrender.com/batchresupply/getalldistinct`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            const transformedData = response.data.map((entry, index) => {
                const [date, user] = entry;
                return{
                    id: index + 1,
                    day: new Date(date).toLocaleDateString('en-US', {weekday: 'long'}),
                    date: date,
                    processedBy: `${user.first_name} ${user.last_name}`,
                    user: user,
                }
            })
            setResupplyHistoryData(transformedData);
        })
        .catch(error => {
            console.log(error);
        })
    }

    const getResupplyHistory = (date, uid) => {
        axios.get(`https://it342-lemsliteteachers.onrender.com/item/resupplyhistory?dateResupply=${date}&uid=${uid}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            setItemsBorrowed(response.data)
        })
        .catch(error => {
            console.log(error);
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (row) => {
        setOpenModal(true);
        setSelectedItem(row);
        getResupplyHistory(row.date, row.user.user_id);
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
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

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
                                    <TableCell>Role</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedRows.map((row) => (
                                    <TableRow key={row.id} onClick={() => handleOpenModal(row)} style={{ cursor: 'pointer' }}>
                                        <TableCell>{row.day}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.processedBy}</TableCell>
                                        <TableCell>{row.user.role.role_name}</TableCell>
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
                                    {itemsBorrowed && (<>
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
                                    </>)
                                    }
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
