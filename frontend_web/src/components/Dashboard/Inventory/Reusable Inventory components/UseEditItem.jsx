import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, Typography, TextField,  FormControl, InputLabel, MenuItem, Select,} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers";
import { format } from 'date-fns';

const UseEditItem = ({jwttoken, onModalClose, editdataname, editdata, opensnackbar}) => {
    const [editData, setEditData] = useState(editdata);
    const [error, setError] = useState('');

    const handleModalEditClose = () => {
        onModalClose();
    };

    const handleInputChangeEdit = (e) => {
        const {name, value} = e.target;
        setError('');

        setEditData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
      const updatedEditData = {
        ...editData,
      };
      axios.put(`http://localhost:8080/inventory/updateinventory?id=${updatedEditData.inventory_id}`, updatedEditData, {
        headers: {
          "Authorization": `Bearer ${jwttoken}`
        }
      })
      .then(response => {
        onModalClose();
        opensnackbar();
      })
      .catch(error => {
        if(error.response && error.response.status == 409){
          setError(error.response.data);
        } else {
          setError("An unexpected error occurred. Please check the details and try again.");
        }
      });
    };

    return(
        <>
          <Modal open={true} onClose={handleModalEditClose}>
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
                Edit {editdataname}
                </Typography>
                <TextField
                    name={'name'}
                    value={editData.name || ''}
                    onChange={handleInputChangeEdit}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    label="Name"
                    variant="outlined"
                    fullWidth
                    autoComplete={'off'}
                    disabled={true}
                />
                <TextField
                    name="description"
                    value={editData.description || ''}
                    onChange={handleInputChangeEdit}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    label="Description"
                    variant="outlined"
                    fullWidth
                    required={true}
                    autoComplete={'off'}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    name="quantity"
                    value={editData.quantity || 0}
                    onChange={handleInputChangeEdit}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', flexGrow: 1 }}
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    required={true}
                    autoComplete={'off'}
                    disabled={true}
                    // slotProps={{
                    //   input:{
                    //     endAdornment: <>
                    //     {amountToAdd !== 0 && (<p style={{color: 'green', width: '50px'}}>+ {amountToAdd}</p>)}
                    //     <Button
                    //       variant="contained"
                    //       sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                    //       onClick={() => setPage(2)}
                    //     >
                    //         Resupply
                    //     </Button>
                    //     </>
                    //   }
                    // }}
                />
                </Box>
                <TextField
                    name="unit"
                    value={editData.unit || ''}
                    onChange={handleInputChangeEdit}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    label="Unit"
                    variant="outlined"
                    fullWidth
                    autoComplete={'off'}
                    disabled={true}
                />
                <TextField
                    name="status"
                    value={editData.status || ''}
                    onChange={handleInputChangeEdit}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                    label="Status"
                    variant="outlined"
                    fullWidth
                    required={true}
                    autoComplete={'off'}
                />
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="outlined" sx={{ color: '#800000', borderColor: '#800000' }} onClick={handleModalEditClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                    onClick={handleSave}
                >
                    Save
                </Button>
                </Box>
            </Box>
          </Modal>
        </>
    )
}

export default UseEditItem;