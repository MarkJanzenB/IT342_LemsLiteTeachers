import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="unauthorized-page">
            <div className="waterMark"></div>
            <div className="content">
                <h1>Unauthorized Access</h1>
                <p>You do not have permission to view this page.</p>
                <button onClick={handleBackToDashboard} className="back-button">Back to Dashboard</button>
            </div>
        </div>
    );
};

export default UnauthorizedPage;