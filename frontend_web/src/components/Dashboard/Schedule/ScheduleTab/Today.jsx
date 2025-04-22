import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/Sidebar.jsx';
import Appbar from '../../../Appbar/Appbar';
import { Modal, Box, TextField, Typography, Button, Select, MenuItem } from '@mui/material';
import {getJWTSub, getJWTFullName, getJWTUid} from "../../../Authentication/jwt.jsx";
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
import { format, parseISO, parse } from 'date-fns';

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
    // { field: 'request_id', headerName: 'ID' },
    // { field: 'teacher_fullname', headerName: 'Teacher' },
    // { field: 'date_schedule', headerName: 'Date' },
    // { field: 'start_time', headerName: 'Time' },
    // { field: 'yearSection', headerName: 'Year & Section' },
    // { field: 'subject_name', headerName: 'Subject' },
    // { field: 'room', headerName: 'Room' },
    // { field: 'status', headerName: 'Class Status' },
    // { field: 'date_approved', headerName: 'Date Approved' },
    // { field: 'date_requested', headerName: 'Date Created' },
    // { field: 'approver_lastname', headerName: 'Approved By' },
    { field: 'request_id', headerName: 'ID' },
    { field: 'start_time', headerName: 'Start time' },
    { field: 'end_time', headerName: 'End time' },
    { field: 'lab_num', headerName: 'Room' },
    { field: 'teacher_id', headerName: 'teacher ID' },
    { field: 'date', headerName: 'Date' },
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

export default function Today() {
    const [rows, setRows] = useState([{

        // approver_lastname: request.approver?.last_name || '',
        // date_approved: request.date_approved || '',
        // date_requested: request.date_requested || '',
        // date_schedule: request.date_schedule || '',
        end_time: '',
        // remarks: request.remarks || '',
        // request_id: request.request_id || 0,
        request_id: 0,
        // room: request.room || '',
        lab_num: '',
        start_time: '',
        // status: request.status || '',
        // subject_name: request.subject?.subject_name || '',
        // subject_id: request.subject?.subject_id || 0,
        // teacher_firstname: request.teacher?.first_name || '',
        // teacher_lastname: request.teacher?.last_name || '',
        // teacher_fullname: `${request.teacher?.first_name || ''} ${request.teacher?.last_name || ''}`.trim(),
        // teacher_id: request.teacher?.user_id || 0,
        teacher_id: 0,
        date: '',
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
    const colorPalette = ['lightblue', 'lightgreen', 'lightcoral', 'yellow', 'lightpink'];

    const handleSearch = (event) => {
        setSearchText(event.target.value);
    };

    const handleEditClick = (clicked) => {
        console.log('this is clicked: ' + typeof clicked)
        const row = filteredRows.find((row) => row.request_id === clicked.request_id)
        console.log('ROOOOOM' + row.lab_num)
        axios.get("http://localhost:8080/user/getallusersbyroleid?roleId=1", {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                const updatedTeachers = response.data.map(teacher => ({
                    ...teacher,
                    fullname: `${teacher.first_name} ${teacher.last_name}`, // Concatenate with space
                    teacher_id: teacher.user_id
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
        setDate(new Date(row.date));
        setRequestId(row.request_id);
        setDateUnchanged(new Date(row.date));
        //setSubjectId(row.subject_id);
        //console.log(row.teacher_firstname + " " + row.teacher_lastname);

        //if (row.time && row.time.includes(' - ')) {
        if (row.start_time) {
            //const [start, end] = row.time.split(' - ');
            const [getStartHour, getStartMinute] = row.start_time.split(':');
            const [getEndHour, getEndMinute] = row.end_time.split(':');
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

        //setYearSection(row.yearSection || '');
        //setSubject(row.subject_name || '');
        setRoom(row.lab_num || '');
        //setApproval(row.approval || '');
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

        console.log(format(getDate, 'yyyy-MM-dd'))
        axios.put(`http://localhost:8080/teacherschedule/update?teacherScheduleId=${requestId}`, {
            date: format(getDate, 'yyyy-MM-dd'),
            start_time: timeString,
            end_time: endtimeString,
            lab_num: getRoom,
            // status: getApproval
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
        .filter((row) => {
            //const scheduleDate = row.date;
            const today = new Date();
            // console.log("gud bye " + row.date + ' + ' + format(today, 'yyyy-MM-dd'))
            // console.log('rowdate to date' + new Date(row.date))
            return row.date === format(today, 'yyyy-MM-dd');
        })
        .filter(
            (row) =>
                // row.teacher_lastname.toLowerCase().includes(searchText.toLowerCase()) ||
                row.date.toLowerCase().includes(searchText.toLowerCase()) ||
                row.start_time.toLowerCase().includes(searchText.toLowerCase()) ||
                row.end_time.toLowerCase().includes(searchText.toLowerCase()) ||
                row.lab_num.toLowerCase().includes(searchText.toLowerCase()) ||
                String(row.teacher_id).toLowerCase().includes(searchText.toLowerCase())
            // ||
            // row.subject_name.toLowerCase().includes(searchText.toLowerCase())
        );

    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const calendarEvents = filteredRows.map((row) => {
        // Combine the date and start/end time
        const startTime = parse(`${row.date} ${row.start_time}`, 'yyyy-MM-dd hh:mm a', new Date());
        const endTime = parse(`${row.date} ${row.end_time}`, 'yyyy-MM-dd hh:mm a', new Date());

        return {
            id: row.request_id,
            title: `${row.request_id}`, // You can change this to something more descriptive
            start: startTime,
            end: endTime,
            request_id: row.request_id,
            // If you need the full row data attached to the event, you can use 'resource' or another field
            // resource: row,
        };
    });

    // [{
    //     id: 15,
    //     title: "Point in Time Event",
    //     start: new Date(),
    //     end: new Date()
    //   }]

    const toggleView = () => {
        console.log(Array.isArray(calendarEvents))
        setView((prevView) => (prevView === 'table' ? 'calendar' : 'table'));
    };

    useEffect(() => {
        // const karun = new Date();
        // console.log(format(karun, 'yyyy-MM-dd'))
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/teacherschedule/getAllTeacherSchedules`, {
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                });

                console.log(response.data)
                const formattedData = response.data.map(request => ({
                    // approver_lastname: request.approver?.last_name || '',
                    // date_approved: request.date_approved || '',
                    // date_requested: request.date_requested || '',
                    // date_schedule: request.date_schedule || '',
                    end_time: request.end_time ? convertTo12HourFormat(request.end_time) : '',
                    // remarks: request.remarks || '',
                    // request_id: request.request_id || 0,
                    request_id: request.teacher_schedule_id || 0,
                    // room: request.room || '',
                    lab_num: request.lab_num,
                    start_time: request.start_time ? convertTo12HourFormat(request.start_time) : '',
                    // status: request.status || '',
                    // subject_name: request.subject?.subject_name || '',
                    // subject_id: request.subject?.subject_id || 0,
                    // teacher_firstname: request.teacher?.first_name || '',
                    // teacher_lastname: request.teacher?.last_name || '',
                    // teacher_fullname: `${request.teacher?.first_name || ''} ${request.teacher?.last_name || ''}`.trim(),
                    // teacher_id: request.teacher?.user_id || 0,
                    teacher_id: request.teacher_id,
                    date: request.date ? format(parseISO(request.date), 'yyyy-MM-dd') : ''
                }));

                const currentUserFullName = getJWTFullName();

                const filteredData = userRole === 1
                    ? formattedData.filter(request => request.teacher_id === getJWTUid)
                    : formattedData;
                // : userRole === 3
                //     ? formattedData
                //     : formattedData.filter(request => request.teacher_id === 1);
                setRows(filteredData);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [incrementFlag]);
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


                    {view === 'table' ? (
                        <MyPaper>
                            <CustomTable
                                columns={columns}
                                data={displayedRows}
                                onRowClick={handleEditClick}
                            />
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
                                // const isHighlighted = event.title.toLowerCase().includes(searchText.toLowerCase());
                                const colorIndex = event.request_id % colorPalette.length;  // Modulo to cycle through colors
                                const bgColor = colorPalette[colorIndex];  // Get color based on request_id

                                return {
                                    style: {
                                        // backgroundColor: isHighlighted ? 'maroon' : '#d3d3d3',
                                        backgroundColor: bgColor,
                                        color: 'black',
                                        borderRadius: '5px',
                                        border: '1px solid white',
                                    },
                                };
                            }}
                            onSelectEvent={(event) => handleEditClick(event)}
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
                                        readOnly={userRole === 1}
                                        disabled={userRole === 1}
                                        sx={{
                                            '& .MuiInputBase-root': {
                                                backgroundColor: userRole === 1 ? '#f0f0f0' : '#FFFFFF',
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
                                        readOnly={userRole === 1}
                                        disabled={userRole === 1}
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: userRole === 1 ? '#f0f0f0' : '#FFFFFF' } }}
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
                                        readOnly={userRole === 1}
                                        disabled={userRole === 1}
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: userRole === 1 ? '#f0f0f0' : '#FFFFFF' } }}
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
                                        readOnly={userRole === 1}
                                        disabled={userRole === 1}
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: userRole === 1 ? '#f0f0f0' : '#FFFFFF' } }}
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
                                        readOnly={userRole === 1}
                                        disabled={userRole === 1}
                                        sx={{ '& .MuiInputBase-root': { backgroundColor: userRole === 1 ? '#f0f0f0' : '#FFFFFF' } }}
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
                                    fullWidth
                                    readOnly={userRole === 1}
                                    disabled={userRole === 1}

                                    InputProps={{
                                        style: {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f0f0f0',
                                        },
                                    }}
                                />
                                <Select
                                    labelId="class-status-label"
                                    id="class-status-select"
                                    value={getApproval}
                                    onChange={(e) => setApproval(e.target.value)}
                                    fullWidth
                                    displayEmpty
                                    readOnly={userRole === 1}
                                    disabled={userRole === 1}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: userRole === 1 ? '#f0f0f0' : '#FFFFFF',
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Class Status
                                    </MenuItem>
                                    <MenuItem value="Upcoming">Upcoming</MenuItem>
                                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                                    <MenuItem value="Finished">Finished</MenuItem>
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
                            }}>
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