import React, { useEffect, useState } from "react";
import MyPaper from "../MyPaper.jsx";
import profile from '/src/assets/static/img/profile2.gif';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {Box, IconButton, InputLabel, Snackbar} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getJWTUid } from "../Authentication/jwt.jsx";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import CloudinaryWidget from "../Cloudinary/CloudinaryWidget.jsx";
import './EditProfile.css';

export default function EditProfile() {
    const navigate = useNavigate();
    const jwtToken = localStorage.getItem("jwtToken");
    const [warning, setWarning] = useState("");
    const [userAlrdyExst, setUserAlrdyExst] = useState("");
    const [oldInstiId, setOldInstiID] = useState("");
    const [openModal, setOpenModal] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [disableButton, setDisableButton] = useState(true);   

    const [fetchedData, setFetchedData] = useState({});
    const [oldUserData, setOldUserData] = useState({});

    const [profileImage, setProfileImage] = useState(profile);
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (event) => {
        const {name, value} = event.target;

        if (name === "email" && !value.endsWith('@cit.edu') || value.startsWith('@')) {
            setWarning("Please enter a valid CIT email");
            setDisableButton(true);
        }else{
            setWarning("");
            setDisableButton(false);
        }

        if (value === oldUserData[name]) {
            setDisableButton(true);
        } else {
            setDisableButton(false);
        }

        setFetchedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    useEffect(() => {
        const uid = getJWTUid();
        axios.get(`https://it342-lemsliteteachers.onrender.com/user/getuser?uid=${uid}`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            setFetchedData(response.data);
            setOldUserData(response.data);
            setOldInstiID(response.data.insti_id);
        })
        .catch(error => {
            console.log("Thy error: ",error.data);
        })
    }, []);

    const handleCancel = () => navigate(-1);

    const buttonStyle = {
        border: '1px solid #056765',
        borderRadius: '4px',
        padding: '8px 16px',
        margin: '8px 0',
        display: 'block',
        textAlign: 'center',
        textDecoration: 'none',
        backgroundColor: 'white',
        justifyContent: 'center',
        marginLeft: '38%',
        width: '25%',
        '&:hover': {
            backgroundColor: '#FFFFFF',
        }
    };

    // const updateUser = async () => {
    //     try {
    //         await axios.put(`https://it342-lemsliteteachers.onrender.com/user/update`, fetchedData, {
    //             headers: {
    //                 "Authorization": `Bearer ${jwtToken}`
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const updateUser = async () => {
        try {
            const formData = new FormData();
            // Add all user data to formData
            Object.entries(fetchedData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Add profile image if changed
            if (imageFile) {
                formData.append('profileImage', imageFile);
            }

            await axios.put(`https://it342-lemsliteteachers.onrender.com/user/update`, formData, {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = async () => {
        if (oldInstiId != fetchedData.insti_id){
            setOpenModal(true);
        }else{
            await updateUser();
            setOpenSnackbar(true);
        }
    };

    const handleSavePart2 = async () => {
        const isUserAlrdyExists = await axios.get(`https://it342-lemsliteteachers.onrender.com/user/isuseralrdyexists?instiId=${fetchedData.insti_id}`);
        if (isUserAlrdyExists.data) {
            setUserAlrdyExst("Institute ID already exists.");
            setOpenModal(false);
            return;
        }else{
            setOpenModal(false);
            await updateUser();
            navigate('/login');
        }
    };

    const style = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        bgcolor:'#FFF1DB',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
        textAlign: 'center',
      };

    const handleSnackbarClose = (event, reason) => {
        setOpenSnackbar(false);
    }

    const formContainerStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%',
        height: '80%',
        backgroundColor: '#FFFFBA',
        borderRadius: '50px',
        padding: '20px',
    };

    const boxStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px',
        width: '100%',
    };

    const inputLabelStyle = {
        fontSize: '20px',
        marginRight: '16px',
        width: '20%',
    };

    const textFieldStyle = {
        width: '80%',
        fontSize: '20px',
    };

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

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWidgetClose = (newUrl) => {
        setFetchedData((prevData) => ({
            ...prevData,
            pfp: newUrl
        }))
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            {openModal && (
                <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography className='.roboto-thin' variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
                        Re-login Required
                    </Typography>
                    <Typography id="modal-modal-description" className='.roboto-thin' sx={{ mt: 2 }}>
                        You've changed your institute ID. To apply this update, you'll need to log in again after saving.
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="outlined" sx={{ color: '#800000', borderColor: '#800000' }} onClick={() => setOpenModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#800000', color: '#FFF', '&:hover': { backgroundColor: '#5c0000' } }}
                            onClick={handleSavePart2}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
              </Modal>
            )}
            <div style={{ position: 'relative', width: '40%', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "#FFFFBA", borderRadius: '50px', flexDirection: 'column'}}>
                <div className="edit-profile-thick-white-line"></div>
                <div className="edit-profile-circle">
                    <div className="edit-profile-inner-circle" style={{backgroundImage: `url(${fetchedData.pfp ? fetchedData.pfp : profileImage})`}}>
                    </div>
                </div>
                <div className="edit-profile-photo-btn">
                    <CloudinaryWidget onClose={handleWidgetClose}/>
                </div>
            </div>
            <div style={{ width: '2px', height: '70%', borderLeft: '2px dashed #FFFFFF' }}></div>
            <div style={{ position: 'absolute', top: 24, right: 8 }}>
                <Button onClick={handleCancel}><img src={"/exit.gif"} style={{
                    width: '30px',
                    height: '30px',
                }} /></Button>
            </div>
            <MyPaper width="50%" height="80%" style={{ backgroundColor: "#FFFFBA", borderRadius: '50px', display: 'flex' }}>
                <div style={{ width: '100vh', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position:'fixed' }}>
                        <h1 style={{ fontSize: '50px', textAlign: 'center', marginLeft: '180px' }}>Basic Information</h1>
                    </div>
                    <br />
                    <div style={{marginTop:'60px'}}>
                    <Box display="flex" alignItems="center" marginBottom="16px"  >
                        <InputLabel style={{ fontSize: '20px', marginRight: '16px' }}>First Name</InputLabel>
                        <TextField
                            name="first_name"
                            placeholder="First Name"
                            variant="outlined"
                            sx={{ width: '80%' }} // Adjust the width as needed
                            InputProps={{ style: { fontSize: '20px' } }}
                            value={fetchedData ? fetchedData.first_name : ''}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" marginBottom="16px" >
                    <InputLabel style={{ fontSize: '20px', marginRight: '16px' }}>Last Name</InputLabel>
                    <TextField
                        name="last_name"
                        placeholder="Last Name"
                        variant="outlined"
                        sx={{ width: '80%' }}
                        InputProps={{ style: { fontSize: '20px' } }}
                        value={fetchedData ? fetchedData.last_name : ''}
                        onChange={handleChange}
                    />
                    </Box>
                    <Box display="flex" alignItems="center" marginBottom="16px">
                    <InputLabel style={{  fontSize: '20px', marginRight: '16px' }}>ID Number</InputLabel>
                    <TextField
                        error={userAlrdyExst}
                        helperText={userAlrdyExst}
                        name="insti_id"
                        placeholder="ID Number"
                        variant="outlined"
                        sx={{ width: '80%' }}
                        InputProps={{ style: { fontSize: '20px' } }}
                        value={fetchedData ? fetchedData.insti_id : ''}
                        // onChange={handleChange}
                        disabled
                    />
                    </Box>
                    <Box display="flex" alignItems="center" marginBottom="16px">
                    <InputLabel style={{  fontSize: '20px', marginRight: '64px' }}>Email</InputLabel>
                    <TextField
                        error={warning}
                        helperText={warning}
                        name="email"
                        placeholder="Email"
                        variant="outlined"
                        sx={{ width: '80%' }}
                        InputProps={{ style: { fontSize: '20px' } }}
                        value={fetchedData ? fetchedData.email : ''}
                        onChange={handleChange}
                    />
                    </Box>
                    <Button 
                        sx={buttonStyle} 
                        variant="outlined" 
                        disabled={warning || disableButton}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </div>
                </div>
            </MyPaper>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Profile updated Successfully"
                action={SnackbarAction}
            />
        </div>
    );
}