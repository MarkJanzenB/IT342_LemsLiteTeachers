import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getJWTFName, getJWTSub } from '../Authentication/jwt';
import axios from 'axios';
import '../GetStarted/GetStarted.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, lastDayOfMonth, setDate } from 'date-fns';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 'fit-content',
    bgcolor: '#FFF1DB',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function GetStarted(){
    const [open, setOpen] = React.useState(true);
    const [openSecondModal, setOpenSecondModal] = React.useState(false);
    const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
    const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
    const [userRole, setUserRole] = useState(parseInt(localStorage.getItem("userRole")));
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleClose = () => {
        setOpen(false);
        setOpenSecondModal(true);
    };

    const handleSecondModalClose = () => {
        if (userRole !== 1) {
            // Show confirmation modal for users who need to set school year
            setOpenConfirmModal(true);
        } else {
            // For user role 1, directly proceed
            proceedWithSubmission();
        }
    };

    const handleConfirmModalClose = (confirmed) => {
        setOpenConfirmModal(false);
        if (confirmed) {
            proceedWithSubmission();
        }
    };

    const handleSuccessModalClose = () => {
        setOpenSuccessModal(false);
    };

    const proceedWithSubmission = () => {
        setOpenSecondModal(false);
        toNotNew().then(() => {
            if (userRole !== 1) {
                setOpenSuccessModal(true);
            }
        });
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
        setUserRole(parseInt(localStorage.getItem("userRole")));
    }, []);

    // Handle start date change
    const handleStartDateChange = (date) => {
        // For user role 3, always set the day to 1 regardless of selected date
        if (userRole === 3) {
            const firstDayOfMonth = setDate(date, 1);
            setStartDate(firstDayOfMonth);
        } else {
            setStartDate(date);
        }
    };

    // Handle end date change
    const handleEndDateChange = (date) => {
        // For user role 3, always set the day to the last day of the month
        if (userRole === 3) {
            const lastDay = lastDayOfMonth(date);
            setEndDate(lastDay);
        } else {
            setEndDate(date);
        }
    };

    const toNotNew = async () => {
        try {
            const jwtToken = localStorage.getItem("jwtToken");

            if(!jwtToken){
                console.log("JWT token not found /GetStarted");
                return;
            }

            // Include school year dates if needed
            const payload = {
                ...jwtSub
            };

            if (userRole !== 1) {
                payload.startDate = format(startDate, 'yyyy-MM-dd');
                payload.endDate = format(endDate, 'yyyy-MM-dd');
            }

            console.log("Request payload:", payload);
            const response = await axios.put("http://localhost:8080/user/tonotnew", payload, {
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

    const getFormattedSchoolYear = () => {
        const startYear = format(startDate, 'yyyy');
        const endYear = format(endDate, 'yyyy');
        return `${startYear}-${endYear}`;
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
                    onClose={() => {}}
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
                           {userRole !== 1
                             ? "First, you need to set up your School Year by selecting start and end dates below. Once that's done, you can start using the system."
                             : "You're all set! Click 'Get Started' to begin using the system."}
                        </Typography>
                        {userRole !== 1 && (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Box sx={{ display: 'grid', rowGap: 2, columnGap: 2, gridTemplateColumns: '1fr', mt: 2 }} className='item-box roboto-light'>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>School Year</Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Typography>Start Date {userRole === 3 ? "(Month and Year only - day will default to 1st)" : ""}</Typography>
                                        <DatePicker
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                            views={userRole === 3 ? ['month', 'year'] : ['day', 'month', 'year']}
                                            slotProps={{
                                                textField: { variant: 'filled', fullWidth: true }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Typography>End Date {userRole === 3 ? "(Month and Year only - day will default to last day of month)" : ""}</Typography>
                                        <DatePicker
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                            views={userRole === 3 ? ['month', 'year'] : ['day', 'month', 'year']}
                                            slotProps={{
                                                textField: { variant: 'filled', fullWidth: true }
                                            }}
                                            minDate={startDate}
                                        />
                                    </Box>

                                    {userRole === 3 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Selected School Year: {format(startDate, 'MMMM d, yyyy')} to {format(endDate, 'MMMM d, yyyy')}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </LocalizationProvider>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button variant="contained" onClick={handleSecondModalClose}>Get Started</Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Confirmation Modal */}
                <Modal
                    open={openConfirmModal}
                    onClose={() => handleConfirmModalClose(false)}
                    aria-labelledby="confirm-modal-title"
                    aria-describedby="confirm-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="confirm-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Confirm School Year
                        </Typography>
                        <Typography id="confirm-modal-description" sx={{ mt: 2, mb: 3 }}>
                            Are you sure you want to set the school year to {getFormattedSchoolYear()}?

                            {userRole === 3 && (
                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                    This will include the period from {format(startDate, 'MMMM d, yyyy')} to {format(endDate, 'MMMM d, yyyy')}.
                                </Box>
                            )}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button variant="outlined" onClick={() => handleConfirmModalClose(false)}>Cancel</Button>
                            <Button variant="contained" onClick={() => handleConfirmModalClose(true)}>Confirm</Button>
                        </Box>
                    </Box>
                </Modal>

                {/* Success Modal */}
                <Modal
                    open={openSuccessModal}
                    onClose={handleSuccessModalClose}
                    aria-labelledby="success-modal-title"
                    aria-describedby="success-modal-description"
                >
                    <Box sx={style}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <CheckCircleIcon style={{ fill: "green", fontSize: 60 }} />
                        </Box>
                        <Typography id="success-modal-title" variant="h5" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                            School Year Set Successfully!
                        </Typography>
                        <Typography id="success-modal-description" sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                            School Year {getFormattedSchoolYear()} has been successfully set.

                            {userRole === 3 && (
                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                    This includes the period from {format(startDate, 'MMMM d, yyyy')} to {format(endDate, 'MMMM d, yyyy')}.
                                </Box>
                            )}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" onClick={handleSuccessModalClose}>Continue to Dashboard</Button>
                        </Box>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

const verifySchoolYearSaved = async () => {
    try {
        const jwtToken = localStorage.getItem("jwtToken");

        if (!jwtToken) {
            console.log("JWT token not found");
            return false;
        }

        // Make a request to get current school year from server
        const response = await axios.get(
            `http://localhost:8080/schoolyear/${jwtSub.insti_id}`,
            {
                headers: {
                    "authorization": `Bearer ${jwtToken}`
                }
            }
        );

        if (response.data) {
            console.log("Saved school year data:", response.data);
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error verifying school year:", error);
        return false;
    }
};