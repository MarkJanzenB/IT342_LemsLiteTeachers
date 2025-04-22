import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import  Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getJWTFName, getJWTSub } from '../Authentication/jwt';
import axios from 'axios';
import '../GetStarted/GetStarted.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 'fit-content',
    bgcolor:'#FFF1DB',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function GetStarted(){
    const [open, setOpen] = React.useState(true);
    const [openSecondModal, setOpenSecondModal] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        setOpenSecondModal(true);
    };

    const handleSecondModalClose = () => {
        setOpenSecondModal(false);
        toNotNew();
    };

    const [jwtSub, setJwtSub] = useState({
        insti_id: ''
    });
    const [jwtRole, setJwtRole] = useState();

    useEffect(() => {
        const jwtInstiId = getJWTSub();
        if (jwtInstiId != null){
            setJwtSub((prev) => ({
                ...prev,
                insti_id: jwtInstiId,
            }));
        }else{
            console.log("Could not get JWT sub /GetStarted/instiid");
        }

        setJwtRole(getJWTFName());
    }, []);

    const toNotNew = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");

            if(!jwtToken){
                console.log("JWT token not found /GetStarted");
                return;
            }

            console.log("Request payload:", jwtSub);
            const response = await axios.put("http://localhost:8080/user/tonotnew", jwtSub,{
                headers: {
                    "authorization": `Bearer ${jwtToken}`,
                }});
            console.log("Is User New?", response.data);
            return response.data;
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            throw error;
        }
    };

    return(
        <>
            <div>
                {/* First Modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                            <img src={'../src/assets/static/img/LEMS1.png'} alt="Logo" width={500} />
                        </Box>
                        <Typography id="modal-modal-titles" className='.roboto-thin' variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                            {parseInt(localStorage.getItem("userRole")) === 1 || parseInt(localStorage.getItem("userRole")) === 3
                                ? `Welcome to LEMS, Teacher ${jwtRole}!`
                                : `Welcome to LEMS, ${jwtRole}!`}
                        </Typography>
                        <Typography id="modal-modal-description" className='.roboto-thin' sx={{ mt: 2 }}>
                            This system is designed to simplify and enhance the management of laboratory resources, from scheduling and borrowing equipment to tracking inventory and breakages. Here's how we can help you:
                        </Typography>
                        <Box sx={{ display: 'grid', rowGap: 3, columnGap: 1, gridTemplateColumns: 'repeat(2, 1fr)' }} className='item-box roboto-light'>
                            <p><CheckCircleIcon style={{fill: "green"}} fontSize="large"/>Efficiently Borrow Equipment</p>
                            <p><CheckCircleIcon style={{fill: "green"}} fontSize="large"/>Track Equipment Condition</p>
                            <p><CheckCircleIcon style={{fill: "green"}} fontSize="large"/>Manage Inventory</p>
                            <p><CheckCircleIcon style={{fill: "green"}} fontSize="large"/>Generate Reports</p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={handleClose}>Next</Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Second Modal */}
                <Modal
                    open={openSecondModal}
                    onClose={handleSecondModalClose}
                    aria-labelledby="second-modal-title"
                    aria-describedby="second-modal-description"
                >
                    <Box sx={style}>
                        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                            <img src={'../src/assets/static/img/LEMS1.png'} alt="Logo" width={500} />
                        </Box>
                        <Typography id="second-modal-title" className='.roboto-thin' variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                            Getting Started
                        </Typography>
                        <Typography id="second-modal-description" className='.roboto-thin' sx={{ mt: 2 }}>
                           First, you need to set up your School Year (Start and End Date) below. Once that's done, you can start using the system.:
                        </Typography>
                        <Box sx={{ display: 'grid', rowGap: 3, columnGap: 1, gridTemplateColumns: '1fr' }} className='item-box roboto-light'>
                            <p>School Year</p>
                            <Select variant={'filled'}>
                                 <option value="SY2023-2024">SY 2023-2024</option>
                                 <option value="SY2024-2025">SY 2024-2025</option>
                                 <option value="SY2025-2026">SY 2025-2026</option>
                           </Select>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" onClick={handleSecondModalClose}>Get Started</Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </>
    );
}