import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, Typography, TextField,  FormControl, InputLabel, MenuItem, Select,} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers";
import { format } from 'date-fns';

const UseAddItem = ({jwttoken, onModalClose, opensnackbar}) => {
    const [newItemCategory, setNewItemCategory] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [getDate, setDate] = useState(null);
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

    const handleAddItem = () => {
        if (!newItem.item_name || !newItem.unit || newItemCategory === 0 || !newItem.variant) {
            setError("Please fill in all required fields.");
            return;
        }
    
        axios.get(`http://localhost:8080/inventory/isinventoryexists?inventoryName=${newItem.item_name}`, {
                headers: {
                    "Authorization": `Bearer ${jwttoken}`
                }
            })
                .then(response => {
                    setError("Item already exists. To add stock please click the item from the list.");
                })
                .catch(error => {
                    if (error.response.status == 409) {
                        axios.post("http://localhost:8080/inventory/addinventory", {
                            unit: newItem.unit,
                            name: newItem.item_name,
                            description: newItem.description,
                            item_category: {
                                category_id: newItemCategory
                            },
                        }, {
                            headers: {
                                "Authorization": `Bearer ${jwttoken}`
                            }
                        })
                            .then(response => {
                              onModalClose();
                              opensnackbar();
                            })
                            .catch(error => {
                              console.log(error);
                                setError("An unexpected error occurred.");
                            });
                    } else {
                      console.log(error);
                        setError("An unexpected error occurred.");
                    }
                });
        
    };

    const handleAddItemModalClose = () => {
        onModalClose();
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
          setNewItemCategory(value);
        } else {
          setNewItem(prevState => ({
            ...prevState,
            [name]: value
          }));
          if ((name === 'item_name' || name === 'name') && value !== '') {
            await checkItemExists(value);
          } else {
            setMessage('');
          }
        }
    };

    const handleBlurOrEnter = async (e) => {
        const { name, value } = e.target;
        if (e.type === 'blur' && (name === 'item_name' || name === 'name') && value !== '') {
          await checkItemExists(value);
        } else {
          setMessage('');
        }
    };

    const checkItemExists = async (itemName) => {
        try {
            const response = await axios.get(`http://localhost:8080/inventory/isinventoryexists?inventoryName=${itemName}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
            });
            setMessage("Item already exists. Do you wanna proceed to update it instead?");
        } catch (error) {
            if (message !== "New Item?! Click the dropdown below and choose a category where your item belongs.") {
            setMessage("New Item?! Click the dropdown below and choose a category where your item belongs.");
            }
        }
    };

    return(
        <>
        <Modal open={true} onClose={handleAddItemModalClose}>
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
                <div style={{ position: 'absolute', top: 24, right: 8 }}>
                <Button onClick={handleAddItemModalClose}>
                    <img src={"/exit.gif"} style={{
                    width: '30px',
                    height: '30px',
                    }}/>
                </Button>
                </div>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#016565', textAlign: 'center' }}>
                ADD NEW ITEM
                </Typography>
                <TextField
                    name="item_name"
                    value={newItem.item_name}
                    onChange={handleInputChange}
                    onBlur={handleBlurOrEnter}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleBlurOrEnter(e);
                    }
                    }}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    required={true}
                    autoComplete={'off'}
                />
                {message && <Typography color="primary" sx={{ mt: 0.5, fontSize: '14px' }}>{message}</Typography>}

                <FormControl required>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        name="category"
                        labelId="demo-simple-select-label"
                        label="Category"
                        value={newItemCategory}
                        onChange={handleInputChange}
                        variant='outlined'
                        required
                    >
                        <MenuItem value={0}>SELECT CATEGORY</MenuItem>
                        <MenuItem value={1}>Consumables</MenuItem>
                        <MenuItem value={2}>Equipment</MenuItem>
                        <MenuItem value={3}>Glassware</MenuItem>
                        <MenuItem value={4}>Hazards</MenuItem>
                        <MenuItem value={5}>Others</MenuItem>
                    </Select>
                </FormControl>
                <FormControl required>
                    <InputLabel id="unit-select-label">Unit</InputLabel>
                    <Select
                        name="unit"
                        labelId="unit-select-label"
                        value={newItem.unit}
                        onChange={handleInputChange}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                        label="Unit"
                        fullWidth
                        required
                    >
                        <MenuItem value="units">Units</MenuItem>
                        <MenuItem value="grams">Grams</MenuItem>
                        <MenuItem value="kilograms">Kilograms</MenuItem>
                        <MenuItem value="liters">Liters</MenuItem>
                        <MenuItem value="meters">Meters</MenuItem>
                        <MenuItem value="pieces">Pieces</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    autoComplete={'off'}
                />
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                <Button
                    variant="contained"
                    sx={{
                    backgroundColor: '#800000',
                    color: '#FFF',
                    '&:hover': { backgroundColor: '#5c0000' }
                    }}
                    onClick={handleAddItem}
                >
                Add Item
                </Button>
            </Box>
        </Modal>
        </>
    )
}

export default UseAddItem;