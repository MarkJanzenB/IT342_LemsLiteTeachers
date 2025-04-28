import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from 'react';
import StyledPaper from "./MyPaper";
import logo from "../assets/static/img/Cebu_Institute_of_Technology_University_logo.jpg";
import logo3 from "../assets/static/img/cit-logo.png";
import lems from "../assets/static/img/lems.png";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

import axios from "axios";

const register = async (credentials) => {
    try {
        const response = await axios.post("http://localhost:8080/user/register", credentials);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

const firebaseConfig = {
    apiKey: "AIzaSyDZGXMjVVHmEo3V-29wRXvkdXLZ5SjqFzs",
    authDomain: "lems-3bbc3.firebaseapp.com",
    projectId: "lems-3bbc3",
    storageBucket: "lems-3bbc3.appspot.com",
    messagingSenderId: "896933531342",
    appId: "1:896933531342:web:c1223997c4f7126cbfca9f",
    measurementId: "G-WZ8QQBDX7V"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export default function Register() {
    const [formData, setFormData] = useState({
        idNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [credentials, setCredentials] = useState({
        fname: '',
        lname: '',
        password: '',
        idnum: '',
        email: '',
        acctype: 'lol'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!credentials.email.endsWith('@cit.edu')) {
            setError('Email must end with @cit.edu');
            return;
        }
        try {
            await register(credentials);
            console.log('Form submitted:', credentials);
            setError('');
            setSuccess('User successfully created');
        } catch (e) {
            console.error("Error submitting form: ", e);
            setError('Error submitting form');
            setSuccess('');
        }
    };

    function testing(){
        console.log(credentials);
    }

    const handleBack = () => {
        navigate('/'); // Adjust the path as needed
    };
    const handleLoginRedirect = () => {
        navigate('/login'); // Adjust the path as needed
    };

    return (
        <>
            <Button onClick={handleBack} sx={{ marginTop: '20px' }}>Back</Button>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ backgroundColor: "white" }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <img className="inline-element logo1" src={logo} alt="Cebu Institute of Technology University Logo" style={{ marginRight: '20px' }} />
                        <img className="inline-element logo2" src={lems} alt="LEMS Logo" style={{ marginRight: 'auto' }} />
                        <Button onClick={handleLoginRedirect} sx={{ color: 'black', backgroundColor: '#ccffff',border: '2px solid teal' }}>Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <hr/>
            <br/>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <StyledPaper width="600px" height="610px">
                    <form onSubmit={handleSubmit}>
                        <Box component="section" sx={{ p: 2, border: '1px solid grey' }}>
                            <h1>CREATE LEMS ACCOUNT</h1>
                        </Box>
                        <Box component="section" sx={{ p: 2, border: '1px solid grey' }}>
                            <div className="form-group">
                                <TextField
                                    label="ID Number"
                                    type="text"
                                    name="idnum"
                                    value={credentials.idnum}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    margin="normal"
                                    autoComplete="username"
                                    sx={{ width: '80%' }}
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    label="First Name"
                                    type="text"
                                    name="fname"
                                    value={credentials.fname}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    margin="normal"
                                    autoComplete="given-name"
                                    sx={{ width: '80%' }}
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    label="Last Name"
                                    type="text"
                                    name="lname"
                                    value={credentials.lname}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                    margin="normal"
                                    autoComplete="family-name"
                                    sx={{ width: '80%' }}
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
                                    autoComplete="email"
                                    sx={{ width: '80%' }}
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
                                    autoComplete="current-password"
                                    sx={{ width: '80%' }}
                                />
                            </div>
                            {success && <p style={{color: 'green'}}>{success}</p>}
                            {error && <p style={{color: 'red'}}>{error}</p>}
                            <br/>
                            <button type="submit" className="center-button">NEXT</button>
                        </Box>
                    </form>
                </StyledPaper>
            </div>
        </>
    );
}