import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from '../Appbar/Appbar.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import axios from 'axios';
import { getJWTSub, getJWTUid } from '../Authentication/jwt.jsx';
import './BorrowCart.css';

export default function BorrowCart() {
    const [borrowCart, setBorrowCart] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const navigate = useNavigate();

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
            console.log("Fetching borrow cart items...");
            const response = await axios.get(`http://localhost:8080/api/borrowcart/instiId/${getJWTSub()}`, {
                headers: { 'Authorization': `Bearer ${jwtToken}` }
            });
            console.log("Borrow cart items fetched:", response.data);
            setBorrowCart(response.data);
        } catch (error) {
            console.error('Error fetching borrow cart items:', error);
        }
    };

    const handleRemoveItem = async (borrowCartId) => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error("JWT token is missing. Please log in.");
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/borrowcart/${borrowCartId}`, {
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

        console.log("Proceeding to move items to Preparing state...");

        try {
            // Ensure the Authorization header is correct
            await axios.post(
                `http://localhost:8080/api/borrowcart/finalize/${getJWTSub()}`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,  // Ensure correct JWT token here
                        "Content-Type": "application/json"
                    }
                }
            );

            // Clear borrow cart after finalization
            await axios.delete(
                `http://localhost:8080/api/borrowcart/clear/${getJWTSub()}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );

            console.log("Borrow cart successfully cleared!");
            setBorrowCart([]);  // Reset cart in frontend
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
                        <Button variant="contained"
                                sx={{
                                    backgroundColor: '#016565',
                                    color: '#FFF',
                                    '&:hover': { backgroundColor: borrowCart.length === 0 ? '#ccc' : '#014d4d' }
                                }}
                                onClick={() => setOpenModal(true)}
                                disabled= {borrowCart.length === 0}
                        >
                            Finalize Borrow
                        </Button>
                    </Box>
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {borrowCart.map((item, index) => (
                                    <TableRow key={item.id}> {/* Using item.id which corresponds to borrow_cart_id */}
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell>{item.categoryName}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleRemoveItem(item.id, item.quantity, item.itemName)}
                                            >
                                                Remove
                                            </Button>
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
                    <Typography variant="body1"> Teacher's name: Mr. Instructor</Typography>
                    <Typography variant="body1">Schedule: Nov 21, 2024 | 10:00 AM - 12:00 PM</Typography>
                    <Typography variant="body1">Borrow Cart List:</Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Quantity</TableCell>
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
                    <Button variant="contained" sx={{ backgroundColor: '#016565', color: '#FFF', '&:hover': { backgroundColor: '#014d4d' } }} onClick={() => navigate('/history/list')}>Go to Borrow List</Button>
                </Box>
            </Modal>
        </div>
    );
}