import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/Sidebar.jsx';
import Appbar from '../../../Appbar/Appbar';
import { Modal, Box, TextField, Typography, Button, Select, MenuItem } from '@mui/material';
import {getJWTSub, getJWTFullName} from "../../../Authentication/jwt.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomTable from "../../../Table and Pagination/Table.jsx";
import CustomTablePagination from "../../../Table and Pagination/Pagination.jsx";
import MyPaper from "../../../MyPaper.jsx";
import axios from 'axios';
import { getJWTUid } from '../../../Authentication/jwt.jsx';
import CircularProgress from '@mui/material/CircularProgress';

// const generateRandomFutureDate = () => {
//     const today = new Date();
//     const randomDays = Math.floor(Math.random() * 365) + 1;
//     today.setDate(today.getDate() + randomDays);
//     return today.toLocaleDateString();
// };
//
// const initialRows = [
//     { id: 1, date: generateRandomFutureDate(), time: '9:00 AM', teacher: 'Mr. Smith', material: 'Microscope' },
//     { id: 2, date: generateRandomFutureDate(), time: '10:00 AM', teacher: 'Ms. Johnson', material: 'Beakers' },
//     { id: 3, date: generateRandomFutureDate(), time: '11:00 AM', teacher: 'Dr. Brown', material: 'Test Tubes' },
//     { id: 4, date: generateRandomFutureDate(), time: '1:00 PM', teacher: 'Prof. Davis', material: 'Bunsen Burner' },
//     { id: 5, date: generateRandomFutureDate(), time: '2:00 PM', teacher: 'Mrs. Taylor', material: 'Slides' },
// ];

const columns = [
    { field: 'request_id', headerName: 'ID' },
    { field: 'teacher_fullname', headerName: 'Teacher'},
    { field: 'date_schedule', headerName: 'Date' },
    { field: 'start_time', headerName: 'Time' },
    //{ field: 'yearSection', headerName: 'Year & Section' },
    { field: 'subject_name', headerName: 'Subject' },
    { field: 'room', headerName: 'Room' },
    { field: 'status',headerName: 'Approval Status'},
];

const handleStatusChange = (event, id) => {
    const newStatus = event.target.value;
    setRows((prevRows) =>
        prevRows.map((row) =>
            row.id === id ? { ...row, status: newStatus } : row
        )
    );
};

const theme = createTheme({
    palette: {
        primary: { main: '#016565' },
        secondary: { main: '#000000' },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: '#016565',
                    color: '#FFFFFF',
                },
                body: {
                    fontSize: 14,
                },
            },
        },
    },
});

const localizer = momentLocalizer(moment);

export default function Request() {
    const [rows, setRows] = useState([{
        approver_lastname: "",
        date_approved: "",
        date_requested: "",
        date_schedule: "",
        end_time:"",
        remarks: "",
        request_id: 0,
        room: "",
        start_time: "",
        status:"",
        subject_name:"",
        subject_id:"",
        taecher_firstname:"",
        teacher_lastname: "",
        teacher_fullname: "",
        teacher_id: 0
    }]);
    const userRole = parseInt(localStorage.getItem("userRole"));
    const [searchText, setSearchText] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    //for editing data of request
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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [view, setView] = useState('table'); // State to manage the current view
    const jwtToken = localStorage.getItem("jwtToken");
    const [teachers, setTeachers] = useState([{
        user_id: 0,
        fullname: '',
    }]);
    const [subjects, setSubjects] = useState([{}]);
    const [requestId, setRequestId] = useState(0);
    const [getTeacherId, setTeacherId] = useState(0);
    const [dateUnchanged, setDateUnchanged] = useState();
    const [subjectId, setSubjectId] = useState(0);
    const [incrementFlag, setIncrementFlag] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [scheduleErrorMsg, setScheduleErrorMsg] = useState('');

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const handleEditClick = (row) => {
        axios.get("http://localhost:8080/user/getallusersbyroleid?roleId=1", {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            const updatedTeachers = response.data.map(teacher => ({
                ...teacher,
                fullname: `${teacher.first_name} ${teacher.last_name}` // Concatenate with space
            }));

            setTeachers(updatedTeachers);
        })
        .catch(error => {
            console.log(error);
        })

        axios.get("http://localhost:8080/subject/getallsubject", {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            setSubjects(response.data);
        })
        .catch(error => {
            console.log(error);
        })
        console.log(row.teacher_lastname);
        setSelectedRow(row);

        setTeacherId(row.teacher_id);
        setDate(new Date(row.date_schedule));
        setRequestId(row.request_id);
        setDateUnchanged(row.date_schedule);
        setSubjectId(row.subject_id);
        console.log(row.teacher_firstname + " " + row.teacher_lastname);

        //if (row.time && row.time.includes(' - ')) {
        if (row.start_time) {
            //const [start, end] = row.time.split(' - ');
            const [getStartHour, getStartMinute] = row.start_time.split(':');
            const [getEndHour, getEndMinute] = row.start_time.split(':');
            setStartHour(getStartHour);
            setStartMinute(getStartMinute);
            setEndHour(getEndHour);
            setEndMinute(getEndMinute);
        } else {
            setStartHour('');
            setStartMinute('');
            setEndHour('');
            setEndMinute('');
        }

        setYearSection(row.yearSection || '');
        setSubject(row.subject_name || '');
        setRoom(row.room || '');
        setApproval(row.approval || '');
        setOpenModal(true);
    };

    const handleSave = () => {
        setOpenConfirmModal(true);
    };

    const handleConfirmSave = () => {
        // const updatedRows = rows.map((row) =>
        //     row === selectedRow
        //         ? {
        //             ...row,
        //             teacher: getTeacher,
        //             date: getDate.toLocaleDateString(),
        //             time: `${getStartHour}:${getStartMinute < 10 ? `0${getStartMinute}` : getStartMinute} - ${getEndHour}:${getEndMinute < 10 ? `0${getEndMinute}` : getEndMinute}`,
        //             yearSection: getYearSection,
        //             subject: getSubject,
        //             room: getRoom,
        //             approval: getApproval,
        //         }
        //         : row
        // );

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

        const formattedHour = hour.toString().padStart(2, "0"); // Ensure two-digit hour
        const formattedMinute = minute.padStart(2, "0");

        const endformattedHour = endhour.toString().padStart(2, "0"); // Ensure two-digit hour
        const endformattedMinute = endminute.padStart(2, "0");

        const timeString = `${formattedHour}:${formattedMinute}:00`;
        const endtimeString = `${endformattedHour}:${endformattedMinute}:00`;

         axios.put(`http://localhost:8080/request/updaterequest?reqId=${requestId}`, {
            teacher:{
                user_id: getTeacherId
            },
            date_schedule: getDate.toLocaleDateString("en-CA"),
            start_time: timeString,
            end_time: endtimeString,
            subject: {
                 subject_id: subjectId
            },
            room: getRoom,
            status: getApproval
        }, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        .then(response => {
            console.log(response)
            setIncrementFlag(incrementFlag + 1);
        })
        .catch(error => {
            console.log(error)
        })
        console.log(subjectId);
        //setRows(updatedRows);
        setOpenModal(false);
        setOpenConfirmModal(false);
        setOpenSuccessModal(true);
    };
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    const filteredRows = rows
        .filter((row) => new Date(row.date_schedule) > new Date()) //Only accepts future dates and not current and past
        .filter(
            (row) =>
                row.teacher_lastname.toLowerCase().includes(searchText.toLowerCase()) ||
                //row.material.toLowerCase().includes(searchText.toLowerCase()) ||
                row.date_schedule.toLowerCase().includes(searchText.toLowerCase()) ||
                row.start_time.toLowerCase().includes(searchText.toLowerCase()) ||
                row.subject_name.toLowerCase().includes(searchText.toLowerCase())
        );

    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const calendarEvents = filteredRows.map((row) => ({
        title: `${row.teacher} (${row.material})`,
        start: moment(`${row.date} ${row.time}`, 'M/D/YYYY h:mm A').toDate(),
        end: moment(`${row.date} ${row.time}`, 'M/D/YYYY h:mm A').add(1, 'hour').toDate(),
        resource: row,
    }));

    const toggleView = () => {
        setView((prevView) => (prevView === 'table' ? 'calendar' : 'table'));
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (userRole === 3) {
                    const response = await axios.get(`http://localhost:8080/request/getrequests`, {
                        headers: {
                            "Authorization": `Bearer ${jwtToken}`
                        }
                    });
                    formatData(response.data);
                }else{
                    const uid = getJWTUid();
                    const response = await axios.get(`http://localhost:8080/request/teacher/${uid}`,{
                        headers:{
                            "Authorization": `Bearer ${jwtToken}`
                        }
                    });
                    formatData(response.data);
                }
            } catch (error) {
                console.log(error);
                if (!error.response) {
                    setScheduleErrorMsg("We’re having trouble connecting. Please check your internet and try again.");
                } else if (error.response.status === 401) {
                    setScheduleErrorMsg("Your session has expired. Please log in again.");
                } else if (error.response.status === 404) {
                    if(userRole === 3){
                        setScheduleErrorMsg("No schedules found at the moment. Please check back later.");
                    }else{
                        setScheduleErrorMsg("You don't have any pending schedules requests.");
                    }
                } else {
                    setScheduleErrorMsg("Oops! Something went wrong on our end. Please try again later.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        const formatData = (data) => {
            const formattedData = data.map(request => ({
                approver_lastname: request.approver?.last_name || '',
                date_approved: request.date_approved || '',
                date_requested: request.date_requested || '',
                date_schedule: request.date_schedule || '',
                end_time: request.end_time ? convertTo12HourFormat(request.end_time) : '',
                remarks: request.remarks || '',
                request_id: request.request_id || 0,
                room: request.room || '',
                start_time: request.start_time ? convertTo12HourFormat(request.start_time) : '',
                status: request.status || '',
                subject_name: request.subject?.subject_name || '',
                subject_id: request.subject?.subject_id || 0,
                teacher_firstname: request.teacher?.first_name || '',
                teacher_lastname: request.teacher?.last_name || '',
                teacher_fullname: `${request.teacher?.first_name || ''} ${request.teacher?.last_name || ''}`.trim(),
                teacher_id: request.teacher?.user_id || 0,
            }));
            setRows(formattedData);
        }

        fetchData();
    }, [incrementFlag, userRole, jwtToken]);

    const convertTo12HourFormat = (time24) => {
        const [hours, minutes, seconds] = time24.split(':');
        let hour = parseInt(hours, 10);
        const suffix = hour >= 12 ? 'PM' : 'AM';

        if(hour > 12){
            hour -= 12;
        }else if(hour === 0){
            hour = 12;
        }

        return `${hour}:${minutes} ${suffix}`
    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                <Appbar page="schedules" />
                {/* Continue */}
                <Sidebar page={"schedules"} />
                <div style={{ padding: '20px', flexGrow: 1 }}>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                        marginTop: '100px'
                    }}>

                        <TextField
                            label="Search..."
                            variant="outlined"
                            value={searchText}
                            onChange={handleSearch}
                            sx={{flex: 1}}
                        />
                        <Button onClick={toggleView} sx={{marginLeft: '20px'}}>
                            {view === 'table' ? 'Switch to Calendar View' : 'Switch to Table View'}
                        </Button>
                    </Box>
                    {isLoading ? (
                        <CircularProgress />
                    ) : view === 'table' ? (
                            <MyPaper>
                                <CustomTable
                                    columns={columns}
                                    data={displayedRows}
                                    onRowClick={handleEditClick}
                                />

                                {scheduleErrorMsg ? <p style={{ color: "grey", marginTop: 20 }}>{scheduleErrorMsg}</p> 
                                : filteredRows.length === 0 && <p style={{ color: "grey", marginTop: 20 }}>You don't have any pending schedules requests.</p>}

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <CustomTablePagination
                                        count={filteredRows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handlePageChange}
                                        onRowsPerPageChange={handleRowsPerPageChange}
                                    />
                                </Box>
                            </MyPaper>
                        ) : (
                            <Calendar
                                localizer={localizer}
                                events={calendarEvents}
                                startAccessor="start"
                                endAccessor="end"
                                style={{
                                    height: '70vh',
                                    width: '100%',
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                                eventPropGetter={(event) => {
                                    const isHighlighted = event.title.toLowerCase().includes(searchText.toLowerCase());
                                    return {
                                        style: {
                                            backgroundColor: isHighlighted ? 'maroon' : '#d3d3d3',
                                            color: isHighlighted ? 'white' : 'black',
                                            borderRadius: '5px',
                                            border: isHighlighted ? '1px solid white' : 'none',
                                        },
                                    };
                                }}
                                onSelectEvent={(event) => handleEditClick(event.resource)}
                            />
                    )}

                    <Modal open={openModal} onClose={() => setOpenModal(false)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 450,
                                bgcolor: '#FFFFFF',
                                borderRadius: '15px',
                                boxShadow: 24,
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: '#016565',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#FFFFFF',
                                        padding: '15px',
                                    }}
                                >
                                    Request Details
                                </Typography>
                                <Button
                                    onClick={() => setOpenModal(false)}
                                    sx={{
                                        color: '#FFFFFF',
                                        background: 'none',
                                        paddingLeft: '7px',
                                        minWidth: 'unset',
                                        '&:hover': {
                                            background: 'none',
                                        },
                                    }}
                                >
                                    ✕
                                </Button>
                            </Box>

                            <Box
                                sx={{
                                    padding: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    backgroundColor: '#f9f9f9',
                                }}
                            >
                                <TextField
                                    label="Teacher"
                                    value={selectedRow ? selectedRow.teacher_fullname : ''}
                                    InputProps={{
                                        readOnly: true,
                                        disabled: true,
                                        style: {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date"
                                        value={getDate}
                                        onChange={(newValue) => setDate(newValue)}
                                        readOnly
                                        disabled
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                backgroundColor: '#f0f0f0',
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Select
                                        labelId="start-hour-label"
                                        id="start-hour-select"
                                        value={getStartHour}
                                        onChange={(e) => setStartHour(e.target.value)}
                                        displayEmpty
                                        readOnly
                                        disabled
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                    >
                                        <MenuItem value="" disabled>00</MenuItem>
                                        {[...Array(12).keys()].map((hour) => (
                                            <MenuItem key={hour + 1} value={hour + 1}>{hour + 1}</MenuItem>
                                        ))}
                                    </Select>
                                    <Typography>:</Typography>
                                    <Select
                                        labelId="start-minute-label"
                                        id="start-minute-select"
                                        value={getStartMinute}
                                        onChange={(e) => setStartMinute(e.target.value)}
                                        displayEmpty
                                        readOnly
                                        disabled
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                    >
                                        <MenuItem value="" disabled>00 PM</MenuItem>
                                        {["00 AM", "15 AM", "30 AM", "45 AM", "00 PM", "15 PM", "30 PM", "45 PM"].map((minute) => (
                                            <MenuItem key={minute} value={minute}>{minute < 10 ? `0${minute}` : minute}</MenuItem>
                                        ))}
                                    </Select>
                                    <Typography>-</Typography>
                                    <Select
                                        labelId="end-hour-label"
                                        id="end-hour-select"
                                        value={getEndHour}
                                        onChange={(e) => setEndHour(e.target.value)}
                                        displayEmpty
                                        readOnly
                                        disabled
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                    >
                                        <MenuItem value="" disabled>00</MenuItem>
                                        {[...Array(12).keys()].map((hour) => (
                                            <MenuItem key={hour + 1} value={hour + 1}>{hour + 1}</MenuItem>
                                        ))}
                                    </Select>
                                    <Typography>:</Typography>
                                    <Select
                                        labelId="end-minute-label"
                                        id="end-minute-select"
                                        value={getEndMinute}
                                        onChange={(e) => setEndMinute(e.target.value)}
                                        displayEmpty
                                        readOnly
                                        disabled
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                    >
                                        <MenuItem value="" disabled>00 PM</MenuItem>
                                        {["00 AM", "15 AM", "30 AM", "45 AM", "00 PM", "15 PM", "30 PM", "45 PM"].map((minute) => (
                                            <MenuItem key={minute} value={minute}>{minute < 10 ? `0${minute}` : minute}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                                <Select
                                    labelId="subject-label"
                                    id="subject-select"
                                    value={getSubject}
                                    aria-placeholder={"Subject"}
                                    onChange={(e) => setSubject(e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    readOnly
                                    disabled
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200,
                                                overflow: 'auto',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Subject
                                    </MenuItem>
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject.subject_id} value={subject.subject_name} onClick={() => setSubjectId(subject.subject_id)}>
                                            {subject.subject_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    value={getRoom}
                                    onChange={(e) => setRoom(e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    readOnly
                                    disabled
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Room
                                    </MenuItem>
                                    <MenuItem value="Laboratory 1">Laboratory 1</MenuItem>
                                    <MenuItem value="Laboratory 2">Laboratory 2</MenuItem>
                                    <MenuItem value="Classroom">Classroom</MenuItem>
                                </Select>
                                <TextField
                                    label="Remarks"
                                    value={getRemarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    fullWidth
                                    InputProps={{
                                        readOnly: userRole !== 3,
                                        disabled: userRole !== 3,
                                        style: {
                                            backgroundColor: userRole !== 3 ? '#f0f0f0' : '#FFFFFF',
                                        },
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: userRole !== 3 ? '#f0f0f0' : '#FFFFFF',
                                        },
                                    }}
                                />
                                <Select
                                    labelId="approval-label"
                                    id="approval-select"
                                    value={getApproval}
                                    onChange={(e) => setApproval(e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    readOnly={userRole !== 3}
                                    disabled={userRole !== 3}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: userRole !== 3 ? '#f0f0f0' : '#FFFFFF',
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Approval status
                                    </MenuItem>
                                    <MenuItem value="Approved">Approved</MenuItem>
                                    <MenuItem value="Denied">Denied</MenuItem>
                                    <MenuItem value="Advised to reschedule">Advised to reschedule</MenuItem>
                                </Select>
                            </Box>

                            <Box
                                sx={{
                                    padding: '16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    borderTop: '1px solid #e0e0e0',
                                    backgroundColor: '#FFFFFF',
                                }}
                            >
                                <Button
                                    onClick={() => setOpenModal(false)}
                                    variant="outlined"
                                    sx={{
                                        color: '#333',
                                        borderColor: '#333',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: 'maroon',
                                        color: '#FFFFFF',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        '&:hover': {
                                            backgroundColor: '#014d4d',
                                        },
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Modal>                    <Modal open={openConfirmModal} onClose={() => setOpenConfirmModal(false)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 300,
                                bgcolor: 'white',
                                borderRadius: '15px',
                                boxShadow: 24,
                                padding: '20px',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6">Are you sure you want to Submit?</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                                <Button onClick={() => setOpenConfirmModal(false)}>No</Button>
                                <Button onClick={handleConfirmSave} variant="contained" color="primary">
                                    Yes
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    <Modal open={openSuccessModal} onClose={() => setOpenSuccessModal(false)}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 300,
                                bgcolor: 'white',
                                borderRadius: '15px',
                                boxShadow: 24,
                                padding: '20px',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" sx={{ color: 'green' }}>
                                Save Successfully!
                            </Typography>
                            <Button
                                onClick={() => setOpenSuccessModal(false)}
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: '20px' }}
                            >
                                OK
                            </Button>
                        </Box>
                    </Modal>
                </div>
            </div>
        </ThemeProvider>
    );
}