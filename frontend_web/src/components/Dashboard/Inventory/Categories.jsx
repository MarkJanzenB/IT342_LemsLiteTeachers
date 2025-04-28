import React, { useRef, useState, useEffect } from "react";
import Appbar from "../../Appbar/Appbar.jsx";
import {
    Button, Modal, Box, Typography, TextField,
    ButtonGroup, IconButton, 
    Snackbar,  InputAdornment,
    ThemeProvider, createTheme,
} from "@mui/material";
import Sidebar from "../../Sidebar/Sidebar.jsx";
import MyPaper from "../../MyPaper.jsx";
import './Inventory.css';
import CustomTable from "../../Table and Pagination/Table.jsx";
import CustomTablePagination from "../../Table and Pagination/Pagination.jsx";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from "react-router-dom";
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import {getJWTSub, getJWTUid} from "../../Authentication/jwt.jsx";
import UseAddItem from "./Reusable Inventory components/UseAddItem.jsx";
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


export default function Categories() {
    const navigate = useNavigate();
    const roleid = localStorage.getItem("userRole");
    const jwtToken = localStorage.getItem("jwtToken");
    const [error, setError] = useState('');
    const [showTable, setShowTable] = useState(false);
    const [data, setData] = useState([{}]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [transition, setTransition] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [newItemCategory, setNewItemCategory] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");
    const [editConsumable, setEditConsumable] = useState(false);
    const [editDataName, setEditDataName] = useState('');
    const [editData, setEditData] = useState({});
    const [editDataOldQty, setEditDataOldQty] = useState(0);
    const [openBorrowModal, setOpenBorrowModal] = useState(false);
    const [viewListNumber, setViewListNumber] = useState(0);
    const [openResupplyModal, setOpenResupplyModal] = useState(false);

    const [formData, setFormData] = React.useState({
        itemId: '',
        itemName: '',
        quantity: 1,
        maxQuantity: 0,
        itemPhoto: '',
        category: '',
    });

    const handleModalOpen = (item) => {
        setFormData({
            itemId: item.inventory_id,
            itemName: item.name,
            quantity: 1,
            maxQuantity: item.quantity,
            itemPhoto: item.image_url || 'https://via.placeholder.com/140',
            category: item.item_category.category_name,
        });
        setOpenBorrowModal(true);
    };



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

    const [newItem, setNewItem] = useState({
        item_name: '',
        unique_id: '',
        unit:'',
        item_category:{category_id: 1},
        description:'',
        group_id: null,
        inventory: {inventory_id:0},
        quantity: 1,
    });
    const [newConsumable, setNewConsumable] = useState({
        unit: '',
        name: '',
        item_category:{category_id: 1},
        quantity:0,
        description:'',
    });


    const handleBorrowModalClose = () => {
        setOpenBorrowModal(false);
    };

    const handleAddItemModalClose = () => {
        setOpenModal(false);
    };

    const handleEditItemModalClose = () => {
        setOpenModalEdit(false);
    };


    // Handle form submission (Add to Borrow Cart)
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (formData.quantity < 1) {
            setSnackbarText('Quantity must be at least 1.');
            setOpenSnackbar(true);
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:8080/api/borrowcart/addToBorrowCart',
                null,
                {
                    params: {
                        instiId: getJWTSub(),
                        itemId: parseInt(formData.itemId),
                        itemName: formData.itemName,
                        categoryName: formData.category,
                        quantity: parseInt(formData.quantity),
                    },
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log("!!!!!!!!!!!!!!");
            console.log(response.data);

            setData((prevItems) =>
                prevItems.map((item) =>
                    item.inventory_id === formData.itemId
                        ? { ...item, quantity: item.quantity - formData.quantity }
                        : item
                )
            );

            const response2 = await axios.put("http://localhost:8080/item/borrow",
                {
                    "userID": getJWTUid(),
                    "borrowCartID": response.data.id,
                    "items": [
                        { "itemName": formData.itemName, "quantity": formData.quantity },
                    ]
                },
                {headers: {
                        "authorization": `Bearer ${jwtToken}`,
                    }})

            setSnackbarText(`${formData.itemName} added to Borrow Cart.`);
            setOpenSnackbar(true);
            setOpenBorrowModal(false);
        } catch (error) {
            console.error('Error adding item to borrow cart:', error);
            setSnackbarText('Failed to add item to Borrow Cart.');
            setOpenSnackbar(true);
        }
    };

    const handleModalEditClose = () => {
        setOpenModalEdit(false);
        setError('');
    }

    const handleSnackbarClose = (event, reason) => {
        setOpenSnackbar(false);
    }

    const SnackbarAction = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleSnackbarClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>
    );

    const handleModalBack = () => {
        setCurrentStep(1);
    };



    const fetchData = async (categoryId) => {
        if(categoryId != 5){
            const response = await axios.get(`http://localhost:8080/inventory/getinventorybycategory?categoryId=${categoryId+1}`, {
                headers: {
                    "authorization": `Bearer ${jwtToken}`,
                }});
            console.log(response.data);
            setData(response.data);
        }else{
            const response = await axios.get("http://localhost:8080/inventory/getAllInventory", {
                headers: {
                    "authorization": `Bearer ${jwtToken}`,
                }});
            console.log(response.data);
            setData(response.data);
        }
    }

    const handleViewListClick = (categoryId) => {
        setTransition(true);
        setTimeout(() => {
            setCurrentCategory(categoryId);
            fetchData(categoryId);
            setShowTable(true);
            setTransition(false);
            setPage(0);
        }, 500);
    };

    const handleViewAllItemsClick = (categoryId) => {
        setTransition(true);
        setTimeout(() => {
            setCurrentCategory(categoryId);
            fetchData(categoryId);
            setShowTable(true);
            setTransition(false);
        }, 500);
    };

    const handleRemoveItem = (category_id) => {
        const jwtToken =localStorage.getItem("jwtToken");
        axios.delete(`http://localhost:8080/inventory/delete/${category_id}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                fetchData(currentCategory);
                setSnackbarText(response.data.name + " has been successfully removed.");
                setOpenSnackbar(true);
            })
            .catch(error)
    };

    const handleBack = () => {
        setShowTable(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (row) => {
        if (roleid != 1) {
            setEditData(row);
            setEditDataName(row.name);
            setEditDataOldQty(row.quantity);
            if (row.item_category.category_id == 1) {
                setEditConsumable(true);
            } else {
                setEditConsumable(false);
            }
            setOpenModalEdit(true);
        }

    };

    const handleAddClick = () => {
        setOpenModal(true);
    };

    useEffect(() => {
        const itemName = newItemCategory !== 1 ? newItem.item_name : newItem.name;
        if (itemName) {
            checkItemExists(itemName);
        }
    }, [newItem.item_name, newItem.name]);

    const handleNext = () => {
        setCurrentStep(2);

        if(newItemCategory == 1){
            setNewConsumable(prevState => ({
                ...prevState,
                item_category: {category_id: newItemCategory}
            }));
        }
    }

    const handleRemoveClick = (id) => {
        console.log('Remove clicked for id:', id);
    };
    const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    //EXPORT
    const exportToExcel = () => {
        // Get category name for filename
        const categoryNames = ["Consumables", "Equipment", "Glassware", "Hazards", "Others", "All Items"];
        const categoryName = categoryNames[currentCategory];

        const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
            QTY: item.quantity,
            UNIT: item.unit,
            ITEMS: item.name,
            REMARKS: item.description
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
        XLSX.utils.book_append_sheet(workbook, worksheet, categoryName);

        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const filename = `JHS Science Lab ${categoryName} - ${formattedDate}.xlsx`;

        XLSX.writeFile(workbook, filename);
    };

    return (
        <ThemeProvider theme={theme}>
            <Appbar page={"inventory"} />
            <div className="inventory-container">
                <Sidebar page={"inventory"} />
                <div className="inventory-content">

                    <div style={{ display: 'flex', justifyContent: 'center',width: '100%'   }}>
                        <MyPaper>


                            {!showTable && (

                                <div className={transition ? 'fade-slide-up' : ''} style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                                    <MyPaper width="20%" height="20%" justifyContent="center">
                                        <h1>Consumables</h1>
                                        <img src={"/consumable.gif"} style={{width: '100px', height: '100px'}}
                                             onClick={() => {
                                                handleViewListClick(0);
                                                setViewListNumber(0);
                                             }}/>
                                        <MyPaper width={"100%"} height={"20%"} justifyContent="center">
                                            <h4>Items that are consumed and need to be replenished.</h4>
                                        </MyPaper>
                                        <Button onClick={() => {
                                            handleViewListClick(0)
                                            setViewListNumber(0);
                                        }}>View List</Button>
                                    </MyPaper>



                                    <MyPaper width="20%" height="20%">
                                        <h1>Equipment</h1>
                                        <img src={"/equipment.gif"} style={{ width: '100px', height: '100px' }}
                                             onClick={() => {
                                                handleViewListClick(1);
                                                setViewListNumber(1);
                                             }}/>
                                        <MyPaper width={"100%"} height={"20%"}>
                                            <h4>Instruments and equipment utilized for particular functions.</h4>
                                        </MyPaper>
                                        <Button onClick={() => {
                                                handleViewListClick(1);
                                                setViewListNumber(1);
                                             }}>View List</Button>
                                    </MyPaper>


                                    <MyPaper width="20%" height="20%">
                                        <h1>Glassware</h1>
                                        <img src={"/glassware.gif"} style={{ width: '100px', height: '100px' }} onClick={() => {
                                                handleViewListClick(2);
                                                setViewListNumber(2);
                                             }}/>
                                        <MyPaper width={"100%"} height={"20%"}>
                                            <h4>
                                                Glass containers used for scientific experiments.
                                            </h4>
                                        </MyPaper>
                                        <Button onClick={() => {
                                                handleViewListClick(2);
                                                setViewListNumber(2);
                                             }}>View List</Button>
                                    </MyPaper>


                                    <MyPaper width="20%" height="20%">
                                        <h1>Hazards</h1>
                                        <img src={"/hazardous.gif"} style={{ width: '100px', height: '100px' }}
                                             onClick={() => {
                                                handleViewListClick(3);
                                                setViewListNumber(3);
                                             }}/>
                                        <MyPaper width={"100%"} height={"20%"}>
                                            <h4>
                                                Items that are hazardous and need to be handled with care.
                                            </h4>
                                        </MyPaper>
                                        <Button onClick={() => {
                                                handleViewListClick(3);
                                                setViewListNumber(3);
                                             }}>View List</Button>
                                    </MyPaper>

                                    <MyPaper width="20%" height="20%">
                                        <h1>Others</h1>
                                        <img src={"/warehouse.gif"} style={{width: '100px', height: '100px'}}
                                             onClick={() => {
                                                handleViewListClick(4);
                                                setViewListNumber(4);
                                             }}/>
                                        <MyPaper width={"100%"} height={"20%"}>
                                            <h4>Items that are consumed and need to be replenished.</h4>
                                        </MyPaper>
                                        <Button onClick={() => {
                                                handleViewListClick(4);
                                                setViewListNumber(4);
                                             }}>View List</Button>
                                    </MyPaper>
                                </div>
                            )}
                            <br />
                            {/*{!showTable && (*/}
                            {/*    <div className={transition ? 'fade-slide-up' : ''} style={{ display: 'flex', justifyContent: 'center' }}>*/}
                            {/*        <MyPaper width={"95%"} height={"8%"}>*/}

                            {/*            <Button onClick={() => handleViewAllItemsClick(5)}>View All Items</Button>*/}



                            {/*        </MyPaper>*/}
                            {/*    </div>*/}
                            {/*)}*/}

                            {showTable && (
                                <>
                                    <div className="table-slide-up" style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                    }}>
                                        {/* Left side buttons container */}
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {/*<Button*/}
                                            {/*    variant="outlined"*/}
                                            {/*    color="primary"*/}
                                            {/*    onClick={handleBack}*/}
                                            {/*>*/}
                                            {/*    Back*/}
                                            {/*</Button>*/}

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
                                        </div>

                                        <ButtonGroup variant="outlined" aria-label="outlined button group">
                                            <Button
                                                style={currentCategory === 0 ? {
                                                    width: '200px',
                                                    height: '80px',
                                                    fontSize: '24px',
                                                } : {}}
                                                onClick={() => handleViewListClick(0)}
                                            >
                                                {currentCategory === 0 ? 'Consumables' :
                                                    <img src="/consumable.gif" alt="Consumables"
                                                         style={{width: '50px', height: '50px'}}/>}
                                            </Button>
                                            <Button
                                                style={currentCategory === 1 ? {
                                                    width: '200px',
                                                    height: '80px',
                                                    fontSize: '24px',
                                                } : {}}
                                                onClick={() => handleViewListClick(1)}
                                            >
                                                {currentCategory === 1 ? 'Equipment' :
                                                    <img src="/equipment.gif" alt="Equipment"
                                                         style={{width: '50px', height: '50px'}}/>}
                                            </Button>
                                            <Button
                                                style={currentCategory === 2 ? {
                                                    width: '200px',
                                                    height: '80px',
                                                    fontSize: '24px',
                                                } : {}}
                                                onClick={() => handleViewListClick(2)}
                                            >
                                                {currentCategory === 2 ? 'Glassware' :
                                                    <img src="/glassware.gif" alt="Glassware"
                                                         style={{width: '50px', height: '50px'}}/>}
                                            </Button>
                                            <Button
                                                style={currentCategory === 3 ? {
                                                    width: '200px',
                                                    height: '80px',
                                                    fontSize: '24px',
                                                } : {}}
                                                onClick={() => handleViewListClick(3)}
                                            >
                                                {currentCategory === 3 ? 'Hazards' :
                                                    <img src="/hazardous.gif" alt="Hazards"
                                                         style={{width: '50px', height: '50px'}}/>}
                                            </Button>
                                            <Button
                                                style={currentCategory === 4 ? {
                                                    width: '200px',
                                                    height: '80px',
                                                    fontSize: '24px',
                                                } : {}}
                                                onClick={() => handleViewListClick(4)}
                                            >
                                                {currentCategory === 4 ? 'Others' :
                                                    <img src="/warehouse.gif" alt="Others"
                                                         style={{width: '50px', height: '50px'}}/>}
                                            </Button>

                                        </ButtonGroup>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <TextField variant={'outlined'} sx={{ marginLeft: '20px', width: '58%' }} placeholder={'Search'}
                                                       InputProps={{
                                                           endAdornment: (
                                                               <InputAdornment position="end">
                                                                   <img src="/search.gif" alt="search" style={{ width: '30px', height: '30px' }} />
                                                               </InputAdornment>
                                                           ),
                                                       }}
                                            />
                                            <Button variant={'outlined'} onClick={handleBack} sx={{ marginLeft: '10px' }}>
                                                <img src={"/exit.gif"} style={{ width: '30px', height: '40px' }} />
                                            </Button>
                                        </div>

                                    </div>

                                    <br/>
                                    {/*Makes the table scrollable*/}
                                    <div style={{
                                        maxHeight: '60vh',
                                        overflowY: 'auto',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '4px'
                                    }}>

                                        <CustomTable
                                            columns={columns}
                                            data={paginatedData}
                                            onRowClick={handleRowClick}
                                            onRemoveClick={handleRemoveItem}
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
                                                            onClick={() => handleModalOpen(row)}
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
                                                            onClick={() => handleRemoveItem(row.inventory_id)}
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
                                        count={data.length}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        rowsPerPageOptions={[5, 10, 15]}
                                        onAddClick={handleAddClick}
                                        roleid={roleid}
                                        isAtInventory={true}
                                        isInventoryPage={true}
                                    />
                                </>
                            )}
                        </MyPaper>

                        <Modal open={openBorrowModal} onClose={handleBorrowModalClose}>
                            <Box sx={{
                                position: 'absolute', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)', width: 400,
                                bgcolor: 'background.paper', p: 4, borderRadius: '10px'
                            }}>
                                <IconButton
                                    aria-label="close"
                                    onClick={handleBorrowModalClose}
                                    sx={{
                                        position: 'absolute',
                                        right: 8,
                                        top: 8,
                                        color: (theme) => theme.palette.grey[500],
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                                <TextField label="Item Name" value={formData.itemName} fullWidth disabled />
                                <TextField label="Category" value={formData.category} fullWidth disabled /> {/* Display the category */}
                                <TextField
                                    label="Quantity"
                                    type="number"
                                    value={formData.quantity}
                                    fullWidth
                                    onChange={(e) => {
                                        const newValue = Math.max(1, Number(e.target.value)); // Ensures the value is at least 1
                                        setFormData({ ...formData, quantity: newValue });
                                    }}
                                    inputProps={{ min: 1 }} // Prevents typing values below 1
                                />

                                <Button onClick={handleBorrowModalClose}>Cancel</Button>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#228B22',
                                        color: '#FFFFFF',
                                        '&:hover': { backgroundColor: '#1E7A1E' }
                                    }}
                                    onClick={handleFormSubmit}
                                >
                                    Add to Borrow Cart
                                </Button>
                            </Box>
                        </Modal>

                        {openModal && (
                            <UseBulkAdd
                                jwttoken={jwtToken}
                                onModalClose={() => {
                                    setOpenModal(false);
                                }}
                                opensnackbar={() => {
                                    fetchData(currentCategory);
                                    setOpenSnackbar(true);
                                    setSnackbarText("Item successfully updated");
                                }}
                            />
                        )}

                        {openModalEdit && (
                            <UseEditItem
                                jwttoken={jwtToken}
                                editdataname={editDataName}
                                editdata={editData}
                                opensnackbar={() => {
                                    fetchData(currentCategory);
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
                                    fetchData(currentCategory);
                                    setOpenSnackbar(true);
                                    setSnackbarText("Successfully resupplied");
                                }}
                                onModalClose={() => {
                                    setOpenResupplyModal(false);
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarText}
                action={SnackbarAction}
            />

        </ThemeProvider>
    );
}