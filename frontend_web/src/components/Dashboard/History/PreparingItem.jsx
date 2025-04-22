import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Appbar from "../../Appbar/Appbar.jsx";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import {
    Button, Typography, Snackbar, IconButton, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, TextField, MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Select from 'react-select';
import { getJWTUid } from "../../Authentication/jwt.jsx";
import { getJWTInstiId } from "../../Authentication/jwt.jsx";

export default function PreparingItem() {
    const [preparingItems, setPreparingItems] = useState([]);
    const [filteredPreparingItems, setFilteredPreparingItems] = useState([]);
    const [groupedItems, setGroupedItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [itemQuantities, setItemQuantities] = useState({});
    const [uniqueIds, setUniqueIds] = useState({});
    const [showQuantities, setShowQuantities] = useState(false);
    const [displayUniqueIds, setDisplayUniqueIds] = useState(false);
    const [uniqueIdOptions, setUniqueIdOptions] = useState([]); // Unique IDs for dropdown
    const navigate = useNavigate();
    const uid = getJWTUid();
    const instiId = getJWTInstiId();
    const userRole = localStorage.getItem("userRole");

    const groupByReferenceCode = (items) => {
        const grouped = {};
        items.forEach(item => {
            const refCode = item.referenceCode || `PI-${item.id}`;
            if (!grouped[refCode]) {
                grouped[refCode] = [];
            }
            grouped[refCode].push(item);
        });
        return grouped;
    };

    useEffect(() => {
        fetchPreparingData();
        fetchUniqueIds();
    }, []);

    const fetchPreparingData = async () => {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            console.error("Missing token.");
            return;
        }

        try {
            let apiUrl = `http://localhost:8080/api/preparing-items/uid/${instiId}`;
            console.log("instiId in component:", instiId);
            if (userRole !== "1") {
                apiUrl = `http://localhost:8080/api/preparing-items/all`;
            }

            const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });

            if (Array.isArray(response.data)) {
                const grouped = groupByReferenceCode(response.data.reverse());
                setGroupedItems(grouped);
                setFilteredPreparingItems(response.data.reverse());

                const uniqueCategories = [...new Set(response.data.map(item => item.categoryName))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error("Error fetching preparing items:", error);
            setPreparingItems([]);
        }
    };

    const fetchUniqueIds = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.error("Missing token.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:8080/api/preparing-items/unique-ids", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                const options = response.data.map(id => ({ value: id, label: id }));
                setUniqueIdOptions(options);
            }
        } catch (error) {
            console.error("Error fetching unique IDs:", error);
        }
    };

    useEffect(() => {
        filterItems();
    }, [searchQuery, categoryFilter, preparingItems]);

    const filterItems = () => {
        let filtered = preparingItems;

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.referenceCode?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(item => item.categoryName === categoryFilter);
        }

        setFilteredPreparingItems(filtered);
    };

    const handleRowClick = (refCode) => {
        const batch = groupedItems[refCode];
        setSelectedBatch(batch);
        setOpenModal(true);
        setItemQuantities({});
        setUniqueIds({});
        setShowQuantities(false);
        setDisplayUniqueIds(false);
    };

    const handleViewQuantity = (item) => {
        const quantity = item.quantity;
        setItemQuantities(prev => ({ ...prev, [item.id]: quantity }));
        setUniqueIds(prev => {
            let newUniqueIds = {};
            for (let i = 0; i < quantity; i++) {
                newUniqueIds[item.id + "-" + i] = "";
            }
            return { ...prev, [item.id]: newUniqueIds };
        });
        setShowQuantities(true);
    };

    const handleUniqueIdChange = (itemId, index, selectedOption) => {
        setUniqueIds(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [itemId + "-" + index]: selectedOption ? selectedOption.value : ""
            }
        }));
    };

    const handleDone = () => {
        console.log("Unique IDs:", uniqueIds);
        setDisplayUniqueIds(true);
    };

    const handleCancel = () => {
        setShowQuantities(false);
        setDisplayUniqueIds(false);
        setOpenModal(true);
    };

    return (
        <>
            <Appbar page={"borrow-list"} />
            <div className="inventory-container">
                <Sidebar page={"history"} />
                <div className="inventory-content">

                    {/* Search and Filter Section */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px", alignItems: "center" }}>
                        <TextField
                            label="Search by Ref. Code or Item Name"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button variant="contained" style={{ backgroundColor: "#016565", color: "white" }} onClick={() => navigate("/inventory")}>
                            Borrow More
                        </Button>
                    </div>

                    {/* Table View */}
                    <TableContainer component={Paper} sx={{
                        maxHeight: "calc(100vh - 300px)",
                        overflowY: "auto"
                    }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Preparation ID</TableCell>
                                    <TableCell>Borrower</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(groupedItems).map((refCode) => (
                                    <TableRow >
                                        <TableCell>{refCode}</TableCell>
                                        <TableCell>
                                            {groupedItems[refCode][0]?.user ? `${groupedItems[refCode][0].user.first_name} ${groupedItems[refCode][0].user.last_name}` : 'N/A'}
                                        </TableCell>
                                        <TableCell>{groupedItems[refCode][0]?.status || 'N/A'}</TableCell>
                                        <TableCell>
                                            {userRole === "1" ? (
                                                <Button onClick={() => handleRowClick(refCode)} variant="outlined">View All</Button>
                                            ) : (
                                                <Button onClick={() => handleRowClick(refCode)} variant="contained" style={{ backgroundColor: "#016565", color: "white" }}>Check Out</Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
            </div>

            {/* Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)} sx={{ zIndex: 1300 }}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '1000px',
                    height: '80%',
                    bgcolor: '#F2EE9D',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    gap: 3,
                    overflow: 'hidden',
                    borderRadius: 2
                }}>
                    {/* Main Panel */}
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#016565', mb: 2 }}>
                            Preparing ID {selectedBatch?.[0]?.referenceCode || `PI-${selectedBatch?.[0]?.id}`}
                        </Typography>
                        <Typography><strong>Teacher Name:</strong> {selectedBatch?.[0]?.user ? `${selectedBatch[0].user.first_name} ${selectedBatch[0].user.last_name}` : "N/A"}</Typography>
                        <Typography><strong>Schedule:</strong> N/A</Typography>
                        <Typography><strong>Date Borrowed:</strong> {selectedBatch?.[0]?.borrowedDate ? new Date(selectedBatch[0].borrowedDate).toLocaleString() : "N/A"}</Typography>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Status</TableCell>
                                        {userRole !== "1" && <TableCell>Action</TableCell>} {/* Conditionally render Action header */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedBatch && selectedBatch.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.categoryName}</TableCell>
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            {userRole !== "1" && (
                                                <TableCell>
                                                    <Button onClick={() => handleViewQuantity(item)} variant="outlined">
                                                        View All
                                                    </Button>
                                                </TableCell>
                                            )} {/* Conditionally render Action cell */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Side Panel (Detail/Extra) */}
                    <Box sx={{
                        width: '300px',
                        bgcolor: '#ffffff',
                        borderLeft: '1px solid #ccc',
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}>
                        {/* Batch Summary or Quantity Details or Displayed Unique IDs */}
                        {displayUniqueIds ? (
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    Unique IDs
                                </Typography>
                                {selectedBatch && selectedBatch.map(item => {
                                    if (uniqueIds[item.id]) {
                                        return (
                                            <Box key={item.id}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {item.itemName}:
                                                </Typography>
                                                {Object.entries(uniqueIds[item.id]).map(([key, value]) => (
                                                    <Typography key={key} variant="body2">
                                                        {key.split("-")[1] + 1}. {value}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        );
                                    }
                                    return null;
                                })}
                            </Box>
                        ) : (
                            showQuantities ? (
                                <Box sx={{ mt: 2 }}>
                                    {selectedBatch && selectedBatch.map(item => {
                                        if (itemQuantities[item.id] > 0) {
                                            return (
                                                <Box key={item.id}>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.itemName} Quantities:</Typography>
                                                    {Array.from({ length: itemQuantities[item.id] }, (_, index) => (
                                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <Typography>
                                                                {index + 1}. {item.itemName} UniqueID:
                                                            </Typography>
                                                            <Select
                                                                value={uniqueIds[item.id]?.[item.id + "-" + index] ? { value: uniqueIds[item.id][item.id + "-" + index], label: uniqueIds[item.id][item.id + "-" + index] } : null}
                                                                onChange={(selectedOption) => handleUniqueIdChange(item.id, index, selectedOption)}
                                                                options={uniqueIdOptions}
                                                                isSearchable
                                                                styles={{ control: (provided) => ({ ...provided, width: 200 }) }}
                                                            />
                                                        </Box>
                                                    ))}
                                                </Box>
                                            );
                                        }
                                        return null;
                                    })}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <Button onClick={handleDone} variant="contained" sx={{ mr: 1, backgroundColor: "#016565" }}>Done</Button>
                                        <Button onClick={handleCancel} variant="outlined">Cancel</Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Batch Summary
                                    </Typography>
                                    <Typography variant="body2"><strong>Preparing ID:</strong> {selectedBatch?.[0]?.referenceCode}</Typography>
                                    <Typography variant="body2"><strong>Total Items:</strong> {selectedBatch?.length}</Typography>
                                    <Typography variant="body2"><strong>Status:</strong> {selectedBatch?.[0]?.status}</Typography>
                                </Box>
                            )
                        )}

                        <Button
                            onClick={() => {
                                if (userRole === "1") {
                                    setOpenModal(false); // Close modal only
                                } else {
                                    // Implement checkout logic here, including validation
                                    // For now, just close the modal
                                    setOpenModal(false);
                                }
                            }}
                            variant="contained"
                            sx={{ mt: 4, backgroundColor: "#016565" }}
                        >
                            {userRole === "1" ? "OKAY" : "Proceed to Checkout"}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Snackbar */}
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
    );
}