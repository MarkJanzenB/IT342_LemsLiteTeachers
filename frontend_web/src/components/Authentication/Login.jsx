import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'; // Ensure correct import for jwt-decode
import './Login.css'; // Preserves your existing styles
import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import lemslogo from '/src/assets/static/img/LEMS1.png';

export default function Login() {
  const [formData, setFormData] = useState({
    insti_id: '',
    password: ''
  });

  const [disableSUBtn, setDisableSUBtn] = useState(false);
  const [loadingAnim, setLoadingAnim] = useState(false);
  const [error, setError] = useState('');
  const [ logginIn, setLoggingIn] = useState('');
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleChange = (e) => {
    setError(''); // Clear error when input changes
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoggingIn('Logging in...');

    if (!formData.insti_id || !formData.password) {
      setError('Institutional ID and password are required');
      return;
    }
    setLoadingAnim(true);
    setDisableSUBtn(true);

    try {
      // const response = await axios.post("https://it342-lemsliteteachers.onrender.com/user/login", formData);
      const response = await axios.post("https://it342-lemsliteteachers.onrender.com/user/login", formData);
      const token = response.data;

      if (!token) {
        setLoadingAnim(false);
        setDisableSUBtn(false);
        setError('Login failed: No token received');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        // console.log("Decoded Token:", decoded); // Debugging output

        if (decoded && decoded.role_id && decoded.sub) {
          // ✅ Store token & Institutional ID properly
          localStorage.setItem("jwtToken", token);
          localStorage.setItem("userRole", decoded.role_id);
          localStorage.setItem("instiId", decoded.sub);  // 🔥 Fix: Store `instiId`

          setLoadingAnim(false);
          setError('');
          navigate('/dashboard'); // Redirect to dashboard
        } else {
          setLoadingAnim(false);
          setDisableSUBtn(false);
          setError('Login failed: Invalid token structure');
          setLoggingIn('');
        }
      } catch (decodeError) {
        setLoadingAnim(false);
        setDisableSUBtn(false);
        console.error("Error decoding token:", decodeError);
        setError('Incorrect password.');
        setLoggingIn('');
      }
    } catch (error) {
      setLoadingAnim(false);
      setDisableSUBtn(false);
      console.error("Error during login request:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError('Incorrect Institutional ID or password');
        } else {
          setError(`Server error: ${error.response.data || 'Please try again later.'}`);
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      setLoggingIn('');
    }
  };


  const handleSignUp = () => {
    navigate('/register');
  };

  return (
      <>
        <div className="login-container">
          <div className="login-bg" />
          <div className="sign-up">
            <h2>Join Us for a Seamless Laboratory Management Experience</h2>
            <p>Simplify your laboratory operations with our web application </p>
            <p>that streamlines borrowing and enhances inventory management.</p>
            <p>Sign up now to boost your lab's efficiency and productivity!</p>

            <button onClick={handleSignUp} className="sign-up-button">
              SIGN UP
            </button>
            <img
                src={lemslogo}
                alt="LEMS logo"
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  width: '100px',
                  height: 'auto',
                  cursor: 'pointer',
                  zIndex: '3',
                }}
                onClick={handleLogoClick}
            />
          </div>
          <div className="login-box" >
            <div className="border-container">
              <form onSubmit={handleSubmit}>
                <h2>User Authentication</h2>
                <div className="logform">
                  <label style={{ fontSize: '20px', marginTop: '20px' }}>Institutional ID:</label>
                  <input
                      type="text"
                      name="insti_id"
                      value={formData.insti_id}
                      onChange={handleChange}
                      required
                      autoComplete="username"
                      className="outlined-input"
                  />
                </div>
                <div className="logform" >
                  <label style={{ fontSize: '20px' }}>Password:</label>
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                {logginIn && <p className='loggin-in-text'>{logginIn}</p>}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#800000', color: 'white', mt: 2, '&:hover': { backgroundColor: '#660000' } }}
                  type="submit"
                  disabled={disableSUBtn}
                >
                  {loadingAnim ? <CircularProgress size={24} sx={{ color: 'white'}} /> : 'Login'}
                </Button>  
              </form>
            </div>
          </div>
        </div>
      </>
  );
}