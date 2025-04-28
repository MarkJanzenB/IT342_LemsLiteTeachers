import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { Box, MenuItem, Select, FormControl, InputLabel, CircularProgress } from '@mui/material';
import axios from "axios";
import lemslogo from '/src/assets/static/img/LEMS1.png';


const register = async (credentials) => {
    console.log("Request payload:", credentials);

    try {
        // const response = await axios.post("https://it342-lemsliteteachers.onrender.com/user/register", credentials);
        const response = await axios.post("https://it342-lemsliteteachers.onrender.com/user/register", credentials);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export default function Register() {
    const [credentials, setCredentials] = useState({
        first_name: '',
        last_name: '',
        insti_id: '',
        email: '',
        password: '',
        role: { role_id: 0 },
    });

    const [disableSUBtn, setDisableSUBtn] = useState(false);
    const [loadingAnim, setLoadingAnim] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAccountTypeForm, setShowAccountTypeForm] = useState(false);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "role") {
            setCredentials({
                ...credentials,
                role: { role_id: value },
            });
        } else {
            setCredentials({
                ...credentials,
                [name]: value,
            });
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        if (!credentials.email.endsWith('@cit.edu')) {
            setError('Please enter a valid CIT email');
            return;
        }

        if(!credentials.insti_id.match("^[a-zA-Z0-9_-]+$")){
            return setError('Institute ID should not contain special characters')
        }

        // const isUserAlrdyExists = await axios.get(`https://it342-lemsliteteachers.onrender.com/user/isuseralrdyexists?instiId=${credentials.insti_id}`);
        const isUserAlrdyExists = await axios.get(`https://it342-lemsliteteachers.onrender.com/user/isuseralrdyexists?instiId=${credentials.insti_id}`);
        if (isUserAlrdyExists.data) {
            setError("Institute ID already exists. Sign in instead?");
            return;
        }
        setShowAccountTypeForm(true);
        setError('');
    };

    const handleAccountTypeNext = async (e) => {
        e.preventDefault();
        if (!credentials.first_name || !credentials.last_name || !credentials.insti_id || !credentials.email || !credentials.password || !credentials.role) {
            setError('All fields are required');
            return;
        }
        setLoadingAnim(true);
        setDisableSUBtn(true);
        try {
            await register(credentials);
            console.log('Form submitted');
            setSuccess('Successfully Registered! Redirecting to Login form in 5 seconds');
            setLoadingAnim(false);
            setError('');
            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } catch (e) {
            setLoadingAnim(false);
            setDisableSUBtn(false);
            console.error("Error submitting form: ", e);
            setError('Error submitting form');
            setSuccess('');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <>
            <div className="register-container">
                <div className="register-background" />
                <Box className="register-paper">
                    {!showAccountTypeForm ? (
                        <form onSubmit={handleNext}>
                            <Box component="section" sx={{ p: 2 }}>
                                <h1>CREATE LEMS ACCOUNT</h1>
                            </Box>
                            <Box component="section" sx={{ p: 2 }}>
                                <div className="form-group">
                                    <TextField
                                        label="ID Number"
                                        type="text"
                                        name="insti_id"
                                        value={credentials.insti_id}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        margin="normal"
                                        autoComplete={'off'}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        label="First Name"
                                        type="text"
                                        name="first_name"
                                        value={credentials.first_name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        margin="normal"
                                        autoComplete={"off"}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        label="Last Name"
                                        type="text"
                                        name="last_name"
                                        value={credentials.last_name}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        margin="normal"
                                        autoComplete={'off'}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        margin="normal"
                                        autoComplete={'off'}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextField
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        margin="normal"
                                        autoComplete={'off'}
                                    />
                                </div>
                                <Button type="submit" variant="contained"
                                        style={{ backgroundColor: '#800000', color: 'white', width: '300px' }}
                                        className="next-button">NEXT</Button>
                            </Box>
                        </form>
                    ) : (
                        <form onSubmit={handleAccountTypeNext}>
                            <Box component="section" sx={{ p: 2 }}>
                                <h1>SELECT ACCOUNT TYPE</h1>
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Account Type</InputLabel>
                                    <Select
                                        label="Account Type"
                                        name="role"
                                        value={credentials.role_id}
                                        onChange={handleChange}
                                        sx={{ color: '#000' }}
                                    >
                                        <MenuItem value={3}>Laboratory In-Charge</MenuItem>
                                        <MenuItem value={2}>Laboratory Assistant</MenuItem>
                                        <MenuItem value={1}>Science Teacher</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ backgroundColor: '#800000', color: 'white', mt: 2, '&:hover': { backgroundColor: '#660000' } }}
                                    type="submit"
                                    disabled={disableSUBtn}
                                >
                                    {loadingAnim ? <CircularProgress size={24} sx={{ color: 'white'}} /> : 'Sign up'}
                                </Button>   
                            </Box>
                        </form>
                    )}
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                    {success && <Typography color="success" sx={{ mt: 2 }}>{success}</Typography>}
                </Box>
                <div className="image-side">
                    <h1 style={{ color: '#800000', fontSize: "2em" }}>Welcome Back to Your Laboratory Management Hub</h1>
                    <p className="custom-paragraph">
                        Revisit your streamlined laboratory experience with our application that efficiently tracks borrowing and breakages. Sign in now to continue managing your lab with ease!
                    </p><br />
                    <Button
                        variant="contained"
                        style={{ backgroundColor: '#800000', color: 'white' }}
                        onClick={handleLoginRedirect}
                        sx={{ width: '130px', height: '35px', fontSize: '1em', lineHeight: '1.5' }}
                    >
                        SIGN IN
                    </Button>
                    <img
                        src={lemslogo}
                        alt="LEMS logo"
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '100px',
                            height: 'auto',
                            cursor: 'pointer',
                            zIndex: '3',
                        }}
                        onClick={handleLogoClick}
                    />
                </div>
            </div>
        </>
    );
}