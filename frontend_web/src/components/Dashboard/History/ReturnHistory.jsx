import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../Sidebar/Sidebar.jsx';
import Appbar from '../../Appbar/Appbar.jsx';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Button, Modal, Box, Typography, TextField, Select, MenuItem, Snackbar, IconButton,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getJWTSub, getJWTUid } from '../../Authentication/jwt.jsx';
import {useNavigate} from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export default function ReturnHistory({ userId }) {
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
    const [groupedItems, setGroupedItems] = useState({});
    const [itemStatuses, setItemStatuses] = useState([]);
    const instiId = getJWTSub();
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
                apiUrl = `https://it342-lemsliteteachers.onrender.com/api/preparing-items/getpreparingitems?instiId=${instiId}&status=Returned`;
            } else {
                apiUrl = `https://it342-lemsliteteachers.onrender.com/api/preparing-items/getpreparingitems?status=Returned`;
            }

            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                const revrsedDate = response.data.reverse();
                const groupedData = revrsedDate.reduce((acc, item) => {
                    const refCode  = item.referenceCode;
                    if (!acc[refCode ]) {
                        acc[refCode ] = [];
                    }
                    acc[refCode ].push(item);
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
                ? `https://it342-lemsliteteachers.onrender.com/api/preparing-items/getpreparingitems?instiId=${instiId}&status=In-use`
                : `https://it342-lemsliteteachers.onrender.com/api/preparing-items/getpreparingitems?status=In-use`;
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
            await axios.put(`https://it342-lemsliteteachers.onrender.com/api/borrowitem/updateStatus/${borrowedId}`, null, {
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

    const handleOpenModal = async (borrowId) => {
        const token = localStorage.getItem("jwtToken");
        const batch = borrowGroups[borrowId] || [];
        setSelectedBatch(batch);
        setSelectedBorrowId(borrowId);
        setOpenModal(true);

        const preparingIds = batch
            .filter(item => item.categoryName !== "Consumables")
            .map(item => item.id);

        const consumables = batch.filter(item => item.categoryName === "Consumables");

        axios.post("https://it342-lemsliteteachers.onrender.com/item/getbypreparingids", preparingIds, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
        })
        .then(response => {
            const nonConsumableItems = response.data;
            const allItems = [...nonConsumableItems, ...consumables];
            const grouped = groupByItemName(allItems);
            setGroupedItems(grouped);
        })
        .catch(error => {
            console.error(error);
        })
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedBatch(null);
        setSelectedBorrowId(null);
        setGroupedItems({})
        setItemStatuses([]);
    };

    const groupByItemName = (batch) => {
          
        return batch.reduce((acc, item) => {
        const name = item.item_name || item.itemName;
          if (!acc[name]) {
            acc[name] = [];
          }
          acc[name].push(item);
          return acc;
        }, {});
    };

    const handleStatusChangePerItem = (status, itemId) => {
        const newStatus = status;
    
        setItemStatuses((prevStatuses) => {
            return {
                ...prevStatuses,
                [itemId]: newStatus,  // Set the new status for the specific itemId
            };
        });
    };
    
    useEffect(() => {
        Object.entries(groupedItems).forEach(([itemName, items]) => {
            if (items[0].categoryName !== 'Consumables') {
                items.forEach(item => {
                    handleStatusChangePerItem("", item.item_id);
                });
            }
        });
    }, [groupedItems]);

    const handleReturnItems = () => {
        const token = localStorage.getItem("jwtToken");
        const uid = getJWTUid();
        const hasBlankStatus = Object.values(itemStatuses).includes("");
        const payload = {
            referenceCode: selectedBatch[0].referenceCode,
            itemStatuses: itemStatuses
        }
        if(hasBlankStatus){
            alert("Non-consumable items should have return status")
            return
        }
        axios.post(`https://it342-lemsliteteachers.onrender.com/batchreturn/add?uid=${uid}`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            handleCloseModal();
            fetchBorrowData();
        })
        .catch(error => {
            console.error(error);
        })
    }

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
                        <Button variant="contained"
                                onClick={() => setShowBorrowList(!showBorrowList)}
                                sx={{
                                    minWidth: '150px', // Adjust as needed
                                    height: '50px',    // Adjust as needed for consistent height
                                    whiteSpace: 'nowrap', // Prevent text from wrapping to maintain size
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis', // Show ellipsis for longer text
                                    justifyContent: 'center' // Center text horizontally
                                }}
                        >
                            {showBorrowList ? "View Main List" : "View Borrow List"}
                        </Button>
                        {localStorage.getItem("userRole") === '1' && (
                        <Button variant="contained"
                                style={{ backgroundColor: "#4CAF50", color: "white" }}
                                onClick={() => navigate("/inventory")}
                                sx={{
                                    minWidth: '150px', // Same minWidth
                                    height: '50px',    // Same height
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    justifyContent: 'center'
                                }}
                        >
                            Borrow More
                        </Button>
                        )}
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
                                disabled
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
                                                <TableCell>{item.referenceCode || "N/A"}</TableCell>
                                                <TableCell>{item.categoryName || "N/A"}</TableCell>
                                                <TableCell>{item.itemName || "N/A"}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    {item.dateCreated ? new Date(item.dateCreated).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }) : "N/A"}
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
                                                <TableCell>Borrowed Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredGroups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(([borrowId, items]) => (
                                                <TableRow key={borrowId} style={{ cursor: 'pointer' }} onClick={(e) => {
                                                    if (!e.target.closest('.status-dropdown')) {
                                                        handleOpenModal(borrowId);
                                                    }
                                                }}>
                                                    <TableCell>{items[0].referenceCode}</TableCell>
                                                    <TableCell>{items[0].user?.first_name && items[0].user?.last_name ? `${items[0].user.first_name} ${items[0].user.last_name}` : "N/A"}</TableCell>
                                                    <TableCell>
                                                    {items[0].dateCreated ? new Date(items[0].dateCreated).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }) : "N/A"}
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
                    {selectedBatch && (<>
                        <Typography variant="h6" component="h2"
                                sx={{fontWeight: 'bold', color: '#016565', textAlign: 'center'}}>
                        Borrow ID {selectedBorrowId}
                        </Typography>

                        <Typography variant="body1">Date Borrowed: {selectedBatch[0].dateCreated ? new Date(selectedBatch[0].dateCreated).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }) : "N/A"}
                        </Typography>
                        <Typography>
                            Schedule: "N/A"
                        </Typography>
                        <Typography variant="body1">Teacher: {selectedBatch[0]?.user?.first_name && selectedBatch[0]?.user?.last_name
                                ? `${selectedBatch[0].user.first_name} ${selectedBatch[0].user.last_name}`
                                : "N/A"}</Typography>
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
                                        color: '#016565',
                                        textAlign: 'right',
                                        paddingRight: '100px'
                                    }}>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(groupedItems).map(([itemName, items]) => (
                                    <React.Fragment key={itemName}>
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls={`panel${itemName}-content`}
                                                        id={`panel${itemName}-header`}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                            <Typography>{itemName}</Typography>
                                                            <Typography sx={{ marginRight: 2 }}>Quantity: {items[0].categoryName === 'Consumables' ? items[0].quantity : items.length}</Typography>
                                                        </Box>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Item</TableCell>
                                                                    <TableCell>Serial Number</TableCell>
                                                                    <TableCell>Category</TableCell>
                                                                    {items[0].categoryName !== 'Consumables' && <TableCell sx={{width: '250px'}}>Return Status</TableCell>}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {items.map((item, index) => {
                                                                    return(
                                                                        <TableRow key={index}>
                                                                            <TableCell>{item.item_name ? item.item_name : item.itemName}</TableCell>
                                                                            <TableCell>{item.unique_id ? item.unique_id : ""}</TableCell>
                                                                            <TableCell>{item.categoryName ? item.categoryName : item.inventory.item_category.category_name}</TableCell>
                                                                            {items[0].categoryName !== 'Consumables' && 
                                                                                <TableCell>
                                                                                <Box
                                                                                  sx={{
                                                                                    width: '200px',
                                                                                    px: 2,
                                                                                    py: 1,
                                                                                    borderRadius: '4px',
                                                                                    bgcolor:
                                                                                      item.status === "Damage"
                                                                                        ? '#c33130'
                                                                                        : item.status === "Missing"
                                                                                        ? '#a86a0d'
                                                                                        : item.status === "Wrong Item"
                                                                                        ? '#ffcc00'
                                                                                        : item.status === "Available"
                                                                                        ? '#0c9a17'
                                                                                        : 'transparent',
                                                                                    color: item.status === "Wrong Item" ? 'black' : 'white',
                                                                                    fontWeight: 500,
                                                                                    textAlign: 'center',
                                                                                  }}
                                                                                >
                                                                                  {item.status === "Available" ? "Returned" : item.status}
                                                                                </Box>
                                                                              </TableCell>
                                                                              
                                                                            }
                                                                        </TableRow>
                                                                    )
                                                                })}
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
                    </>)}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" sx={{color: '#800000', borderColor: '#800000'}}
                                onClick={handleCloseModal}>Close</Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}