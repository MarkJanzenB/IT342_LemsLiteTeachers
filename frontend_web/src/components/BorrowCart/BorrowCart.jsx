import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from '../Appbar/Appbar.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import axios from 'axios';
import { getJWTSub, getJWTUid } from '../Authentication/jwt.jsx';
import './BorrowCart.css';
import { getJWTFullName } from '../Authentication/jwt.jsx';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';


export default function BorrowCart() {
    const [borrowCart, setBorrowCart] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [teacherSchedules, setTeacherSchedules] = useState([]); // ✅ Add this
    const token = localStorage.getItem('jwtToken'); // ✅ Add this
    const user = { instiId: getJWTSub() }; // ✅ Add this
    const jwtToken = localStorage.getItem("jwtToken");  // Example, assuming the token is in localStorage


    useEffect(() => {
        fetchBorrowCart();
    }, []);

    const fetchBorrowCart = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('JWT token is missing. Please log in.');
            return;
        }

        try {
            const response = await axios.get(`https://it342-lemsliteteachers.onrender.com/api/borrowcart/instiId/${getJWTSub()}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            });

            const cartWithVariants = await Promise.all(response.data.map(async (item) => {
                const variants = await fetchVariantsForItem(item.itemName);
                return {
                    ...item,
                    variants: variants.length ? variants : ["Default"],
                    variant: item.variant || variants[0] || "Default"
                };
            }));

            setBorrowCart(cartWithVariants);
        } catch (error) {
            console.error('Error fetching borrow cart items:', error);
        }
    };


    useEffect(() => {
        if (openModal) {
            console.log("Fetched UID: ", getJWTUid());
            axios.get(`https://it342-lemsliteteachers.onrender.com/api/borrowcart/teacherSchedule/${getJWTUid()}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            })
                .then(res => {
                    setTeacherSchedules(res.data);
                })
                .catch(err => console.error(err));
        }
    }, [openModal]);


    const fetchVariantsForItem = async (itemName) => {
        const jwtToken = localStorage.getItem('jwtToken'); // Get token *inside* the function
        if (!jwtToken) {
            console.error('JWT token is missing when fetching variants for', itemName);
            //  Important:  Consider throwing an error or returning an empty array here
            //  to prevent the rest of the code from proceeding with invalid data.
            return []; // Or throw an error:  throw new Error('JWT token is missing');
        }

        try {
            const response = await axios.get(
                `https://it342-lemsliteteachers.onrender.com/api/items/variants?itemName={itemName}`,
                {
                    headers: {  //  Include headers here!
                        'Authorization': `Bearer ${jwtToken}`
                    }
                }
            );
            console.log("Variants for item:", itemName, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching variants for ${itemName}:`, error);
            return [];
        }
    };



    const fetchTeacherSchedules = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('JWT token is missing');
            return;
        }

        try {
            const instiId = getJWTSub(); // Assuming getJWTSub() returns the instiId
            console.log('Fetching teacher schedule for instiId:', instiId);
            const response = await axios.get(
                `https://it342-lemsliteteachers.onrender.com/api/borrowcart/teacherSchedule/${instiId}`, // Call the BorrowCartController endpoint
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}` // Still include the authorization header
                    }
                }
            );

            setSchedules(response.data);
            console.log('Schedules state (from /borrowcart/):', response.data);
            if (response.data.length > 0) {
                setSelectedSchedule(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching teacher schedules (via /borrowcart/):', error);
        }
    };



    const handleRemoveItem = async (borrowCartId) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error("JWT token is missing. Please log in.");
            return;
        }

        try {
            await axios.delete(`https://it342-lemsliteteachers.onrender.com/api/borrowcart/${borrowCartId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            });

            // Update the state by removing the item from the UI after successful deletion
            setBorrowCart((prevCart) => prevCart.filter((item) => item.id !== borrowCartId));

            console.log(`Item with borrow_cart_id ${borrowCartId} removed.`);
        } catch (error) {
            console.error("Error removing item from borrow cart:", error);
        }
    };


    const handleQuantityChange = async (borrowCartId, newQuantity) => {

        if (newQuantity >= 1) {

            setBorrowCart((prevCart) =>

                prevCart.map((item) =>

                    item.id === borrowCartId ? { ...item, quantity: newQuantity } : item

                )

            );

            try {

                const response = await axios.put(

                    `https://it342-lemsliteteachers.onrender.com/api/borrowcart/${borrowCartId}`,

                    { quantity: newQuantity },

                    { headers: { Authorization: `Bearer ${token}` } }

                );

                // Handle success (e.g., display a message)

            } catch (error) {

                console.error("Error updating quantity:", error.response?.data?.message || error.message);

                // Revert local state on error (optional, depends on desired behavior)

                fetchBorrowCart(); // Re-fetch cart to get correct quantities

                // Or update local state to the previous value

            }

        }

    };




    const handleProceedToBorrow = async () => {
        const jwtToken = localStorage.getItem("jwtToken");

        if (!jwtToken) {
            console.error("No JWT token found. Please log in again.");
            alert("Session expired! Please log in again.");
            localStorage.removeItem("jwtToken");
            navigate("/login");
            return;
        }

        if (borrowCart.length === 0) {
            alert("Your borrow cart is empty!");
            return;
        }

        if (!selectedSchedule?.teacher_schedule_id) {
            alert("Please select a schedule before proceeding to borrow.");
            return;
        }

        console.log("Proceeding to move items to Preparing state...");

        try {
            const payload = {
                teacherScheduleId: selectedSchedule.teacher_schedule_id,
                // You might need to include other data here based on your backend requirements
                // For example, the list of items in the cart if the backend doesn't fetch it again.
                // items: borrowCart.map(item => ({ itemId: item.itemId, quantity: item.quantity })),
            };

            console.log("Payload:", payload);
            await axios.post(
                `https://it342-lemsliteteachers.onrender.com/api/borrowcart/finalize/${getJWTSub()}`,
                payload, // <-- Include the payload in the request body
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            // Clear borrow cart after finalization
            await axios.delete(
                `https://it342-lemsliteteachers.onrender.com/api/borrowcart/clear/${getJWTSub()}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );

            console.log("Borrow cart successfully cleared!");
            setBorrowCart([]);
            setOpenModal(false);
            setOpenAlert(true);
        } catch (error) {
            console.error("Error during borrow process:", error);
            alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
        }
    };





    return (
        <div className="borrowcart-container">
            <Appbar page={"borrowcart"} />
            <Sidebar page={"inventory"} />
            <div className="borrowcart-content">
                <Box sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h4" gutterBottom>Borrow Cart</Typography>

                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#016565',
                                color: '#FFF',
                                '&:hover': { backgroundColor: borrowCart.length === 0 ? '#ccc' : '#014d4d' }
                            }}
                            onClick={async () => {
                                await fetchTeacherSchedules();
                                setSelectedSchedule(null); // Reset selectedSchedule when the modal opens
                                setOpenModal(true);
                            }}
                            disabled={borrowCart.length === 0}
                        >
                            Finalize Borrow
                        </Button>


                    </Box>
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#016565' }}>

                                <TableRow>

                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Item Name</TableCell>

                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Category</TableCell>

                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Variant</TableCell>

                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Quantity</TableCell>

                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {borrowCart.map((item, index) => (
                                    <TableRow key={item.id}> {/* Using item.id which corresponds to borrow_cart_id */}
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>

                                        <TableCell>
                                            {item.variants && item.variants.length > 0 ? (
                                                <select
                                                    value={item.variant || ""}
                                                    onChange={async (e) => {
                                                        const newVariant = e.target.value;
                                                        setBorrowCart(prevCart =>
                                                            prevCart.map(cartItem =>
                                                                cartItem.id === item.id
                                                                    ? { ...cartItem, variant: newVariant }
                                                                    : cartItem
                                                            )
                                                        );
                                                        try {
                                                            await axios.put(
                                                                `https://it342-lemsliteteachers.onrender.com/api/borrowcart/updateVariant/${item.id}`,
                                                                { variant: newVariant },
                                                                { headers: { Authorization: `Bearer ${token}` } }
                                                            );
                                                        } catch (error) {
                                                            console.error("Error updating variant:", error);
                                                        }
                                                    }}
                                                >
                                                    {item.variants.map((variantOption, idx) => (
                                                        <option key={idx} value={variantOption}>
                                                            {variantOption}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">N/A</Typography>
                                            )}
                                        </TableCell>


                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                >
                                                <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>

                                        <TableCell>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveItem(item.id, item.quantity, item.itemName)}
                                            >
                                                <DeleteIcon /> {/* Using an icon for remove */}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </div>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxHeight: '90%', bgcolor: '#F2EE9D', boxShadow: 24, p: 4, display: 'flex', flexDirection: 'column', gap: 2, borderRadius: '25px', overflow: 'auto' }}>
                    <Typography variant="body1">Teacher's name: {getJWTFullName()}</Typography>



                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}> {/* Flex container for Select Schedule */}
                        <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>Select Schedule:</Typography>
                        <div style={{ width: '300px' }}> {/* Container for the select element */}
                            <select
                                value={selectedSchedule ? selectedSchedule.teacher_schedule_id : ""}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    const sched = schedules.find(s => s.teacher_schedule_id === selectedId);
                                    setSelectedSchedule(sched);
                                }}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    marginBottom: '10px',
                                    width: '100%',
                                }}
                            >
                                <option value="" disabled>Select a Schedule</option>
                                {schedules.map(schedule => (
                                    <option key={schedule.teacher_schedule_id} value={schedule.teacher_schedule_id}>
                                        {`${new Date(schedule.date).toLocaleDateString()} | ${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)} | Lab ${schedule.lab_num}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Box>

                    <Typography variant="body1">Borrow Cart List:</Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#016565' }}>
                                <TableRow>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Item Name</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell sx={{ color: '#FFF', fontWeight: 'bold' }}>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {borrowCart.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" sx={{ backgroundColor: '#016565', color: '#FFF', '&:hover': { backgroundColor: '#014d4d' } }}
                            onClick={handleProceedToBorrow}>Proceed to Borrow</Button>
                </Box>
            </Modal>
            <Modal open={openAlert} onClose={() => setOpenAlert(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '10px' }}>
                    <Typography variant="h6">Borrow Request Processed</Typography>
                    <Typography sx={{ mt: 2 }}>Your borrow request has been processed and is now Preparing.</Typography>
                    <Button variant="contained" sx={{ backgroundColor: '#016565', color: '#FFF', '&:hover': { backgroundColor: '#014d4d' } }} onClick={() => navigate('/history/preparingitem')}>Go to Preparing Item</Button>
                </Box>
            </Modal>
        </div>
    );
}