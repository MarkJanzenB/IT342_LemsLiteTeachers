import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Appbar from "../../Appbar/Appbar.jsx";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import {
    Button, Typography, Snackbar, IconButton, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box, TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Select from 'react-select';
import { getJWTSub, getJWTUid } from "../../Authentication/jwt.jsx";
import LinearProgress from '@mui/material/LinearProgress';




export default function PreparingItem() {
    const [preparingItems, setPreparingItems] = useState([]);
    const [groupedItems, setGroupedItems] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [itemQuantities, setItemQuantities] = useState({});
    const [uniqueIds, setUniqueIds] = useState({});
    const [uniqueIdOptionsMap, setUniqueIdOptionsMap] = useState({});
    const [teacherSchedule, setTeacherSchedule] = useState("N/A");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const navigate = useNavigate();
    const instiId = getJWTSub();
    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("userRole");
    const [step, setStep] = useState(0); // Initialize step with a default value


    useEffect(() => {
        fetchPreparingData();
    }, []);

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



    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query) {
            setFilteredItems(preparingItems);
            return;
        }

        const filtered = preparingItems.filter(item => {
            const refCode = item.referenceCode ? item.referenceCode.toLowerCase() : `pi-${item.id}`;
            const borrower = item.user ? `${item.user.first_name} ${item.user.last_name}`.toLowerCase() : "";
            const status = item.status ? item.status.toLowerCase() : "";

            return refCode.includes(query) || borrower.includes(query) || status.includes(query);
        });

        setFilteredItems(filtered);
    };


    const fetchPreparingData = async () => {
        if (!token) {
            console.error("Missing token.");
            return;
        }

        try {
            let apiUrl = `http://localhost:8080/api/preparing-items/getpreparingitems?instiId=${instiId}&status=Preparing`;
            if (userRole !== "1") {
                apiUrl = `http://localhost:8080/api/preparing-items/getpreparingitems?status=Preparing`;
            }

            const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });

            if (Array.isArray(response.data)) {
                const reversedData = response.data.reverse();
                const grouped = groupByReferenceCode(reversedData);
                setGroupedItems(grouped);
                setPreparingItems(reversedData);
                setFilteredItems(reversedData); // <-- ADD THIS
            }
        } catch (error) {
            console.error("Error fetching preparing items:", error);
            setPreparingItems([]);
        }
    };

    const handleRowClick = async (refCode) => {
        const batch = groupedItems[refCode];
        setSelectedBatch(batch);
        setOpenModal(true);

        if (batch && batch[0]?.id) {
            fetchTeacherSchedule(batch[0].id);
        } else {
            setTeacherSchedule("N/A");
        }

        const newItemQuantities = {};
        const newUniqueIds = {};
        for (const item of batch) {
            const quantity = item.quantity;
            newItemQuantities[item.id] = quantity;

            const idsForItem = {};
            for (let i = 0; i < quantity; i++) {
                const key = `${item.id}-${i}`;
                idsForItem[key] = "";
            }
            newUniqueIds[item.id] = idsForItem;
        }
        setItemQuantities(newItemQuantities);
        setUniqueIds(newUniqueIds);

        await Promise.all(
            batch.map(item => fetchUniqueIdsForItemName(item.itemName, item.categoryName))
        )
    };

    const fetchTeacherSchedule = async (preparingItemId) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/preparing-items/teacherSchedule/${preparingItemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data) {
                const schedule = response.data;
                const formattedSchedule = `${new Date(schedule.date).toLocaleDateString()} | ${schedule.startTime} - ${schedule.endTime} | Lab ${schedule.labNum || schedule.location || 'N/A'}`;
                setTeacherSchedule(formattedSchedule);
            } else {
                setTeacherSchedule("N/A");
            }
        } catch (error) {
            console.error("Error fetching teacher schedule:", error);
            setTeacherSchedule("N/A");
        }
    };

    const fetchUniqueIdsForItemName = async (itemName, category) => {
        const response = await axios.get(
            `http://localhost:8080/item/getuniqueids?itemName=${itemName}&category=${category}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const options = response.data.map(id => ({ value: id, label: id }));
        setUniqueIdOptionsMap(prev => ({
            ...prev,
            [itemName]: options
        }))
    };

    const handleUniqueIdChange = (itemId, index, selectedOption) => {
        const key = `${itemId}-${index}`;
        const value = selectedOption?.value || "";

        setUniqueIds(prev => ({
            ...prev,
            [itemId]: {
                ...(prev[itemId] || {}),
                [key]: value
            }
        }));
    };

    const proceedToCheckout = async () => {
        const payload = {
            itemQuantities: itemQuantities,
            uniqueIdsMap: uniqueIds,
        };

        axios.put("http://localhost:8080/api/preparing-items/proceedtocheckout", payload, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                setSnackbarText("Checkout successful.");
                setOpenSnackbar(true);
                fetchPreparingData();
            })
            .catch(error => {
                console.log(error);
            })
    };

    return (
        <>
            <Appbar page={"borrow-list"} />
            <div className="inventory-container">
                <Sidebar page={"inventory"} />
                <div className="inventory-content">

                    {/* Filter Section */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>

                        <TextField
                            label="Search Preparation ID or Borrower"
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={handleSearchChange}

                        />

                    <Button
                        variant="contained"
                        onClick={() => navigate("/inventory")}
                        style={{ backgroundColor: "#016565" }}
                    >
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
                                {Object.keys(groupByReferenceCode(filteredItems)).map((refCode) => {
                                    const batch = groupByReferenceCode(filteredItems)[refCode];
                                    return (
                                        <TableRow key={refCode}>
                                            <TableCell>{refCode}</TableCell>
                                            <TableCell>
                                                {batch[0]?.user ? `${batch[0].user.first_name} ${batch[0].user.last_name}` : 'N/A'}
                                            </TableCell>
                                            <TableCell>{batch[0]?.status || 'N/A'}</TableCell>
                                            <TableCell>
                                                {userRole === "1" ? (
                                                    <Button onClick={() => handleRowClick(refCode)} variant="outlined">View All</Button>
                                                ) : (
                                                    <Button onClick={() => handleRowClick(refCode)} variant="contained" style={{ backgroundColor: "#016565", color: "white" }}>Check Out</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
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
                    width: '70vw',
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
                        <Typography className="modal-info"><strong>Schedule:</strong> {teacherSchedule}</Typography>
                        {/**
                         * Converts date into full date
                         */}
                        <Typography><strong>Date Borrowed:</strong> {selectedBatch?.[0]?.dateCreated ? new Date(selectedBatch[0].dateCreated).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }) : "N/A"}</Typography>

                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedBatch && selectedBatch.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.categoryName}</TableCell>
                                            <TableCell>{item.itemName}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {/* Side Panel (Detail/Extra) */}
                    {userRole != 1 && (
                        <Box sx={{
                            width: '400px',
                            bgcolor: '#ffffff',
                            borderLeft: '1px solid #ccc',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                        }}>
                            {/* Scrollable Content */}
                            <Box sx={{
                                flex: 1,
                                overflowY: 'auto',
                                p: 2
                            }}>

                                {/**
                                 * REFACTOR: figure out a reason to use the progress bar
                                 */}
                                {/* Step Progress Bar */}
                                {/*{step > 0 && (*/}
                                {/*    <Box sx={{ width: '100%', mb: 2 }}>*/}
                                {/*        <LinearProgress variant="determinate" value={step === 1 ? 50 : 100} />*/}
                                {/*    </Box>*/}
                                {/*)}*/}

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic', color: 'gray' }}>
                                        Select the available serial numbers for the items below. Leave blank if the item does not require a Serial No.
                                    </Typography>
                                    {selectedBatch&&selectedBatch.map(item => {
                                        if (item.categoryName === "Consumables") return null;
                                        return (
                                            <Box key={item.id}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.itemName}s:</Typography>
                                                {Array.from({ length: itemQuantities[item.id] }, (_, index) => (
                                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 , justifyContent: 'space-between'}}>
                                                        <Typography>
                                                            {index + 1}. {item.itemName} Serial No.
                                                        </Typography>
                                                        <Select
                                                            value={uniqueIds[item.id]?.[item.id + "-" + index] ? { value: uniqueIds[item.id][item.id + "-" + index], label: uniqueIds[item.id][item.id + "-" + index] } : null}
                                                            onChange={(selectedOption) => handleUniqueIdChange(item.id, index, selectedOption)}
                                                            options={
                                                                /*
                                                                 *Filters the option
                                                                 *Only shows unique IDs that are not selected yet
                                                                 */
                                                                (uniqueIdOptionsMap[item.itemName] || []).filter(option => {
                                                                    const currentValue = uniqueIds[item.id]?.[`${item.id}-${index}`];
                                                                    const allSelectedValues = Object.values(uniqueIds).flatMap(itemMap =>
                                                                        Object.values(itemMap)
                                                                    );
                                                                    return !allSelectedValues.includes(option.value) || option.value === currentValue;
                                                                })
                                                            }
                                                            isSearchable
                                                            styles={{ control: (provided) => ({ ...provided, width: 200 }) }}
                                                        />
                                                    </Box>
                                                ))}
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Box>

                            <Box sx={{
                                p: 2,
                                borderTop: '1px solid #ccc',
                                bgcolor: '#ffffff',
                                position: 'sticky',
                                bottom: 0,
                                zIndex: 1
                            }}>

                                <Button
                                    onClick={() => {
                                        if (userRole === "1") {
                                            setOpenModal(false);
                                        } else {
                                            setOpenModal(false);
                                            proceedToCheckout()
                                        }
                                    }}
                                    variant="contained"
                                    sx={{ mt: 1, backgroundColor: "#016565" }}
                                >
                                    {userRole === "1" ? "OKAY" : "Proceed to Checkout"}
                                </Button>


                            </Box>
                        </Box>
                    )}
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

