import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, Typography, TextField,  FormControl, InputLabel, MenuItem, Select,} from "@mui/material";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { IconButton } from '@mui/material';

const UseBulkAdd = ({jwttoken, onModalClose, opensnackbar}) => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [newItems, setNewItems] = useState([{
        name: '',
        unit:'',
        item_category:{category_id: 1},
        status: 'Out of stock',
        description:'',
        quantity: 0,
    }]);

    const handleInputChange = (index, e) => {
        const {name, value} = e.target;
        const updatedNewItems = [...newItems];

        if(name === 'category'){
            updatedNewItems[index].item_category.category_id = parseInt(value);
        }else{
            updatedNewItems[index][name] = value;
        }

        setNewItems(updatedNewItems);
    }

    const handleAddItemModalClose = () => {
        onModalClose();
    };

    const addEntry = () => {
        setNewItems([...newItems, {
            name: '',
            unit:'',
            item_category:{category_id: 1},
            description:'',
            quantity: 0,
        }]);
    }

    const removeEntry = (index) => {
        const removedItem = newItems.filter((_, i) => i !== index);
        setNewItems(removedItem);
    }

    const handleSave = () => {
        
        for(let i = 0; i < newItems.length; i++){
            const item = newItems[i];

            if (!item.name || !item.unit || item.item_category.category_id === 0) {
                setError("Please fill in all required fields.");
                return;
            }
        }
    
        axios.post("http://localhost:8080/inventory/addinventory", newItems, {
            headers: {
                "Authorization": `Bearer ${jwttoken}`
            }
        })
        .then(response => {
            onModalClose();
            opensnackbar();
        })
        .catch(error => {
            setError(error.response.data);
        });
        
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
                bgcolor: '#F2EE9D',
                boxShadow: 24,
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '25px',
                width: 'fit-content',
                maxWidth: '95%',
                height: 'fit-content',
                maxHeight: '95vh',
                overflowY: 'auto'
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
                ADD NEW ITEMS
                </Typography>
                {newItems.map((item, index) => (
                <Box key={index} borderRadius="10px" display={'flex'} gap={2} alignItems={'center'}>
                    <TextField
                        name="name"
                        value={item.name}
                        onChange={(e) => handleInputChange(index, e)}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', mb: 2, width: '500px' }}
                        label="Name"
                        variant="outlined"
                        required
                        autoComplete="off"
                    />

                    <FormControl required sx={{ mb: 2, width: '200px'}}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={item.item_category.category_id}
                            onChange={(e) => handleInputChange(index, e)}
                            label="Category"
                        >
                            <MenuItem value={1}>Consumables</MenuItem>
                            <MenuItem value={2}>Equipment</MenuItem>
                            <MenuItem value={3}>Glassware</MenuItem>
                            <MenuItem value={4}>Hazards</MenuItem>
                            <MenuItem value={5}>Others</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl required sx={{ mb: 2, width: '200px' }}>
                        <InputLabel>Unit</InputLabel>
                        <Select
                            name="unit"
                            value={item.unit}
                            onChange={(e) => handleInputChange(index, e)}
                            label="Unit"
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
                        value={item.description}
                        onChange={(e) => handleInputChange(index, e)}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', width: '500px', mb: 2 }}
                        label="Description"
                        variant="outlined"
                        autoComplete="off"
                    />

                    <IconButton
                        onClick={() => removeEntry(index)}
                        color="error"
                        disabled={newItems.length === 1}
                    >
                        <DeleteForeverOutlinedIcon />
                    </IconButton>
                </Box>
            ))}
                <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} >
                    <Button onClick={addEntry} variant="contained" color="primary">
                        Add Another Item
                    </Button>
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    <Button
                        variant="contained"
                        sx={{
                        backgroundColor: '#800000',
                        color: '#FFF',
                        '&:hover': { backgroundColor: '#5c0000' },
                        mt: '10px'
                        }}
                        onClick={() => handleSave()}
                    >
                    Save
                    </Button>
                </Box>
                
            </Box>
        </Modal>
        </>
    )
}

export default UseBulkAdd;