import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/Sidebar.jsx';
import Appbar from '../../../Appbar/Appbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Button, Modal, Typography, Box, InputAdornment, Select, MenuItem} from "@mui/material";
import TextField from "@mui/material/TextField";
import SearchIcon from '@mui/icons-material/Search';
import {getJWTFullName, getJWTUid} from "../../../Authentication/jwt.jsx";
import axios from "axios";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker} from "@mui/x-date-pickers";
import CircularProgress from "@mui/material/CircularProgress";
import MyPaper from "../../../MyPaper.jsx";
import { FormControl, InputLabel } from "@mui/material"
import CustomTable from "../../../Table and Pagination/Table.jsx";
import CustomTablePagination from "../../../Table and Pagination/Pagination.jsx";
import { format, parseISO, parse } from 'date-fns';


// const columns = [
//     { id: 'teacher', label: 'Teacher', minWidth: 100 },
//     { id: 'date', label: 'Date', minWidth: 100 },
//     { id: 'time', label: 'Time', minWidth: 100 },
//     { id: 'yearSection', label: 'Year & Section', minWidth: 100 },
//     { id: 'subject', label: 'Subject', minWidth: 100 },
//     { id: 'room', label: 'Room', minWidth: 100 },
//     { id: 'approval', label: 'Approval', minWidth: 100 },
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
    { field: 'schedule_id', headerName: 'ID' },
    { field: 'start_time', headerName: 'Start time' },
    { field: 'end_time', headerName: 'End time' },
    { field: 'lab_num', headerName: 'Room' },
    { field: 'teacher_id', headerName: 'teacher ID' },
    { field: 'date', headerName: 'Date' },
    {field:'yearSection', headerName:'Year & Section'},

];

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




// Helper functions for time slot validation
const getValidStartMinuteOptions = (hour, period) => {
    // For 7-11 AM hours, only allow 00 AM or 30 AM
    if ((hour >= 7 && hour <= 11) && period === "AM") {
        return ["00 AM", "30 AM"];
    }
    // For 12-4 PM hours, only allow 00 PM or 30 PM
    else if (((hour >= 1 && hour <= 4) || hour === 12) && period === "PM") {
        return ["00 PM", "30 PM"];
    }
    // Default options
    return ["00 AM", "15 AM", "30 AM", "45 AM", "00 PM", "15 PM", "30 PM", "45 PM"];
};

// Function to determine valid minute options based on hour and period
const getValidEndMinuteOptions = (hour, period) => {
    // Same validation rules for end time
    return getValidStartMinuteOptions(hour, period);
};

// Function to determine the period (AM/PM) based on the hour
const determinePeriod = (hour) => {
    // Ensure we're working with a number
    hour = parseInt(hour, 10);

    // School hours mapping (7-11 AM, 12-4 PM)
    if (hour >= 7 && hour <= 11) return "AM";
    if ((hour >= 1 && hour <= 4) || hour === 12) return "PM";

    // Default fallback for any other hours
    return hour < 12 ? "AM" : "PM";
};

export default function UpcomingSchedule() {
    const userRole = parseInt(localStorage.getItem("userRole"));
    const [rows, setRows] = useState([{

        // approver_lastname: request.approver?.last_name || '',
        // date_approved: request.date_approved || '',
        // date_requested: request.date_requested || '',
        // date_schedule: request.date_schedule || '',
        end_time: '',
        // remarks: request.remarks || '',
        // request_id: request.request_id || 0,
        schedule_id: 0,
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
        yearSection: '',
    }]);

    const [openModal, setOpenModal] = useState(false);
    const [openCModal, setOpenCModal] = useState(false);
    const [data, setData] = useState([]);
    // const [teachers, setTeachers] = useState([]);
    //const jwtToken = localStorage.getItem("jwtToken");
    const [getDate, setDate] = useState(null);
    const [getStartHour, setStartHour] = useState('');
    const [getStartMinute, setStartMinute] = useState('');
    const [getEndHour, setEndHour] = useState('');
    const [getEndMinute, setEndMinute] = useState('');
    const [startPeriod, setStartPeriod] = useState('AM');
    const [endPeriod, setEndPeriod] = useState('AM');
    const [timeValidationError, setTimeValidationError] = useState('');
    const [getSubject, setSubject] = useState('');
    const [getRoom, setRoom] = useState(null);
    const [subjects, setSubjects] = useState([{}]);
    const [subjectId, setSubjectId] = useState(0);
    const [getYearSection, setYearSection] = useState('');
    const [teacherId, setTeacherId] = useState(0);
    const jwtToken = localStorage.getItem("jwtToken");
    const [teachers, setTeachers] = useState([{
        user_id: 0,
        fullname: '',
    }]);
    const [view, setView] = useState('calendar'); // State to manage the current view
    const [incrementFlag, setIncrementFlag] = useState(0)
    const [isLoading, setIsLoading] = useState(false);
    const [scheduleErrorMsg, setScheduleErrorMsg] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [getApproval, setApproval] = useState('');
    const [searchText, setSearchText] = useState('');
    const colorPalette = ['lightblue', 'lightgreen', 'lightcoral', 'yellow', 'lightpink'];
    const [selectedRow, setSelectedRow] = useState(null);
    const [requestId, setRequestId] = useState(0);
    const [dateUnchanged, setDateUnchanged] = useState();
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalTitle, setModalTitle] = useState("Create New Schedule");
    const [yearSections, setYearSections] = useState([ ]);
    const [yearSectionId, setYearSectionId] = useState(null);
    // Current date view for the calendar
    const [calendarDate, setCalendarDate] = useState(new Date());

    // const generateSchoolYearOptions = () => {
    //     const currentYear = new Date().getFullYear();
    //     const years = [];
    //     // Generate options for past 2 years and next year
    //     for (let i = -2; i <= 1; i++) {
    //         const startYear = (currentYear + i).toString().slice(-2);
    //         const endYear = (currentYear + i + 1).toString().slice(-2);
    //         years.push(`${startYear}${endYear}`);
    //     }
    //     return years;
    // };
    // const [selectedSchoolYear, setSelectedSchoolYear] = useState(generateSchoolYearOptions()[2]);

    const generateSchoolYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        // Generate options for past 2 years, current, and next year
        for (let i = -2; i <= 1; i++) {
            const startYear = currentYear + i;
            const endYear = currentYear + i + 1;
            years.push(`${startYear}-${endYear}`);
        }
        // Recent years first
        return years.reverse();
    };
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(generateSchoolYearOptions()[0]);

    // Helper function to extract start and end year from school year string
    const getYearsFromSchoolYear = (schoolYearString) => {
        const [startYear, endYear] = schoolYearString.split('-').map(year => parseInt(year.trim(), 10));
        return { startYear, endYear };
    };

    // Function to update calendar view based on selected school year
    const updateCalendarViewForSchoolYear = (schoolYearString) => {
        // Get the current calendar view to preserve month and day
        const currentMonth = calendarDate.getMonth();
        const currentDay = calendarDate.getDate();

        // Extract the end year from the school year string (e.g., get 2025 from "2024-2025")
        const { endYear } = getYearsFromSchoolYear(schoolYearString);

        // Create a new date with the end year but same month and day
        const newDate = new Date(calendarDate);
        newDate.setFullYear(endYear);

        // Update the calendar view date
        setCalendarDate(newDate);
        console.log(`Calendar view updated to ${newDate.toDateString()} based on school year ${schoolYearString}`);
    };

    // const fetchYearSections = () => {
    //     axios.get("https://it342-lemsliteteachers.onrender.com/yearsection/getall", {
    //         headers: {
    //             "Authorization": `Bearer ${jwtToken}`
    //         }
    //     })
    //         .then(response => {
    //             setYearSections(response.data);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //         });
    // };

    // Enhanced fetchYearSections function with more detailed logging
    const fetchYearSections = () => {
        console.log("Fetching year sections...");
        setYearSections([]); // Clear previous data

        axios.get("https://it342-lemsliteteachers.onrender.com/yearsection/getall", {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
            .then(response => {
                console.log("Year sections data:", response.data);

                // Validate the structure of each year section
                const validYearSections = response.data.map(ys => {
                    console.log(`Year section: id=${ys.yrsec_id}, year=${ys.year}, section=${ys.section}, yearsect=${ys.yearsect}`);
                    return ys;
                });

                setYearSections(validYearSections);
            })
            .catch(error => {
                console.error("Error fetching year sections:", error);
            });
    };

    // Function to handle year section selection
    const handleYearSectionChange = (value) => {
        setYearSectionId(value);

        // Find the selected year section object by ID to get display text
        const selectedYearSection = yearSections.find(ys => ys.yrsec_id === value);

        if (selectedYearSection) {
            // Set the display text
            const displayText = selectedYearSection.yearsect ||
                `${selectedYearSection.year} - ${selectedYearSection.section}`;

            setYearSection(value);

            console.log("Selected year section ID:", value);
            console.log("Selected year section:", selectedYearSection);
        } else {
            setYearSection(null);
            console.log("Year section not found for ID:", value);
        }
    };
    // useEffect(() => {
    //     fetchYearSections();
    // }, []);


    // Handler for start hour changes that updates period and validates minutes
    const handleStartHourChange = (hour) => {
        setStartHour(hour);

        // Determine AM/PM period based on hour
        const newPeriod = determinePeriod(parseInt(hour, 10));
        setStartPeriod(newPeriod);

        // Reset minute if it's no longer valid for this hour/period
        if (getStartMinute) {
            const [_, currentPeriod] = getStartMinute.split(" ");
            if (currentPeriod !== newPeriod) {
                // Period changed, reset minute to valid value
                const validOptions = getValidStartMinuteOptions(parseInt(hour, 10), newPeriod);
                setStartMinute(validOptions[0]);
            } else {
                // Check if current minute is valid for new hour
                const minuteValue = getStartMinute.split(" ")[0];
                const validOptions = getValidStartMinuteOptions(parseInt(hour, 10), newPeriod);
                const isValid = validOptions.some(opt => opt === `${minuteValue} ${newPeriod}`);

                if (!isValid) {
                    setStartMinute(validOptions[0]);
                }
            }
        } else {
            // Set default minute for this hour
            const validOptions = getValidStartMinuteOptions(parseInt(hour, 10), newPeriod);
            setStartMinute(validOptions[0]);
        }

        setTimeValidationError(''); // Clear errors on change
    };

    // Handler for end hour changes
    const handleEndHourChange = (hour) => {
        setEndHour(hour);

        // Determine AM/PM period based on hour
        const newPeriod = determinePeriod(parseInt(hour, 10));
        setEndPeriod(newPeriod);

        // Reset minute if it's no longer valid for this hour/period
        if (getEndMinute) {
            const [_, currentPeriod] = getEndMinute.split(" ");
            if (currentPeriod !== newPeriod) {
                // Period changed, reset minute to valid value
                const validOptions = getValidEndMinuteOptions(parseInt(hour, 10), newPeriod);
                setEndMinute(validOptions[0]);
            } else {
                // Check if current minute is valid for new hour
                const minuteValue = getEndMinute.split(" ")[0];
                const validOptions = getValidEndMinuteOptions(parseInt(hour, 10), newPeriod);
                const isValid = validOptions.some(opt => opt === `${minuteValue} ${newPeriod}`);

                if (!isValid) {
                    setEndMinute(validOptions[0]);
                }
            }
        } else {
            // Set default minute for this hour
            const validOptions = getValidEndMinuteOptions(parseInt(hour, 10), newPeriod);
            setEndMinute(validOptions[0]);
        }

        setTimeValidationError(''); // Clear errors on change
    };

    const handleSelectSlot = ({ start, end }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if selected date is in the past
        if (start < today) {
            alert("Cannot schedule for past dates. Please select a future date.");
            return;
        }

        setDate(start);

        const startHour = start.getHours();
        const endHour = end.getHours();

        if (startHour >= 7 && startHour <= 17 && endHour >= 7 && endHour <= 17) {
            setDate(start);

            // Convert 24-hour format to 12-hour format for display
            let formattedStartHour, formattedEndHour;

            // For startHour
            if (startHour >= 13 && startHour <= 16) { // 1 PM - 4 PM
                formattedStartHour = startHour - 12;
                setStartPeriod("PM");
            } else if (startHour === 12) { // 12 PM
                formattedStartHour = 12;
                setStartPeriod("PM");
            } else { // 7 AM - 11 AM
                formattedStartHour = startHour;
                setStartPeriod("AM");
            }

            // For endHour
            if (endHour >= 13 && endHour <= 17) { // 1 PM - 5 PM
                formattedEndHour = endHour - 12;
                setEndPeriod("PM");
            } else if (endHour === 12) { // 12 PM
                formattedEndHour = 12;
                setEndPeriod("PM");
            } else { // 7 AM - 11 AM
                formattedEndHour = endHour;
                setEndPeriod("AM");
            }

            console.log("Calendar slot - 24h startHour:", startHour, "12h formattedStartHour:", formattedStartHour);
            console.log("Calendar slot - 24h endHour:", endHour, "12h formattedEndHour:", formattedEndHour);

            // Set hours first to trigger period updates
            setStartHour(formattedStartHour);
            setEndHour(formattedEndHour);

            // Then set minutes based on the selected time with correct period
            const startPeriodStr = startHour >= 12 ? "PM" : "AM";
            const endPeriodStr = endHour >= 12 ? "PM" : "AM";
            setStartMinute(`${start.getMinutes().toString().padStart(2, '0')} ${startPeriodStr}`);
            setEndMinute(`${end.getMinutes().toString().padStart(2, '0')} ${endPeriodStr}`);

            setOpenCModal(true);
        } else {
            alert("Please select a time between 7:00 AM and 5:00 PM.");
        }
    };

    const handleSelectEvent = (event) => {
        const startHour = event.start.getHours();
        const endHour = event.end.getHours();

        if (startHour >= 7 && startHour <= 17 && endHour >= 7 && endHour <= 17) {
            setDate(event.start);

            // Handle start time (convert 24h to 12h format)
            let formattedStartHour = formatHour(startHour);
            const startPeriodStr = startHour >= 12 ? "PM" : "AM";
            setStartHour(formattedStartHour);
            setStartPeriod(startPeriodStr);
            setStartMinute(`${event.start.getMinutes().toString().padStart(2, '0')} ${startPeriodStr}`);

            // Handle end time (convert 24h to 12h format)
            let formattedEndHour = formatHour(endHour);
            const endPeriodStr = endHour >= 12 ? "PM" : "AM";
            setEndHour(formattedEndHour);
            setEndPeriod(endPeriodStr);
            setEndMinute(`${event.end.getMinutes().toString().padStart(2, '0')} ${endPeriodStr}`);

            console.log("Selected event - Start hour 24h:", startHour, "12h:", formattedStartHour, "Period:", startPeriodStr);
            console.log("Selected event - End hour 24h:", endHour, "12h:", formattedEndHour, "Period:", endPeriodStr);

            setOpenCModal(true);
        } else {
            alert("Please select a time between 7:00 AM and 5:00 PM.");
        }
    };

    const formatHour = (hour) => {
        // First constraint to school hours (7 AM to 5 PM)
        if (hour < 7) return 7;
        if (hour > 17) return 17;

        // Convert from 24-hour to 12-hour format for display
        if (hour === 0) return 12; // Midnight (not likely in school hours)
        if (hour > 12) return hour - 12; // PM hours (1 PM - 5 PM)
        return hour; // AM hours (7 AM - 12 PM)
    };

    const formatMinute = (minute, hour) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        return `${minute < 10 ? `0${minute}` : minute} ${period}`;
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleOpenCreateModal = () => {
        const userRole = parseInt(localStorage.getItem("userRole"));
        if (userRole === 2 || userRole === 3) {
            // Reset form fields for create mode
            setIsEditMode(false);
            if (isEditMode===false) {
                setDate(null);
                setStartHour('');
                setStartMinute('');
                setEndHour('');
                setEndMinute('');
                setSubject('');
                setRoom('');
                setTeacherId(0);
                setYearSection('');
                setRequestId(0);

                setOpenCModal(true);
            }
            else{
                getDate;
                getStartHour;
                getStartMinute
                getEndHour;
                getEndMinute;

                fetchSubjects();
                fetchTeachers();
                getRoom;
                getYearSection



                setOpenCModal(true);

            }
            // setDate(null);
            // setStartHour('');
            // setStartMinute('');
            // setEndHour('');
            // setEndMinute('');
            // setSubject('');
            // setRoom('');
            // setTeacherId(0);
            // setYearSection('');
            // setRequestId(0);
            //
            // setOpenCModal(true);
        } else {
            alert("You do not have permission to create a schedule.");
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseCreateModal = () => {
        // Reset all form values
        setDate(null);
        setStartHour('');
        setStartMinute('');
        setEndHour('');
        setEndMinute('');
        setYearSection(null);
        setYearSectionId(null);
        setSubject('');
        setSubjectId(0);
        setRoom('');
        setTeacherId(0);
        setRequestId(0);
        setTimeValidationError('');

        // Close the modal
        setOpenCModal(false);
        setIsEditMode(false); // Reset edit mode when closing
    };

    const toggleView = () => {
        setView((prevView) => (prevView === 'calendar' ? 'table' : 'calendar'));
    };

    const handleEditClick = (clicked) => {

        const row = filteredRows.find((row) => row.schedule_id === clicked.schedule_id);
        if (!row) return;

        // Set edit mode
        setIsEditMode(true);
        setModalTitle("EditSchedule");


        setRequestId(row.schedule_id);

        // Set date (parse from string if needed)
        const scheduleDate = row.date ? new Date(row.date) : new Date();
        setDate(scheduleDate);
        setDateUnchanged(scheduleDate);

        fetchTeachers();
        fetchSubjects();

        // Fetch required data for dropdowns
        axios.get("https://it342-lemsliteteachers.onrender.com/user/getallusersbyroleid?roleId=1", {
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

        axios.get("https://it342-lemsliteteachers.onrender.com/subject/getallsubject", {
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

        // setTeacherId(row.teacher_id);
        setTeacherId(row.teacher ? row.teacher.user_id : 0);
        setDate(new Date(row.date));
        setRequestId(row.schedule_id);
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
        setOpenCModal(true);
    };

    const fetchSubjects = () => {
        axios.get("https://it342-lemsliteteachers.onrender.com/subject/getallsubject", {
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
    }

    const fetchTeachers = () => {
        axios.get("https://it342-lemsliteteachers.onrender.com/user/getallusersbyroleid?roleId=1", {
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
            });
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // Show loading indicator

                const response = await axios.get(`https://it342-lemsliteteachers.onrender.com/teacherschedule/getAllTeacherSchedules`, {
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                });

                const teacherResponse = await axios.get("https://it342-lemsliteteachers.onrender.com/user/getallusersbyroleid?roleId=1", {
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                });

                console.log("Schedule data:", response.data);

                const formattedData = response.data.map(request => {
                    // Format yearSection from the nested object
                    const yearSectionDisplay = request.yearSection ?
                        `${request.yearSection.year}-${request.yearSection.section}` : '';

                    // Format subject from the nested object
                    const subjectDisplay = request.subject ? request.subject.subject_name : '';

                    // Format teacher from the nested object
                    const teacherDisplay = request.teacher ?
                        `${request.teacher.first_name} ${request.teacher.last_name}` :
                        `N/A (ID: ${request.teacher ? request.teacher.user_id : 'Unknown'})`;

                    return {
                        end_time: request.end_time ? convertTo12HourFormat(request.end_time) : '',
                        schedule_id: request.teacher_schedule_id,
                        lab_num: request.lab_num || '',
                        start_time: request.start_time ? convertTo12HourFormat(request.start_time) : '',
                        teacher_id: teacherDisplay,
                        // Store the actual teacher ID as a separate property for filtering
                        actual_teacher_id: request.teacher ? request.teacher.user_id : 0,
                        date: request.date ? format(parseISO(request.date), 'yyyy-MM-dd') : '',
                        yearSection: yearSectionDisplay,
                        subject: subjectDisplay,
                        subject_id: request.subject ? request.subject.subject_id : 0
                    };
                });

                // Filter based on user role
                const filteredData = userRole === 1
                    ? formattedData.filter(request => request.actual_teacher_id === parseInt(getJWTUid()))
                    : formattedData;

                setRows(filteredData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching schedule data:", error);
                setIsLoading(false);
                // Show error message if fetch fails
                alert("Failed to load schedules. Please try again.");
            }
        };

        fetchData();
    }, [incrementFlag]);

    // Load data when modal is opened
    useEffect(() => {
        if (openCModal) {
            fetchTeachers();
            fetchSubjects();
            fetchYearSections();
        }
    }, [openCModal]);

    // Fetch year sections on component mount as well
    useEffect(() => {
        fetchYearSections();
    }, []);

    // Debug yearSections state changes
    useEffect(() => {
        console.log("Year sections state updated:", yearSections);
    }, [yearSections]);

    // Debug when selected school year changes
    useEffect(() => {
        console.log("Selected school year changed:", selectedSchoolYear);
        console.log("Year range:", getYearsFromSchoolYear(selectedSchoolYear));
        // This will trigger re-filtering of the rows when school year changes

        // Update calendar view to show the end year of the selected school year
        updateCalendarViewForSchoolYear(selectedSchoolYear);
    }, [selectedSchoolYear]);

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




    const handleFetchTeachersClick = () => {
        fetchTeachers();
    };



    const handleSave = () => {
        const today = new Date();
        today.setHours(0,0,0,0);

        // Validate form inputs
        if (!getDate) {
            alert("Please select a date for the schedule.");
            return;
        }

        if (!teacherId) {
            alert("Please select a teacher for the schedule.");
            return;
        }

        if (!subjectId) {
            alert("Please select a subject for the schedule.");
            return;
        }

        if (!getYearSection || !yearSectionId) {
            alert("Please select a year and section for the schedule.");
            return;
        }

        if (!getRoom) {
            alert("Please select a room for the schedule.");
            return;
        }

        if (!getStartHour || !getStartMinute || !getEndHour || !getEndMinute) {
            alert("Please select complete time information.");
            return;
        }

        if(getDate < today) {
            alert("Cannot schedule for past dates. Please select a future date.");
            return;
        }

        // Get current school year or default to first available
        const currentSchoolYear = selectedSchoolYear || generateSchoolYearOptions()[0];

        // Validate time format based on user role and hour selection
        if (userRole === 2 || userRole === 3) {
            const [startMinuteVal, startPeriodVal] = getStartMinute.split(" ");
            const [endMinuteVal, endPeriodVal] = getEndMinute.split(" ");
            const startHourVal = parseInt(getStartHour, 10);
            const endHourVal = parseInt(getEndHour, 10);

            // Validate start time
            if ((startHourVal >= 7 && startHourVal <= 11) && startPeriodVal === "AM") {
                // For 7-11 AM, minutes must be "00 AM" or "30 AM"
                if (startMinuteVal !== "00" && startMinuteVal !== "30") {
                    setTimeValidationError("For morning hours (7-11 AM), minutes must be either 00 or 30.");
                    return;
                }
            } else if (((startHourVal >= 1 && startHourVal <= 4) || startHourVal === 12) && startPeriodVal === "PM") {
                // For 12-4 PM, minutes must be "00 PM" or "30 PM"
                if (startMinuteVal !== "00" && startMinuteVal !== "30") {
                    setTimeValidationError("For afternoon hours (12-4 PM), minutes must be either 00 or 30.");
                    return;
                }
            }

            // Validate end time
            if ((endHourVal >= 7 && endHourVal <= 11) && endPeriodVal === "AM") {
                // For 7-11 AM, minutes must be "00 AM" or "30 AM"
                if (endMinuteVal !== "00" && endMinuteVal !== "30") {
                    setTimeValidationError("For morning hours (7-11 AM), minutes must be either 00 or 30.");
                    return;
                }
            } else if (((endHourVal >= 1 && endHourVal <= 4) || endHourVal === 12) && endPeriodVal === "PM") {
                // For 12-4 PM, minutes must be "00 PM" or "30 PM"
                if (endMinuteVal !== "00" && endMinuteVal !== "30") {
                    setTimeValidationError("For afternoon hours (12-4 PM), minutes must be either 00 or 30.");
                    return;
                }
            }
        }

        // Log current values for debugging
        console.log("Start Hour:", getStartHour, "Start Minute:", getStartMinute);
        console.log("End Hour:", getEndHour, "End Minute:", getEndMinute);
        console.log("Subject ID:", subjectId, "Subject:", getSubject);
        console.log("Year Section:", getYearSection);

        const [startMinute, startPeriodVal] = getStartMinute.split(" ");
        const [endMinute, endPeriodVal] = getEndMinute.split(" ");

        let startHour = parseInt(getStartHour, 10);
        let endHour = parseInt(getEndHour, 10);

        console.log("Parsed Start Hour:", startHour, "Period:", startPeriodVal);
        console.log("Parsed End Hour:", endHour, "Period:", endPeriodVal);

        // Convert 12-hour time to 24-hour format correctly
        if (startPeriodVal === "PM" && startHour !== 12) {
            startHour += 12;
        } else if (startPeriodVal === "AM" && startHour === 12) {
            startHour = 0;
        }

        if (endPeriodVal === "PM" && endHour !== 12) {
            endHour += 12;
        } else if (endPeriodVal === "AM" && endHour === 12) {
            endHour = 0;
        }

        console.log("Converted Start Hour (24h):", startHour);
        console.log("Converted End Hour (24h):", endHour);

        const formattedStartHour = startHour.toString().padStart(2, "0");
        const formattedStartMinute = startMinute.padStart(2, "0");
        const formattedEndHour = endHour.toString().padStart(2, "0");
        const formattedEndMinute = endMinute.padStart(2, "0");

        const timeString = `${formattedStartHour}:${formattedStartMinute}:00`;
        const endTimeString = `${formattedEndHour}:${formattedEndMinute}:00`;

        console.log("Final start time:", timeString);
        console.log("Final end time:", endTimeString);

        const conflicts = checkForScheduleConflicts(getDate, timeString, endTimeString, teacherId, getRoom);

        if (conflicts.length > 0) {
            removeConflictingSchedules(conflicts);
        }

        console.log(getRoom);

        // Extract the start year from the selected school year to set correct school year entity
        const { startYear } = getYearsFromSchoolYear(selectedSchoolYear);

        // Create a request body that includes all the required fields including subject
        const teacherScheduleData = {
            start_time: timeString,
            end_time: endTimeString,
            year_and_section: {
                yrsec_id: yearSectionId
            }, // Correct way to pass the year section ID
            lab_num: getRoom,
            date: format(getDate, 'yyyy-MM-dd'),
            subject_id: subjectId, // Include the subject ID
            school_year: {
                sy_id: 1, // Default school year ID
                year: selectedSchoolYear // Pass the selected school year string
            }
        };

        console.log("Sending schedule data:", teacherScheduleData);

        axios.post(`https://it342-lemsliteteachers.onrender.com/teacherschedule/addtsched?teacherId=${teacherId}&createdby=${getJWTUid()}`,
            teacherScheduleData, {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            .then(response => {
                console.log("Schedule created successfully:", response);
                setIncrementFlag(incrementFlag + 1);
                setOpenModal(false);
                setOpenCModal(false);
                setOpenConfirmModal(false);
                setTimeValidationError(''); // Clear error on success
                alert("Schedule created successfully!");
            })
            .catch(error => {
                console.error("Error creating schedule:", error);
                if (error.response) {
                    alert(`Error: ${error.response.data}`);
                } else {
                    alert("Error creating schedule. Please try again.");
                }
            });
    };

    // const checkForScheduleConflicts = (date, startTime, endTime, teacherId, room) =>
    //     const scheduleDate = new Date(date).toLocaleDateString("en-CA");

    // return rows.filter(schedules => {
    //     if (new Date(schedules.date_schedule).toLocaleDateString("en-CA") !== scheduleDate) {
    //         return false;
    //     }
    //
    //     const hasTimeOverlap = (
    //         (startTime <= schedules.end_time && endTime >= schedules.start_time)
    //     );
    //
    //     const hasTeacherConflict = schedules.teacher_id === teacherId;
    //     const hasRoomConflict = schedules.room === room;
    //
    //     return hasTimeOverlap && (hasTeacherConflict || hasRoomConflict);
    // });


    const removeConflictingSchedules = (conflicts) => {
        conflicts.forEach(conflict => {
            axios.delete(`https://it342-lemsliteteachers.onrender.com/request/deleterequest/${conflict.id}`, {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
                .then(response => {
                    console.log(`Removed conflicting schedules with ID: ${conflict.id}`);
                    setIncrementFlag(incrementFlag + 1);
                })
                .catch(error => {
                    console.error(`Error removing conflicting schedules with ID: ${conflict.id}`, error);
                });
        });
    };
    // const filteredRows = rows
    //     .filter((row) => new Date(row.date_schedule) > new Date())
    //     .filter(
    //         (row) =>
    //             row.teacher_lastname.toLowerCase().includes(searchText.toLowerCase()) ||
    //             //row.material.toLowerCase().includes(searchText.toLowerCase()) ||
    //             row.date_schedule.toLowerCase().includes(searchText.toLowerCase()) ||
    //             row.start_time.toLowerCase().includes(searchText.toLowerCase()) ||
    //             row.subject_name.toLowerCase().includes(searchText.toLowerCase())
    //     );

    const filteredRows = rows
        // First filter based on selected school year
        .filter((row) => {
            if (!row.date) return false;

            const scheduleDate = new Date(row.date);
            const scheduleYear = scheduleDate.getFullYear();

            // Extract years from selected school year string (e.g., "2025-2026")
            const { startYear, endYear } = getYearsFromSchoolYear(selectedSchoolYear);

            // Check if schedule year falls within the selected school year range
            return scheduleYear >= startYear && scheduleYear <= endYear;
        })
        .filter(
            (row) =>
                // Filtering based on search text
                row.date.toLowerCase().includes(searchText.toLowerCase()) ||
                row.start_time.toLowerCase().includes(searchText.toLowerCase()) ||
                row.end_time.toLowerCase().includes(searchText.toLowerCase()) ||
                row.lab_num.toLowerCase().includes(searchText.toLowerCase()) ||
                String(row.teacher_id).toLowerCase().includes(searchText.toLowerCase())
        );

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
    };

    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // const calendarEvents = filteredRows.map((row) => ({
    //     title: `${row.teacher} (${row.material})`,
    //     start: moment(`${row.date} ${row.time}`, 'M/D/YYYY h:mm A').toDate(),
    //     end: moment(`${row.date} ${row.time}`, 'M/D/YYYY h:mm A').add(1, 'hour').toDate(),
    //     resource: row,
    // }));
    const calendarEvents = filteredRows.map((row) => {
        // Combine the date and start/end time
        const startTime = parse(`${row.date} ${row.start_time}`, 'yyyy-MM-dd hh:mm a', new Date());
        const endTime = parse(`${row.date} ${row.end_time}`, 'yyyy-MM-dd hh:mm a', new Date());



        return {
            id: row.schedule_id,
            title: `${row.schedule_id}-${row.teacher_id}: ${row.yearSection} ${row.subject}`, // You can change this to something more descriptive
            start: startTime,
            end: endTime,
            schedule_id: row.schedule_id,
            // If you need the full row data attached to the event, you can use 'resource' or another field
            // resource: row,
        };
    });

    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData);
            setOpenImportModal(false); // Close the modal after file upload
        };
    };

    // helper function to check for conflicts:
    const checkForScheduleConflicts = (date, startTime, endTime, teacherId, room) => {
        // Format date for comparison
        const scheduleDate = new Date(date).toLocaleDateString("en-CA");

        // Find potential conflicts
        const conflicts = rows.filter(schedules => {
            // Check if same date
            if (new Date(schedules.date_schedule).toLocaleDateString("en-CA") !== scheduleDate) {
                return false;
            }

            // Parse time strings to compare
            const hasTimeOverlap = (
                (startTime <= schedules.end_time && endTime >= schedules.start_time)
            );

            // Check conflicts: same teacher or same room at overlapping times
            const hasTeacherConflict = schedules.teacher_id === teacherId;
            const hasRoomConflict = schedules.room === room;

            return hasTimeOverlap && (hasTeacherConflict || hasRoomConflict);
        });

        return conflicts.length > 0;
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

        // Validate form inputs for edit
        if (!getDate) {
            alert("Please select a date for the schedule.");
            return;
        }

        if (!getRoom) {
            alert("Please select a room for the schedule.");
            return;
        }

        if (!getStartHour || !getStartMinute || !getEndHour || !getEndMinute) {
            alert("Please select complete time information.");
            return;
        }

        if (subjectId === 0 && getSubject) {
            alert("Please select a valid subject from the dropdown.");
            return;
        }

        // Log current values for debugging
        console.log("Edit mode - Start Hour:", getStartHour, "Start Minute:", getStartMinute);
        console.log("Edit mode - End Hour:", getEndHour, "End Minute:", getEndMinute);
        console.log("Edit mode - Subject ID:", subjectId, "Subject:", getSubject);
        console.log("Edit mode - Year Section:", getYearSection);
        console.log("Edit mode - Request ID:", requestId);

        const [minute, period] = getStartMinute.split(" ");
        const [endminute, endperiod] = getEndMinute.split(" ");

        let hour = parseInt(getStartHour, 10);
        let endhour = parseInt(getEndHour, 10);

        console.log("Edit mode - Parsed Start Hour:", hour, "Period:", period);
        console.log("Edit mode - Parsed End Hour:", endhour, "Period:", endperiod);

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

        console.log("Edit mode - Converted Start Hour (24h):", hour);
        console.log("Edit mode - Converted End Hour (24h):", endhour);

        const formattedHour = hour.toString().padStart(2, "0"); // Ensure two-digit hour
        const formattedMinute = minute.padStart(2, "0");

        const endformattedHour = endhour.toString().padStart(2, "0"); // Ensure two-digit hour
        const endformattedMinute = endminute.padStart(2, "0");

        const timeString = `${formattedHour}:${formattedMinute}:00`;
        const endtimeString = `${endformattedHour}:${endformattedMinute}:00`;

        console.log("Edit mode - Final start time:", timeString);
        console.log("Edit mode - Final end time:", endtimeString);
        console.log(format(getDate, 'yyyy-MM-dd'));

        // Create update request with all fields including subject and year section
        const updateData = {
            date: format(getDate, 'yyyy-MM-dd'),
            start_time: timeString,
            end_time: endtimeString,
            lab_num: getRoom,
            year_and_section: {
                yrsec_id: yearSectionId
            }
        };

        // Only include subject_id if it's valid
        if (subjectId && subjectId !== 0) {
            updateData.subject_id = subjectId;
        }

        console.log("Update data:", updateData);

        axios.put(`https://it342-lemsliteteachers.onrender.com/teacherschedule/update?teacherScheduleId=${requestId}`,
            updateData,
            {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            }
        )
            .then(response => {
                console.log("Schedule updated successfully:", response);
                setIncrementFlag(incrementFlag + 1);
                setOpenCModal(false); // Close the modal after successful update
                alert("Schedule updated successfully!");
            })
            .catch(error => {
                console.error("Error updating schedule:", error);
                if (error.response) {
                    alert(`Error: ${error.response.data}`);
                } else {
                    alert("Error updating schedule. Please try again.");
                }
            });

        setOpenModal(false);
        setOpenConfirmModal(false);
    };

    const getFormattedLocalDateTime = () => {
        const now = new Date();

        // Get date and time components
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Combine them into the desired format
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const localizer = momentLocalizer(moment);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', height: '100vh', width: '100vw', position:'fixed' }}>
                <Appbar page={"schedules"} />
                <Sidebar page={"schedules"} />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ flex: .2, padding: '5px', marginTop:'100px', mR:'5px' }}>
                        {/*{userRole !== 1 && (*/}
                        {/*<Button variant={'contained'} onClick={handleOpenModal} sx={{ml:'15px', height:'50px'}}>Import Excel File</Button>*/}
                        {/*)}*/}
                        {/*<Select*/}
                        {/*    value={selectedSchoolYear}*/}
                        {/*    onChange={(e) => setSelectedSchoolYear(e.target.value)}*/}
                        {/*    sx={{ marginBottom: '10px', marginRight: '10px', width: '150px' }}*/}
                        {/*>*/}
                        {/*    {generateSchoolYearOptions().map((year) => (*/}
                        {/*        <MenuItem key={year} value={year}>{year}</MenuItem>*/}
                        {/*    ))}*/}
                        {/*</Select>*/}

                        <FormControl size="small" variant="outlined" sx={{ minWidth:80, marginLeft: '15px', marginBottom: '10px', width: '150px' }}>
                            <InputLabel id="school-year-label">School Year</InputLabel>
                            <Select
                                labelId="school-year-label"
                                id="school-year"
                                value={selectedSchoolYear}
                                label="School Year"
                                onChange={(e) => {
                                    const newSchoolYear = e.target.value;
                                    setSelectedSchoolYear(newSchoolYear);
                                    // You can add visual feedback if needed
                                    console.log(`Filtering schedules for school year: ${newSchoolYear}`);

                                    // Update calendar view based on the selected school year
                                    updateCalendarViewForSchoolYear(newSchoolYear);
                                }}
                                sx={{
                                    backgroundColor: '#F3F7FA',
                                    fontWeight: 'bold' // Make it more prominent
                                }}
                            >
                                {generateSchoolYearOptions().map((year) => (
                                    <MenuItem value={year} key={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField variant={'outlined'} sx={{
                            marginLeft: view === 'table' ? '65px' : '100px',
                            width: '50%'
                        }} placeholder={'Search'}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position="end">
                                               <img src="/search.gif" alt="search" style={{ width: '30px', height: '30px' }} />
                                           </InputAdornment>
                                       ),}}/>
                        {userRole !== 1 && (
                            <Button variant={'contained'} onClick={handleOpenCreateModal} sx={{ marginLeft:'10px', height:'50px'}}>Create Schedule</Button>
                        )}
                        {/*<Button variant={'contained'} onClick={handleOpenModal} sx={{marginTop:'10px', marginLeft:'5px'}}>Switch To List View</Button>*/}
                        <Button onClick={toggleView} variant={'outlined'} sx={{marginLeft:'10px', height:'50px'}}>
                            {view === 'calendar' ? 'Switch to Table View' : 'Switch to Calendar View'}
                        </Button>

                    </div>
                    <div style={{ flex: 1, padding: '20px'}}>
                        {/* Console log schedule information instead of displaying it */}
                        {console.log(`Showing schedules for school year: ${selectedSchoolYear} - ${filteredRows.length} schedule(s) found${view === 'calendar' ? ` - Calendar view set to ${calendarDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}` : ''}`)}

                        {isLoading ? (
                            <CircularProgress />
                        ) : view === 'calendar' ? (
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
                                date={calendarDate}
                                onNavigate={(date) => setCalendarDate(date)}
                                selectable={userRole !== 1}
                                onSelectSlot={handleSelectSlot}
                                eventPropGetter={(event) => {
                                    const now = new Date();
                                    const isPastEvent = event.end < now;

                                    if (isPastEvent) {
                                        return {
                                            style: {
                                                backgroundColor: '#d3d3d3', // Grey color for past events
                                                color: '#666666',           // Darker text for better contrast
                                                borderRadius: '5px',
                                                border: '1px solid #c0c0c0',
                                                opacity: 0.7               // Reduced opacity for visual distinction
                                            },
                                        };
                                    } else {
                                        // For current/future events, keep your color palette logic
                                        const colorIndex = event.schedule_id % colorPalette.length;
                                        const bgColor = colorPalette[colorIndex];

                                        return {
                                            style: {
                                                backgroundColor: bgColor,
                                                color: 'black',
                                                borderRadius: '5px',
                                                border: '1px solid white',
                                            },
                                        };
                                    }
                                }}
                                onSelectEvent={(event) => handleEditClick(event)}
                                min={new Date(1970, 1, 1, 7, 0, 0)} // Set minimum time to 7:00 AM
                                max={new Date(1970, 1, 1, 17, 0, 0)} // Set maximum time to 5:00 PM
                            />
                        ) : (
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

                        )}
                    </div>
                    {/*<div style={{ flex: 1, padding: '20px', border: '1px solid #ccc' }}>*/}
                    {/*    Section 3*/}
                    {/*</div>*/}
                    {/*<div style={{ flex: 1, padding: '20px', border: '1px solid #ccc' }}>*/}
                    {/*    Section 4*/}
                    {/*</div>*/}
                </div>
            </div>
            {/*IMPORT FILE*/}
            <Modal open={openModal} onClose={handleCloseModal}>
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
                            borderRadius:'15px 15px 0 0',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                padding: '20px',
                                fontSize:'30px',
                            }}
                        >    Import Excel File
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 2, // Padding
                            borderRadius: '4px', // Border radius
                        }}
                    >
                        <div style={{ position: 'absolute', top: 24, right: 10 }}>
                            <Button onClick={() => setOpenModal(false)}><img src={"/close.gif"} style={{
                                width: '30px',
                                height: '30px',
                            }}/></Button>
                        </div>
                        {/*<Typography sx={{ mt: 2 }}>*/}
                        {/*    */}
                        {/*</Typography>*/}
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileUpload}
                        />

                    </Box>
                </Box>
            </Modal>
            {/*CREATE SCHEDULE MODAL*/}
            <Modal open={openCModal} onClose={handleCloseCreateModal}>
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
                            borderRadius:'15px 15px 0 0',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                padding: '20px',
                                fontSize:'30px',
                            }}
                        >     {isEditMode ? 'Edit Schedule' : 'Create New Schedule'}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            p: 2, // Padding
                            borderRadius: '4px', // Border radius
                        }}
                    >
                        <div style={{ position: 'absolute', top: 24, right: 10 }}>
                            <Button onClick={() => setOpenCModal(false)}><img src={"/close.gif"} style={{
                                width: '30px',
                                height: '30px',
                            }}/></Button>
                        </div>
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

                        <Select
                            value={teacherId || ''}
                            aria-placeholder={"Select a Teacher"}
                            onChange={(e) => setTeacherId(e.target.value)}
                            displayEmpty
                            sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                        >
                            <MenuItem value="" disabled>Select a Teacher</MenuItem>
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher.user_id} value={teacher.user_id}>
                                    {teacher.fullname}
                                </MenuItem>
                            ))}
                        </Select>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Date"
                                value={getDate}
                                onChange={(newValue) => setDate(newValue)}
                                minDate={new Date()} // Restrict to today and future dates
                                sx={{
                                    '& .MuiInputBase-root': {
                                        backgroundColor: '#FFFFFF',
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Select
                                    value={getStartHour || ''}
                                    onChange={(e) => handleStartHourChange(e.target.value)}
                                    displayEmpty
                                    sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                >
                                    <MenuItem value="" disabled>00</MenuItem>
                                    {/* Morning hours (7-12) */}
                                    <MenuItem disabled divider>--- AM Hours ---</MenuItem>
                                    {[...Array(6).keys()]
                                        .map((hour) => {
                                            const hourValue = hour + 7; // 7-12 AM
                                            const currentDate = new Date();
                                            const currentHour = currentDate.getHours();
                                            const currentMinutes = currentDate.getMinutes();

                                            // Check if date is today
                                            const isToday = getDate &&
                                                getDate.getDate() === currentDate.getDate() &&
                                                getDate.getMonth() === currentDate.getMonth() &&
                                                getDate.getFullYear() === currentDate.getFullYear();

                                            // Convert hourValue to 24-hour format
                                            let hour24 = hourValue;
                                            if (hourValue === 12) hour24 = 12; // 12 AM is 12 in 24h format

                                            // Disable if in the past
                                            const isPastHour = isToday && (hour24 < currentHour ||
                                                (hour24 === currentHour && currentMinutes > 0));

                                            return (
                                                <MenuItem
                                                    key={hourValue}
                                                    value={hourValue}
                                                    disabled={isPastHour}
                                                    sx={isPastHour ? { color: 'rgba(0, 0, 0, 0.38)' } : {}}
                                                >
                                                    {hourValue}
                                                </MenuItem>
                                            );
                                        })}

                                    {/* Afternoon hours (1-4) */}
                                    <MenuItem disabled divider>--- PM Hours ---</MenuItem>
                                    {[...Array(4).keys()]
                                        .map((hour) => {
                                            const hourValue = hour + 1; // 1-4 PM
                                            const currentDate = new Date();
                                            const currentHour = currentDate.getHours();
                                            const currentMinutes = currentDate.getMinutes();

                                            // Check if date is today
                                            const isToday = getDate &&
                                                getDate.getDate() === currentDate.getDate() &&
                                                getDate.getMonth() === currentDate.getMonth() &&
                                                getDate.getFullYear() === currentDate.getFullYear();

                                            // Convert hourValue to 24-hour format (PM hours)
                                            const hour24 = hourValue + 12; // 1 PM = 13, etc.

                                            // Disable if in the past
                                            const isPastHour = isToday && (hour24 < currentHour ||
                                                (hour24 === currentHour && currentMinutes > 0));

                                            return (
                                                <MenuItem
                                                    key={hourValue}
                                                    value={hourValue}
                                                    disabled={isPastHour}
                                                    sx={isPastHour ? { color: 'rgba(0, 0, 0, 0.38)' } : {}}
                                                >
                                                    {hourValue}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                                <Typography>:</Typography>
                                <Select
                                    value={getStartMinute || ''}
                                    onChange={(e) => setStartMinute(e.target.value)}
                                    displayEmpty
                                    sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                >
                                    <MenuItem value="" disabled>00 {startPeriod}</MenuItem>
                                    {getValidStartMinuteOptions(parseInt(getStartHour), startPeriod).map((minute) => (
                                        <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                                    ))}
                                </Select>
                                <Typography>-</Typography>
                                <Select
                                    value={getEndHour}
                                    onChange={(e) => handleEndHourChange(e.target.value)}
                                    displayEmpty
                                    sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                >
                                    <MenuItem value="" disabled>00</MenuItem>
                                    {/* Morning hours (7-12) */}
                                    <MenuItem disabled divider>--- AM Hours ---</MenuItem>
                                    {[...Array(6).keys()]
                                        .map((hour) => {
                                            const hourValue = hour + 7; // 7-12 AM
                                            return (
                                                <MenuItem key={hourValue} value={hourValue}>
                                                    {hourValue}
                                                </MenuItem>
                                            );
                                        })}

                                    {/* Afternoon hours (1-5) */}
                                    <MenuItem disabled divider>--- PM Hours ---</MenuItem>
                                    {[...Array(5).keys()]
                                        .map((hour) => {
                                            const hourValue = hour + 1; // 1-5 PM
                                            return (
                                                <MenuItem key={hourValue} value={hourValue}>
                                                    {hourValue}
                                                </MenuItem>
                                            );
                                        })}
                                </Select>
                                <Typography>:</Typography>
                                <Select
                                    value={getEndMinute || ''}
                                    onChange={(e) => setEndMinute(e.target.value)}
                                    displayEmpty
                                    sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                                >
                                    <MenuItem value="" disabled>00 {endPeriod}</MenuItem>
                                    {getValidEndMinuteOptions(parseInt(getEndHour), endPeriod).map((minute) => (
                                        <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                                    ))}
                                </Select>
                            </Box>

                            {/* Validation guidance for users */}
                            {(userRole === 2 || userRole === 3) && (
                                <Typography variant="caption" sx={{ color: '#016565', marginTop: '4px' }}>
                                    For hours 7-11 AM, minutes must be 00 or 30 AM. <br/>
                                    For hours 12-4 PM, minutes must be 00 or 30 PM.
                                </Typography>
                            )}

                            {/* Error message display */}
                            {timeValidationError && (
                                <Typography variant="body2" sx={{ color: 'red', marginTop: '4px' }}>
                                    {timeValidationError}
                                </Typography>
                            )}
                        </Box>
                        <Select
                            value={getYearSection || ''}
                            onChange={(e) => {
                                handleYearSectionChange(e.target.value);
                                console.log("value: " + typeof e.target.value);
                            }}
                            fullWidth
                            displayEmpty
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <MenuItem key="default" value="" disabled>
                                Select Year and Section
                            </MenuItem>
                            {yearSections && yearSections.length > 0 ? (
                                yearSections.map((section) => (
                                    <MenuItem
                                        key={section.yrsec_id}
                                        value={section.yrsec_id}
                                        onClick={() => {
                                            console.log("Selected: " + section.yrsec_id)
                                        }}
                                    >
                                        {`${section.year} - ${section.section}`}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem value="" disabled>Loading sections...</MenuItem>
                            )}
                        </Select>
                        <Select
                            value={getSubject || ''}
                            aria-placeholder={"Subject"}
                            onChange={(e) => setSubject(e.target.value)}
                            fullWidth
                            displayEmpty
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#f0f0f0',
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
                            value={getRoom || ''}
                            onChange={(e) => setRoom(e.target.value)}
                            fullWidth
                            displayEmpty
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
                            onClick={handleCloseCreateModal}
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
                            onClick={isEditMode ? handleConfirmSave : handleSave}
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
                            {isEditMode ? 'Update' : 'Submit'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
}