import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../Sidebar/Sidebar.jsx';
import Appbar from '../../Appbar/Appbar.jsx';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Button, Modal, Box, Typography, TextField, Select, MenuItem, Snackbar, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getJWTUid } from '../../Authentication/jwt.jsx';
import {useNavigate} from "react-router-dom";

const theme = createTheme({
    palette: {
        primary: { main: '#016565' },
        secondary: { main: '#000000' }
    }
});

export default function List({ userId }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal, setOpenModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [borrowGroups, setBorrowGroups] = useState({});
    const [selectedBorrowId, setSelectedBorrowId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showBorrowList, setShowBorrowList] = useState(false); // State to manage toggle
    const [borrowList, setBorrowList] = useState([]);
    const [filteredBorrowList, setFilteredBorrowList] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const uid = getJWTUid();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBorrowData();
        fetchBorrowList();
    }, [userId]);

    const fetchBorrowData = async () => {
        const instiId = localStorage.getItem("instiId");
        const userRole = localStorage.getItem("userRole");
        const token = localStorage.getItem("jwtToken");

        if (!instiId || !userRole || !token) {
            console.error("Missing token, institution ID, or user role.");
            return;
        }

        try {
            let apiUrl;
            if (userRole === "1") {
                apiUrl = `http://localhost:8080/api/borrowitem/uid/${uid}`;
            } else {
                apiUrl = `http://localhost:8080/api/borrowitem/all`;
            }

            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                const groupedData = response.data.reduce((acc, item) => {
                    if (!acc[item.borrowedId]) {
                        acc[item.borrowedId] = [];
                    }
                    acc[item.borrowedId].push(item);
                    return acc;
                }, {});

                setBorrowGroups(groupedData);
            }
        } catch (error) {
            console.error("Error fetching borrow items:", error);
        }
    };

    const fetchBorrowList = async () => {
        const instiId = localStorage.getItem("instiId");
        const token = localStorage.getItem("jwtToken");
        const userRole = localStorage.getItem("userRole");

        if (!instiId || !token) {
            console.error("Missing token or institution ID.");
            return;
        }

        try {
            const apiUrl = userRole === "1"
                ? `http://localhost:8080/api/borrowitem/uid/${uid}`
                : `http://localhost:8080/api/borrowitem/all`;
            const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });

            const data = Array.isArray(response.data) ? response.data : [];
            setBorrowList(data.reverse());
            setFilteredBorrowList(data);

            const uniqueCategories = [...new Set(data.map(item => item.categoryName))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching borrow list:", error);
            setBorrowList([]);
        }
    };

    useEffect(() => {
        filterItems();
    }, [searchQuery, categoryFilter, borrowList]);

    const filterItems = () => {
        let filtered = borrowList;

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toString().includes(searchQuery)
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(item => item.categoryName === categoryFilter);
        }

        setFilteredBorrowList(filtered);
    };

    const handleStatusChange = async (borrowedId, status) => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.error("No JWT token found. Please log in again.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/borrowitem/updateStatus/${borrowedId}`, null, {
                params: { status },
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchBorrowData();
        } catch (error) {
            console.error("Error updating status:", error.response ? error.response.data : error);
        }
    };

    const filteredGroups = Object.entries(borrowGroups)
        .filter(([borrowId, items]) => {
            const matchesSearch = searchQuery === "" ||
                borrowId.toString().includes(searchQuery) ||
                items.some(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = statusFilter === "" || items[0].status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b[1][0].borrowedDate || 0) - new Date(a[1][0].borrowedDate || 0));

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (borrowId) => {
        setSelectedBatch(borrowGroups[borrowId] || []);
        setSelectedBorrowId(borrowId);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedBatch(null);
        setSelectedBorrowId(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                <Appbar />
                <Sidebar page={"history"} />
                <div style={{ padding: '20px', flexGrow: 1, marginTop: '100px', overflow: 'hidden' }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
                        <TextField
                            label="Search by Borrow ID or Item Name"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="contained" onClick={() => setShowBorrowList(!showBorrowList)}>
                            {showBorrowList ? "View Main List" : "View Borrow List"}
                        </Button>
                        <Button variant="contained" style={{ backgroundColor: "#4CAF50", color: "white" }} onClick={() => navigate("/inventory")}>
                            Borrow More

                        </Button>
                        {showBorrowList ? (
                            <Select
                                displayEmpty
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ width: "200px" }}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((category, index) => (
                                    <MenuItem key={index} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        ) : (
                            <Select
                                displayEmpty
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ width: "200px" }}
                            >
                                <MenuItem value="">All Statuses</MenuItem>
                                <MenuItem value="Preparing">Preparing</MenuItem>
                                <MenuItem value="In-use">In-use</MenuItem>
                                <MenuItem value="Returned">Returned</MenuItem>
                                <MenuItem value="Returned with Report">Returned with Report</MenuItem>
                            </Select>
                        )}
                    </div>
                    {showBorrowList ? (
                        <>
                            <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Borrowed ID</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Borrowed Date</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredBorrowList.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.borrowedId || "N/A"}</TableCell>
                                                <TableCell>{item.categoryName || "N/A"}</TableCell>
                                                <TableCell>{item.itemName || "N/A"}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    {item.borrowedDate ? new Date(item.borrowedDate).toLocaleString() : "N/A"}
                                                </TableCell>
                                                <TableCell>{item.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Snackbar
                                open={openSnackbar}
                                autoHideDuration={3000}
                                onClose={() => setOpenSnackbar(false)}
                                message={snackbarText}
                                action={
                                    <IconButton size="small" color="inherit" onClick={() => setOpenSnackbar(false)}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                }
                            />
                        </>
                    ) : (
                        <>
                            <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                <TableContainer component={Paper}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Borrow ID</TableCell>
                                                <TableCell>Teacher Name</TableCell>
                                                <TableCell>Institution ID</TableCell>
                                                <TableCell>Borrowed Date</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([borrowId, items]) => (
                                                <TableRow key={borrowId} style={{ cursor: 'pointer' }} onClick={(e) => {
                                                    if (!e.target.closest('.status-dropdown')) {
                                                        handleOpenModal(borrowId);
                                                    }
                                                }}>
                                                    <TableCell>{borrowId}</TableCell>
                                                    <TableCell>{items[0].user?.first_name && items[0].user?.last_name ? `${items[0].user.first_name} ${items[0].user.last_name}` : "N/A"}</TableCell>
                                                    <TableCell>{items[0].user.insti_id || "N/A"}</TableCell>
                                                    <TableCell>{items[0].borrowedDate ? new Date(items[0].borrowedDate).toLocaleString() : "N/A"}</TableCell>
                                                    <TableCell>
                                                        {localStorage.getItem("userRole") !== "1" ? (
                                                            <Select
                                                                className="status-dropdown"
                                                                value={items[0].status}
                                                                onChange={(e) => handleStatusChange(borrowId, e.target.value)}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MenuItem value="Preparing">Preparing</MenuItem>
                                                                <MenuItem value="In-use">In-use</MenuItem>
                                                            </Select>
                                                        ) : (
                                                            <Typography>{items[0].status}</Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[10]}
                                component="div"
                                count={filteredGroups.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </div>
            </div>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    maxHeight: '90%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#F2EE9D',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    overflow: 'auto'
                }}>
                    {selectedBatch && (
                        <>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#016565', textAlign: 'center' }}>
                                Borrowed ID {selectedBorrowId}
                            </Typography>
                            <Typography>
                                <strong>Teacher Name:</strong> {selectedBatch[0]?.user?.first_name && selectedBatch[0]?.user?.last_name
                                ? `${selectedBatch[0].user.first_name} ${selectedBatch[0].user.last_name}`
                                : "N/A"}
                            </Typography>
                            <Typography>
                                <strong>Schedule:</strong> "N/A"
                            </Typography>
                            <Typography>
                                <strong>Date Borrowed:</strong> {selectedBatch[0]?.borrowedDate ? new Date(selectedBatch[0].borrowedDate).toLocaleString() : "N/A"}
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Borrowed ID</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedBatch.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.borrowedId}</TableCell>
                                                <TableCell>{item.categoryName}</TableCell>
                                                <TableCell>{item.itemName}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Box>
            </Modal>
        </ThemeProvider>
    );
}