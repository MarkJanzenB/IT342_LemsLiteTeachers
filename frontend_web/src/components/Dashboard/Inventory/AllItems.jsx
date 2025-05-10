import React, { useState, useEffect } from "react";
import Appbar from "../../Appbar/Appbar.jsx";
import {
    Button, Modal, Box, Typography, TextField, InputAdornment,
    IconButton, ThemeProvider, createTheme, Snackbar, ButtonGroup,
    FormControl, InputLabel, MenuItem, Select,
} from "@mui/material";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import MyPaper from "../../MyPaper.jsx";
import './Inventory.css';
import CustomTable from "../../Table and Pagination/Table.jsx";
import CustomTablePagination from "../../Table and Pagination/Pagination.jsx";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { getJWTSub } from "../../Authentication/jwt.jsx";
import UseAddItem from "./Reusable Inventory components/UseAddItem.jsx";
import * as XLSX from 'xlsx';
import UseEditItem from "./Reusable Inventory components/UseEditItem.jsx";
import UseResupply from "./Reusable Inventory components/UseResupply.jsx";
import UseBulkAdd from "./Reusable Inventory components/UseBulkAdd.jsx";

const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'description', headerName: 'Description' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'unit', headerName: 'Unit' },
    { field: 'status', headerName: 'Status' },
    { field: 'action', headerName: 'Action' },
];

export default function AllItems() {
    const roleid = localStorage.getItem("userRole");
    const jwtToken = localStorage.getItem("jwtToken");
    const [data, setData] = useState([{}]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [openModalEdit, setOpenModalEdit] = useState(false); //Edit Modal
    const [editData, setEditData] = useState({});
    const [openBorrowModal, setOpenBorrowModal] = useState(false);
    const [openRemoveConfirmation, setOpenRemoveConfirmation] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [newItemCategory, setNewItemCategory] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [editDataName, setEditDataName] = useState('');
    const [editDataOldQty, setEditDataOldQty] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [getDate, setDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');
    const [manufacturerId, setManufacturerId] = useState(0);
    const [manufacturer, setManufacturer] = useState([{}]);
    const [openResupplyModal, setOpenResupplyModal] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [availableVariants, setAvailableVariants] = useState([]);
    const [selectedRowToRemove, setSelectedRowToRemove] = useState();
    const resetSearch = () => {
        setSearchTerm("");
    };

    const [newItem, setNewItem] = useState({
        item_name: '',
        unique_id: '',
        unit:'',
        item_category:{category_id: 1},
        description:'',
        group_id: null,
        inventory: {inventory_id:0},
        quantity: 0,
        variant:'',
    });
    const [formData, setFormData] = useState({
        itemId: '',
        itemName: '',
        quantity: 1,
        maxQuantity: 0,
        itemPhoto: '',
        category: '',
        variant: '', // Added variant to formData
    });

    const theme = createTheme({
        palette: {
            primary: { main: '#016565' },
            secondary: { main: '#f2ee9d' }
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

    // Fetch all items when component mounts
    useEffect(() => {
        fetchAllItems();
        fetchManufaturers();
    }, []);

    const fetchAllItems = async () => {
        try {
            const response = await axios.get("https://it342-lemsliteteachers.onrender.com/inventory/getAllInventory", {
                headers: {
                    "authorization": `Bearer ${jwtToken}`,
                }
            });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
            setSnackbarText("Failed to load items");
            setOpenSnackbar(true);
        }
    };



    const fetchItemVariants = async (itemId) => {
        try {
            const response = await axios.get(`https://it342-lemsliteteachers.onrender.com/inventory/${itemId}/variants`, {
                headers: {
                    "authorization": `Bearer ${jwtToken}`,
                }
            });
            // Assuming your API returns an array of objects like:
            // [{ variantName: 'N-Vission', quantity: 5 }, { variantName: 'Another', quantity: 10 }]
            setAvailableVariants(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching item variants:", error);
            setSnackbarText("Failed to load item variants");
            setOpenSnackbar(true);
            return [];
        }
    };

    const handleModalOpen = async (item) => {
        setMaxQuantity(item.quantity); // Initial max is the total item quantity
        const variants = await fetchItemVariants(item.inventory_id);
        setFormData({
            itemId: item.inventory_id,
            itemName: item.name,
            quantity: 1,
            maxQuantity: item.quantity, // Initial max
            itemPhoto: item.image_url || '[https://via.placeholder.com/140](https://via.placeholder.com/140)',
            category: item?.item_category?.category_name || "Unknown",
            variant: variants.length > 0 ? (variants[0]?.variantName || variants[0]) : undefined, // Set initial variant if available
        });
        setAvailableVariants(variants);
        // Immediately set maxQuantity based on the initial variant if present
        if (variants.length > 0) {
            const initialVariant = variants[0];
            setMaxQuantity(initialVariant?.quantity !== undefined ? initialVariant.quantity : item.quantity);
        }
        setOpenBorrowModal(true);
    };

    const handleVariantChange = (event) => {
        const newVariant = event.target.value;
        setFormData({ ...formData, variant: newVariant, quantity: 1 });

        // Find the quantity for the selected variant from availableVariants
        const selectedVariantData = availableVariants.find(v => (typeof v === 'object' && v.variantName === newVariant) || v === newVariant);
        if (selectedVariantData) {
            setMaxQuantity(typeof selectedVariantData === 'object' && 'quantity' in selectedVariantData ? selectedVariantData.quantity : maxQuantity);
        } else {
            // Fallback if variant data not found (shouldn't happen if API returns correctly)
            setMaxQuantity(0);
        }
    };




    const handleBorrowModalClose = () => {
        setSelectedRowToRemove(null);
        setOpenRemoveConfirmation(false);
        setOpenBorrowModal(false);
        setAvailableVariants([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (row) => {
        if (roleid != 1) { // Only roles 2 and 3 can edit
            setEditData(row);
            setEditDataName(row.name);
            setEditDataOldQty(row.quantity);
            setOpenModalEdit(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    //add to borrow cart
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (formData.quantity < 1) {
            setSnackbarText('Quantity must be at least 1.');
            setOpenSnackbar(true);
            return;
        }

        // Check if variant is required and not selected
        const hasVariants = availableVariants && availableVariants.length > 0;
        const isVariantSelected = formData.variant !== undefined && formData.variant !== "";


        if (hasVariants && !isVariantSelected) {
            setSnackbarText('Please select a variant for this item.');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.post(
                'https://it342-lemsliteteachers.onrender.com/api/borrowcart/addToBorrowCart',
                null,
                {
                    params: {
                        instiId: getJWTSub(),
                        itemName: formData.itemName,
                        categoryName: formData.category,
                        quantity: parseInt(formData.quantity),
                        variant: formData.variant, // Use formData.variant here
                    },
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Update the inventory without deducting it, since it's not yet finalized
            setSnackbarText(`${formData.itemName} ${hasVariants ? `(Variant: ${formData.variant})` : ''} added to Borrow Cart.`);
            setOpenSnackbar(true);
            setOpenBorrowModal(false);
        } catch (error) {
            console.error('Error adding item to borrow cart:', error);
            setSnackbarText('Failed to add item to BorrowReport Cart.');
            setOpenSnackbar(true);
        }
    };

    const setOpenRemoveConfirmationFunction = (category_id) => {
        setSelectedRowToRemove(category_id);
        setOpenRemoveConfirmation(true);
        console.log(category_id);
    }



//REMOVE
    const handleRemoveItem = () => {
        axios.delete(`https://it342-lemsliteteachers.onrender.com/inventory/delete/${selectedRowToRemove}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                fetchAllItems();
                setSnackbarText(response.data.name + " has been successfully removed.");
                setOpenSnackbar(true);
                setOpenRemoveConfirmation(false);
            })
            .catch(error => console.error("Error removing item:", error))
    };
    //ADD
    const handleAddClick = () => {
        setOpenModal(true);
    };

    const handleAddItemModalClose = () => {
        setOpenModal(false);
        setCurrentStep(1);
        setError('');

        setManufacturerId(0);
        setNewItem({});
        resetModalForm();
    };
// EDIT

// Helper function for error handling
    const handleSaveError = (error) => {
        if(error.response) {
            if(error.response.status == 400 || error.response.status == 404 || error.response.status == 409) {
                setError(error.response.data);
            } else {
                setError("An unexpected error occurred. Please check the details and try again.");
            }
        } else {
            setError("Network error occurred. Please try again.");
        }
    };

    const resetModalForm = () => {
        setNewItem({
            item_name: '',
            unique_id: '',
            unit: '',
            item_category: {category_id: 1},
            description: '',
            group_id: null,
            inventory: {inventory_id: 0},
            quantity: 0,
            variant: '',
        });
        setNewItemCategory(0);
        setManufacturerId(0);
        setDate(null);
        setFormattedDate('');
        setError('');
        setMessage('');
        setCurrentStep(1);
    };

    //EXPORT
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            QTY: item.quantity,
            UNIT: item.unit,
            ITEMS: item.name,
            REMARKS: item.description,
            VARIANT: item.variant, // Include variant in export
        })));

        const headerStyle = {
            font: { bold: true },
            border: {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
            }
        };

        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })];
            if (cell) cell.s = headerStyle;
        }

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell) {
                    if (!cell.s) cell.s = {};
                    cell.s.border = headerStyle.border;
                }
            }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

        const date = new Date();
        const formattedDate = `<span class="math-inline">\{date\.getDate\(\)\}\-</span>{date.getMonth() + 1}-${date.getFullYear()}`;
        const filename = `JHS Science Lab Inventory - ${formattedDate}.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    //SEARCH
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const filteredData = data.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (item.name && item.name.toLowerCase().includes(searchLower)) ||
            (item.description && item.description.toLowerCase().includes(searchLower)) ||
            (item.unit && item.unit.toLowerCase().includes(searchLower)) ||
            (item.status && item.status.toLowerCase().includes(searchLower)) ||
            (item.item_category && item.item_category.category_name &&
                item.item_category.category_name.toLowerCase().includes(searchLower)) ||
            (item.variant && item.variant.toLowerCase().includes(searchLower)) // Include variant in search
        );
    });

    // const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const fetchManufaturers = () => {
        axios.get(`https://it342-lemsliteteachers.onrender.com/manufacturer/getall`, {
            headers : {
                "authorization": `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                setManufacturer(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <ThemeProvider theme={theme}>
            <Appbar page={"inventory"} />
            <div className="inventory-container">
                <Sidebar page={"inventory"} />
                <div className="inventory-content">

                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <MyPaper>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                {parseInt(roleid) !== 1 && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={exportToExcel}
                                        startIcon={<DownloadIcon />}
                                        sx={{ marginLeft: '10px' }}
                                    >
                                        Export to Excel
                                    </Button>
                                )}
                                <TextField
                                    variant="outlined"
                                    sx={{marginLeft: '20px', width: '300px'}}
                                    placeholder="Search items..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img src="/search.gif" alt="search" style={{ width: '30px', height: '30px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            {/*<Typography variant="h4" sx={{ textAlign: 'center', margin: '20px 0', color: '#016565' }}>*/}
                            {/* All Items*/}
                            {/*</Typography>*/}

                            <div style={{ position: 'absolute', top: 13, right: 30 }}>
                                <TextField
                                    variant={'outlined'}
                                    sx={{marginLeft:'20px', width:'58%'}}
                                    placeholder={'Search'}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <img src="/search.gif" alt="search" style={{ width: '30px', height: '30px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            {/*Makes the table scrollable w/ style*/}
                            <div style={{
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                position: 'relative',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#016565 #f0f0f0'
                            }}>
                                <CustomTable
                                    columns={columns}
                                    data={paginatedData}
                                    onRowClick={handleRowClick}
                                    onRemoveClick={() => {
                                        setOpenRemoveConfirmation(true);
                                    }}

                                    roleid={roleid}
                                    showRemoveColumn={false}
                                    isInventoryPage={true}
                                    renderCell={(column, row) => {
                                        if (column.field === 'action') {
                                            return (
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    {roleid == 1 && (
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                backgroundColor: '#228B22',
                                                                color: '#FFFFFF',
                                                                '&:hover': { backgroundColor: '#1E7A1E' }
                                                            }}
                                                            onClick={() =>{
                                                                console.log("Clicked row:", row);
                                                                handleModalOpen(row);
                                                            }}
                                                            disabled={row.quantity === 0} // Disable if quantity is 0
                                                        >
                                                            Borrow
                                                        </Button>
                                                    )}

                                                    {roleid != 1 && (
                                                        <Button
                                                            variant="contained"
                                                            sx={{
                                                                backgroundColor: '#d32f2f',
                                                                color: '#FFFFFF',
                                                                '&:hover': { backgroundColor: '#b71c1c' }
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenRemoveConfirmationFunction(row.inventory_id);
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </Box>
                                            );
                                        }
                                        if (column.field === 'quantity' && roleid != 1){
                                            return (
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between', width: '110px'}}>
                                                    <span>{row[column.field]}</span>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditData(row);
                                                            setEditDataName(row.name);
                                                            setEditDataOldQty(row.quantity);
                                                            setOpenResupplyModal(true);
                                                            console.log(row);
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </Box>
                                            )
                                        }
                                        /**
                                         * customize the status column on this page only
                                         */
                                        if(column.field === 'status'){
                                            return (
                                                <p style={{borderRadius: '50px', textAlign: 'center', width: '130px', color: 'white', backgroundColor: row[column.field] === 'Out of stock' ? '#de4352' : '#5cdd8b'}}>{row[column.field]}</p>
                                            )
                                        }
                                        return row[column.field];
                                    }}
                                />
                            </div>

                            <CustomTablePagination
                                count={filteredData.length}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                rowsPerPageOptions={[5, 10, 15]}
                                onAddClick={parseInt(roleid) !== 1 ? handleAddClick : undefined}
                                roleid={roleid}
                                isAtInventory={true}
                                isInventoryPage={true}
                            />
                        </MyPaper>
                        {/*Adding Items Modal*/}
                        {openModal && (
                            <UseBulkAdd
                                jwttoken={jwtToken}
                                onModalClose={() => {
                                    setOpenModal(false);
                                }}
                                opensnackbar={() => {
                                    fetchAllItems();
                                    setOpenSnackbar(true);
                                    setSnackbarText("Item successfully updated");
                                }}
                            />
                        )}
                        {/*Edit Modal*/}
                        {openModalEdit && (
                            <UseEditItem
                                jwttoken={jwtToken}
                                editdataname={editDataName}
                                editdata={editData}
                                opensnackbar={() => {
                                    fetchAllItems();
                                    setOpenSnackbar(true);
                                    setSnackbarText("Item successfully updated");
                                }}
                                onModalClose={() => {
                                    setOpenModalEdit(false);
                                }}
                            />
                        )}

                        {openResupplyModal && (
                            <UseResupply
                                jwttoken={jwtToken}
                                editdataname={editDataName}
                                editdata={editData}
                                opensnackbar={() => {
                                    fetchAllItems();
                                    setOpenSnackbar(true);
                                    setSnackbarText("Successfully resupplied");
                                }}
                                onModalClose={() => {
                                    setOpenResupplyModal(false);
                                }}
                            />
                        )}
                        <Modal open={openBorrowModal} onClose={handleBorrowModalClose}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: { xs: 300, sm: 400, md: 500 },
                                    bgcolor: 'background.paper',
                                    p: 4,
                                    borderRadius: 3,
                                    boxShadow: 24,
                                }}
                            >
                                <IconButton
                                    aria-label="close"
                                    onClick={handleBorrowModalClose}
                                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                                >
                                    <CloseIcon />
                                </IconButton>

                                <Box display="flex" flexDirection="column" gap={2}>
                                    <Typography variant="h6" gutterBottom>
                                        Borrow Item
                                    </Typography>
                                    <TextField
                                        label="Item Name"
                                        value={formData.itemName}
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        label="Category"
                                        value={formData.category}
                                        fullWidth
                                        disabled
                                    />

                                    {/* Variant Selection */}
                                    <FormControl fullWidth error={availableVariants.length > 0 && !formData.variant}>
                                        <InputLabel id="variant-label">Variant</InputLabel>
                                        <Select
                                            labelId="variant-label"
                                            id="variant"
                                            value={formData.variant}
                                            label="Variant"
                                            onChange={handleVariantChange}
                                            required={availableVariants.length > 0}
                                        >
                                            {availableVariants.map((variant) => (
                                                <MenuItem key={typeof variant === 'object' && 'variantName' in variant ? variant.variantName : variant} value={typeof variant === 'object' && 'variantName' in variant ? variant.variantName : variant}>
                                                    {typeof variant === 'object' && 'variantName' in variant ? variant.variantName : variant}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {availableVariants.length > 0 && !formData.variant && (
                                            <Typography color="error" sx={{ mt: 1 }}>
                                                Please select a variant.
                                            </Typography>
                                        )}
                                    </FormControl>

                                    <TextField
                                        label="Quantity"
                                        type="number"
                                        value={formData.quantity}
                                        fullWidth
                                        onChange={(e) => {
                                            const newValue = Math.max(1, Math.min(maxQuantity, Number(e.target.value)));
                                            setFormData({ ...formData, quantity: newValue });
                                        }}
                                        slotProps={{
                                            input: {
                                                inputProps: {
                                                    max: maxQuantity, // Bind max prop to maxQuantity
                                                    min: 1,
                                                },
                                            },
                                        }}
                                    />
                                </Box>

                                <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                                    <Button onClick={handleBorrowModalClose} variant="outlined">
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#228B22',
                                            color: '#FFFFFF',
                                            '&:hover': { backgroundColor: '#1E7A1E' },
                                        }}
                                        onClick={handleFormSubmit}
                                        disabled={(availableVariants.length > 0 && !formData.variant) || formData.quantity > maxQuantity || formData.quantity < 1}
                                    >
                                        Add to Borrow Cart
                                    </Button>
                                    {formData.quantity > maxQuantity && (
                                        <Typography color="error" sx={{ mt: 1 }}>
                                            Quantity exceeds available stock ({maxQuantity}).
                                        </Typography>
                                    )}
                                    {formData.quantity < 1 && (
                                        <Typography color="error" sx={{ mt: 1 }}>
                                            Quantity must be at least 1.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Modal>

                        <Modal open={openRemoveConfirmation} onClose={handleBorrowModalClose}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 500,
                                    bgcolor: '#F2EE9D',
                                    boxShadow: 24,
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    borderRadius: '25px',
                                }}
                            >
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#016565', textAlign: 'center' }}>
                                    Are you sure you want to remove this item?
                                </Typography>
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Button variant="outlined" sx={{ color: '#800000', borderColor: '#800000' }} onClick={() => {
                                        handleBorrowModalClose()
                                    }}>

                                        Cancel

                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                                        onClick={() => {
                                            handleRemoveItem()
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>

                    </div>
                </div>
            </div>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarText}
                action={
                    <IconButton size="small" color="inherit" onClick={handleSnackbarClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            />
        </ThemeProvider>
    );
}