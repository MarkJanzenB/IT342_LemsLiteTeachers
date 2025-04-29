import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Modal, Box, Typography, TextField,  FormControl, InputLabel, MenuItem, Select,} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers";
import { format } from 'date-fns';
import { getJWTUid } from "../../../Authentication/jwt";

const UseResupply = ({jwttoken, onModalClose, editdataname, editdata, opensnackbar}) => {
    const [editData, setEditData] = useState(editdata);
    const [error, setError] = useState('');
    const [amountToAdd, setAmountToAdd] = useState(0);
    const [numCustomSN, setNumCustomSN] = useState(0);
    const [customSNValues, setCustomSNValues] = useState([]);
    const [itemVariant, setItemVariant] = useState("");
    const [getDate, setDate] = useState(null);
    const [page, setPage] = useState(1);

    const handleModalEditClose = () => {
        onModalClose();
    };

    const handleSave = () => {
        const updatedEditData = {
          ...editData,
          quantity: editData.quantity + amountToAdd
        };

        axios.post(`https://it342-lemsliteteachers.onrender.com/item/insertitem?bulkSize=${amountToAdd}`, {
            item_name: updatedEditData.name,
            inventory_id: updatedEditData.inventory_id,
            unique_ids:customSNValues,
            category: updatedEditData.item_category.category_name,
            quantity:updatedEditData.item_category.category_name === 'Consumables' ? amountToAdd : 0,
            variant: itemVariant,
            expiry_date: getDate != null ? format(getDate, 'yyyy-MM-dd') : null,
            uid: getJWTUid(),
        }, {
            headers: {
                "Authorization": `Bearer ${jwttoken}`
            }
        })
        .then(response => {
            axios.put(`https://it342-lemsliteteachers.onrender.com/inventory/updateinventory?id=${updatedEditData.inventory_id}`, updatedEditData, {
                headers: {
                    "Authorization": `Bearer ${jwttoken}`
                }
            })
            .then(response => {
                onModalClose();
                opensnackbar();
            })
            .catch(error => {
                console.log(error)
            })
        })
        .catch(error => {
            console.log(error);
        })
    }

    const handleAmountChange = (event) => {
        setAmountToAdd(Number(event.target.value));
    };

    const handleNumCustomSNChange = (event) => {
        setNumCustomSN(Number(event.target.value));
    }

    const handleInputChangeCustomSN = (index) => (event) => {
        const newValues = [...customSNValues];
        newValues[index] = event.target.value;
        setCustomSNValues(newValues);
    }

    const handleVariantChange = (event) => {
        setItemVariant(event.target.value);
    }

    return(
            <>
              <Modal open={true} onClose={handleModalEditClose}>
                { page === 1 ? (
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
                        How many items to add for {editdataname}
                    </Typography>
                    <TextField
                        name="Current Inventory quantity"
                        value={editData.quantity || 0}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', flexGrow: 1 }}
                        label="Current Inventory quantity"
                        variant="outlined"
                        fullWidth
                        autoComplete={'off'}
                        disabled={true}
                    />
                    <TextField
                      type="number"
                      name="Amount to add"
                      value={amountToAdd}
                      onChange={handleAmountChange}
                      sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', flexGrow: 1 }}
                      label="Amount to add"
                      variant="outlined"
                      fullWidth
                      required={true}
                      autoComplete={'off'}
                      slotProps={{input:{
                        inputProps:{
                          min: 1,
                        }
                      }}}
                    />

                    <TextField
                        name="variant"
                        value={itemVariant}
                        onChange={handleVariantChange}
                        sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}
                        label="Variation (ex. 50mL, 100mL, 250mL, etc.)"
                        variant="outlined"
                        fullWidth
                        autoComplete={'off'}
                    />

                    {editData.item_category.category_name === 'Consumables' &&
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Date of expiry"
                            slotProps={{
                              textField: {
                                helperText: "Leave blank if not applicable"
                              }
                            }}
                            value={getDate}
                            onChange={(newValue) => {
                              setDate(newValue)
                            }}
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: 'white',
                                },
                            }}
                        />
                      </LocalizationProvider>}

                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button variant="outlined" sx={{ color: '#800000', borderColor: '#800000' }} onClick={() => {
                      handleModalEditClose()
                    }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                        onClick={() => {
                          if(itemVariant === ""){
                            setError("Please enter a variant")
                          } else if(editData.item_category.category_name === 'Consumables'){
                            handleSave()
                            setError("")
                          }else{
                            setPage(2)
                            setError("")
                          }
                        }}
                    >
                        {editData.item_category.category_name === 'Consumables' ? 'Save' : 'Next'}
                    </Button>
                    </Box>
                </Box>
                ) : page === 2 ? (<Box
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
                    How many new items have custome Serial Number
                  </Typography>
                  <TextField
                    type="number"
                    name="Amount of items have custom serial number"
                    value={numCustomSN}
                    onChange={handleNumCustomSNChange}
                    sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', flexGrow: 1 }}
                    variant="outlined"
                    fullWidth
                    required={true}
                    autoComplete={'off'}
                    slotProps={{input:{
                      inputProps:{
                        max: amountToAdd,
                        min: 0,
                      }
                    }}}
                  />

                  {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#016565', textAlign: 'center' }}>
                  Leave it zero(0) if you want everything to have auto generated serial number
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button variant="outlined" sx={{ color: '#800000', borderColor: '#800000' }} onClick={() => {
                      setPage(1);
                      setNumCustomSN(0);
                    }}>
                      Back
                  </Button>
                  <Button
                      variant="contained"
                      sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                      onClick={() => {
                        numCustomSN === 0 ? handleSave() : setPage(3);
                        setCustomSNValues(Array(numCustomSN).fill(''));
                      }}
                  >
                      {numCustomSN === 0 ? 'Save' : 'Next'}
                  </Button>
                  </Box>
              </Box>) : (<Box
                  sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 500,
                      maxHeight: '90vh',
                      bgcolor: '#F2EE9D',
                      overflowY: 'auto',
                      boxShadow: 24,
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      borderRadius: '25px',
                  }}
                  >
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#016565', textAlign: 'center' }}>
                    Enter the Serial Number of each {editdataname}
                  </Typography>
                  {customSNValues.map((value, index) => (
                    <TextField
                      key={index}
                      name={`customSN-${index}`}
                      value={value}
                      onChange={handleInputChangeCustomSN(index)}
                      sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', marginBottom: '10px' }}
                      label={`${editdataname} ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      required
                      autoComplete="off"
                    />
                  ))}
                  {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                  <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button variant="outlined" sx={{ color: '#800000', borderColor: '#800000' }} onClick={() => {
                      setPage(2);
                      setCustomSNValues([]);
                      setError("");
                    }}>
                      Back
                  </Button>
                  <Button
                      variant="contained"
                      sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                      onClick={() => {
                        if(customSNValues.some((value) => value.trim() === "")){
                          setError("Please fill in all the fields")
                        }else{
                          setError("");
                          handleSave();
                          console.log(editData)
                        }
                      }}
                  >
                      Save
                  </Button>
                  </Box>
              </Box>)}
              </Modal>
            </>
        )
}

export default UseResupply;