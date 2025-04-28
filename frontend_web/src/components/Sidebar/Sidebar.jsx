import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Divider, Modal, Box, TextField, Typography, Button, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";
import axios from 'axios';
import { getJWTSub, getJWTFullName, getJWTUid } from "../Authentication/jwt.jsx";
import './Sidebar.css';

export default function Sidebar({ page }) {
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = parseInt(localStorage.getItem("userRole"));
    const [openModal, setOpenModal] = useState(false);
    const [getTeacher, setTeacher] = useState('');
    const [getRemarks, setRemarks] = useState(null);
    const [getRoom, setRoom] = useState(null);
    const [getDate, setDate] = useState(null);
    const [getStartHour, setStartHour] = useState('');
    const [getStartMinute, setStartMinute] = useState('');
    const [getEndHour, setEndHour] = useState('');
    const [getEndMinute, setEndMinute] = useState('');
    const [getYearSection, setYearSection] = useState('');
    const [getSubject, setSubject] = useState('');
    const [getApproval, setApproval] = useState('');
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const labels = {
        schedules: 'Schedules',
        inventory: 'Inventory',
        reports: 'Reports',
        history: 'History'
    };

    const label = labels[page] || 'Return';
    const [teacherId, setTeacherId] = useState(0);
    const jwtToken = localStorage.getItem("jwtToken");
    const [teachers, setTeachers] = useState([{ user_id: 0, fullname: '' }]);
    const [subjects, setSubjects] = useState([{}]);
    const [subjectId, setSubjectId] = useState(0);

    const handleCreateRequest = () => {
        axios.get("http://localhost:8080/user/getallusersbyroleid?roleId=1", {
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
            .then(response => {
                const updatedTeachers = response.data.map(teacher => ({
                    ...teacher,
                    fullname: `${teacher.first_name} ${teacher.last_name}`
                }));
                setTeachers(updatedTeachers);
            })
            .catch(error => console.log(error));

        axios.get("http://localhost:8080/subject/getallsubject", {
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
            .then(response => setSubjects(response.data))
            .catch(error => console.log(error));

        if (userRole !== 1) {
            setTeacher('');
            setApproval('Approved');
        }
        if (userRole === 1) {
            setTeacher(getJWTSub());
            setTeacherId(getJWTUid());
            setApproval('Pending');
        }
        setDate(null);
        setStartHour('');
        setStartMinute('');
        setEndHour('');
        setEndMinute('');
        setYearSection('');
        setSubject('');
        setRoom('');
        setOpenModal(true);
    };

    const handleSave = () => setOpenConfirmModal(true);

    const handleConfirmSave = () => {
        const [minute, period] = getStartMinute.split(" ");
        const [endminute, endperiod] = getEndMinute.split(" ");
        let hour = parseInt(getStartHour, 10);
        let endhour = parseInt(getEndHour, 10);

        if (period === "AM") {
            if (hour === 12) {
                hour = 0; // Midnight case (12 AM = 00 in 24-hour format)
            }
        } else if (period === "PM") {
            if (hour !== 12) {
                hour += 12; // PM, add 12 to convert to 24-hour format (e.g., 1 PM = 13)
            }
        }

        if (endperiod === "AM") {
            if (endhour === 12) {
                endhour = 0; // Midnight case (12 AM = 00 in 24-hour format)
            }
        } else if (endperiod === "PM") {
            if (endhour !== 12) {
                endhour += 12; // PM, add 12 to convert to 24-hour format (e.g., 1 PM = 13)
            }
        }

        console.log(getApproval)

        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.padStart(2, "0");
        const endformattedHour = endhour.toString().padStart(2, "0");
        const endformattedMinute = endminute.padStart(2, "0");

        const timeString = `${formattedHour}:${formattedMinute}:00`;
        const endtimeString = `${endformattedHour}:${endformattedMinute}:00`;

        const requestData = {
            teacher: { user_id: teacherId },
            date_schedule: getDate.toLocaleDateString("en-CA"),
            start_time: timeString,
            end_time: endtimeString,
            subject: {
                subject_id: subjectId
            },
            room: getRoom,
            status: getApproval
        };

        if (userRole !== 1) {
            requestData.date_approved = getFormattedLocalDateTime();
            requestData.date_requested = getFormattedLocalDateTime();
            requestData.approver = { user_id: getJWTUid() };
        } else {
            requestData.date_requested = getFormattedLocalDateTime();
        }

        axios.post("http://localhost:8080/request/addrequest", requestData, {
            headers: { "Authorization": `Bearer ${jwtToken}` }
        })
        .then(response => {
            console.log(response)
            setIncrementFlag(incrementFlag + 1);
        })
        .catch(error => {
            console.log(error)
        })
        //setRows(updatedRows);

        setOpenModal(false);
        setOpenConfirmModal(false);
        setOpenSuccessModal(true);
    };

    const handleAllItems = () => {
        navigate('/inventory');
    };

    const handleDamages = () => {
        navigate('/reports/damages');
    };
    const handleResolved = () => {
        navigate('/reports/resolved');
    };
    const handleRequest = () => navigate('/schedules/request');
    const handleToday = () => navigate('/schedules/today');
    const handleUpcomingSched = () => navigate('/schedules/upcoming');
    const handleExport = () => navigate('/inventory/export');
    const handleCategoryPage = () => navigate('/inventory/categories');
    const handleIncidents = () => navigate('/reports/incidents');
    const handleStatus = () => navigate('/reports/status');
    const handleResupply = () => navigate('/reports/resupply');
    const handleBorrow = () => navigate('/reports/borrow');
    const handleResupplyHistory = () => navigate('/history/ResupplyHistory');
    const handleReturnHistory = () => navigate('/history/ReturnHistory');
    const handleHistory = () => navigate('/history/list');
    const handlePreparingItem = () => navigate('/history/PreparingItem');
    const handleBorrowCart = () => navigate('/borrowcart');

    const isActive = (path) => location.pathname === path;

    const getFormattedLocalDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    return (
        <aside className="sidebar-container">
            <h2 className="sidebar-title">
                <Link to={"/dashboard"}>
                    <Button>
                        <img src={"/ybb.gif"} alt="Logo" style={{ width: '25px', height: '100%', marginBottom: '3px', marginLeft: '16px' }} />
                        <h1 style={{ color: "#F2EE9D", fontFamily: "Poppins" }}>{label.toUpperCase()}</h1>
                    </Button>
                </Link>
            </h2>
            <div className="sidebar-buttons">
                {page === 'schedules' && (
                    <>
                        {/*<button className={`sidebar-button ${isActive('/schedules/request') ? 'active' : ''}`} onClick={handleRequest} style={{ display: 'block' }}>Requests</button>*/}
                        <button className={`sidebar-button ${isActive('/schedules/today') ? 'active' : ''}`} onClick={handleToday} style={{ display: 'block' }}>Today</button>
                        <button className={`sidebar-button ${isActive('/schedules/upcoming') ? 'active' : ''}`} onClick={handleUpcomingSched} style={{ display: 'block' }}>Schedules</button>
                    </>
                )}
                {page === 'inventory' && (
                    <>
                        <button className={`sidebar-button ${isActive('/inventory') ? 'active' : ''}`}
                            onClick={handleAllItems} style={{display: 'block'}}>All Items
                        </button>
                            <button className={`sidebar-button ${isActive('/inventory/categories') ? 'active' : ''}`} onClick={handleCategoryPage} style={{ display: 'block' }}>Categories</button>
                        {userRole === 1 && (
                            <button className={`sidebar-button ${isActive('/borrowcart') ? 'active' : ''}`} onClick={handleBorrowCart} style={{ display: 'block' }}>Borrow Cart</button>
                        )}
                        <button className={`sidebar-button ${isActive('/history/PreparingItem') ? 'active' : ''}`} onClick={handlePreparingItem} style={{ display: 'block' }}>Preparing Item</button>
                    </>
                )}
                {page === 'reports' && (
                    <>
                        <button className={`sidebar-button ${isActive('/reports/incidents') ? 'active' : ''}`} onClick={handleIncidents} style={{ display: 'block' }}>Incidents</button>
                        <button className={`sidebar-button ${isActive('/reports/status') ? 'active' : ''}`} onClick={handleStatus} style={{ display: 'block' }}>Status</button>
                        <button className={`sidebar-button ${isActive('/reports/resupply') ? 'active' : ''}`} onClick={handleResupply} style={{ display: 'block' }}>Resupply</button>
                        <button className={`sidebar-button ${isActive('/reports/borrow') ? 'active' : ''}`} onClick={handleBorrow} style={{ display: 'block' }}>Borrow</button>

                    </>
                )}
                {page === 'history' && (
                    <>
                        <button className={`sidebar-button ${isActive('/history/list') ? 'active' : ''}`} onClick={handleHistory} style={{ display: 'block' }}>Borrowings</button>
                        {userRole !== 1 && (
                            <button className={`sidebar-button ${isActive('/history/ResupplyHistory') ? 'active' : ''}`} onClick={handleResupplyHistory} style={{ display: 'block' }}>Resupplies</button>
                        )}
                        <button className={`sidebar-button ${isActive('/history/ReturnHistory') ? 'active' : ''}`} onClick={handleReturnHistory} style={{ display: 'block' }}>Returns</button>

                    </>
                )}
            </div>
        </aside>
    );
}