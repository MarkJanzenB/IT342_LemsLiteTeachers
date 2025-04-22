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


    const handleSelectSlot = ({ start, end }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if selected date is in the past
        if (start < today) {
            alert("Cannot schedule for past dates. Please select a future date.");
            return;
        }

        setDate(start);
        setOpenCModal(true);

        const startHour = start.getHours();
        const endHour = end.getHours();

        if (startHour >= 7 && startHour <= 17 && endHour >= 7 && endHour <= 17) {
            setDate(start);
            setStartHour(formatHour(startHour));
            setStartMinute(formatMinute(start.getMinutes(), startHour));
            setEndHour(formatHour(endHour));
            setEndMinute(formatMinute(end.getMinutes(), endHour));
            setOpenCModal(true);
        } else {
            console.log("");
        }
    };

    const handleSelectEvent = (event) => {
        const startHour = event.start.getHours();
        const endHour = event.end.getHours();

        if (startHour >= 7 && startHour <= 17 && endHour >= 7 && endHour <= 17) {
            setDate(event.start);
            setStartHour(formatHour(startHour));
            setStartMinute(formatMinute(event.start.getMinutes(), startHour));
            setEndHour(formatHour(endHour));
            setEndMinute(formatMinute(event.end.getMinutes(), endHour));
            setOpenCModal(true);
        } else {
            alert("Please select a time between 7:00 AM and 5:00 PM.");
        }
    };

    const formatHour = (hour) => {
        if (hour < 7) return 7;
        if (hour > 17) return 17;
        if (hour === 0) return 12;
        if (hour > 12) return hour - 12;
        return hour;
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
    }

    const fetchTeachers = () => {
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
            });
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

                const teacherResponse = await axios.get("http://localhost:8080/user/getallusersbyroleid?roleId=1", {
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    }
                });

                // Log teacher data to verify structure
                console.log("Teacher response data:", teacherResponse.data);

                // Create a more robust mapping
                const teachers = {};
                teacherResponse.data.forEach(teacher => {
                    // Convert IDs to strings to ensure consistent comparison
                    const teacherId = String(teacher.user_id);
                    teachers[teacherId] = `${teacher.first_name} ${teacher.last_name}`;
                });

                console.log("Teachers mapping:", teachers);
                console.log("Schedule data:", response.data);


                console.log(response.data)


                const formattedData = response.data.map(request => {
                    // Convert teacher_id to string for consistent comparison
                    // const teacherId = String(request.teacher_id);

                    return {
                        end_time: request.end_time ? convertTo12HourFormat(request.end_time) : '',
                        schedule_id: request.teacher_schedule_id,
                        lab_num: request.lab_num,
                        start_time: request.start_time ? convertTo12HourFormat(request.start_time) : '',
                        teacher_id: request.teacher ?
                            `${request.teacher.first_name} ${request.teacher.last_name}` :
                            `N/A (ID: ${request.teacher ? request.teacher.user_id : 'Unknown'})`,
                        date: request.date ? format(parseISO(request.date), 'yyyy-MM-dd') : ''
                    };
                });

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

    useEffect(() => {
        if (openCModal) {
            fetchTeachers();
            fetchSubjects();
        }
    }, [openCModal]);

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

        if(getDate < today)
        {
            alert("Cannot schedules for past dates. Please select a future date.");
            return;
        }

        const [startMinute, startPeriod] = getStartMinute.split(" ");
        const [endMinute, endPeriod] = getEndMinute.split(" ");

        let startHour = parseInt(getStartHour, 10);
        let endHour = parseInt(getEndHour, 10);

        if (startPeriod === "PM" && startHour !== 12) {
            startHour += 12;
        } else if (startPeriod === "AM" && startHour === 12) {
            startHour = 0;
        }

        if (endPeriod === "PM" && endHour !== 12) {
            endHour += 12;
        } else if (endPeriod === "AM" && endHour === 12) {
            endHour = 0;
        }

        const formattedStartHour = startHour.toString().padStart(2, "0");
        const formattedStartMinute = startMinute.padStart(2, "0");
        const formattedEndHour = endHour.toString().padStart(2, "0");
        const formattedEndMinute = endMinute.padStart(2, "0");

        const timeString = `${formattedStartHour}:${formattedStartMinute}:00`;
        const endTimeString = `${formattedEndHour}:${formattedEndMinute}:00`;


        const conflicts = checkForScheduleConflicts(getDate, timeString, endTimeString, teacherId, getRoom);

        if (conflicts.length > 0) {
            removeConflictingSchedules(conflicts);
        }

        console.log(getRoom)
        const teacherScheduleData = {

            start_time: timeString,
            end_time: endTimeString,
            year_and_section: null,
            lab_num: getRoom,
            date: format(getDate, 'yyyy-MM-dd')
        };

        // if (userRole !== 1) {
        //  teacherScheduleData.date_approved = getFormattedLocalDateTime();
        //  teacherScheduleData.date_requested = getFormattedLocalDateTime();
        //  teacherScheduleData.approver = { user_id: getJWTUid() };
        // } else {
        //  teacherScheduleData.date_requested = getFormattedLocalDateTime();
        // }

        // axios.post(`http://localhost:8080/teacherschedule/addtsched?createdby=${getJWTUid()}`, teacherScheduleData, {
        //     headers: {
        //         "Authorization": `Bearer ${jwtToken}`
        //     }
        // })
        axios.post(`http://localhost:8080/teacherschedule/addtsched?teacherId=${teacherId}&createdby=${getJWTUid()}`,
            teacherScheduleData, {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                }
            })
            .then(response => {
                console.log(response);
                setIncrementFlag(incrementFlag + 1);
                setOpenModal(false);
                setOpenCModal(false);
                setOpenConfirmModal(false);
                // setOpenSuccessModal(true);
            })
            .catch(error => {
                console.log(error);
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
            axios.delete(`http://localhost:8080/request/deleterequest/${conflict.id}`, {
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
            title: `${row.schedule_id}`, // You can change this to something more descriptive
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
        // setOpenSuccessModal(true);
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
                    <div style={{ flex: .2, padding: '5px', marginTop:'100px' }}>
                        {userRole !== 1 && (
                        <Button variant={'contained'} onClick={handleOpenModal} sx={{ml:'15px', height:'50px'}}>Import Excel File</Button>
                        )}
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

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Select
                                value={getStartHour || ''}
                                onChange={(e) => setStartHour(e.target.value)}
                                displayEmpty
                                sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                            >
                                <MenuItem value="" disabled>00</MenuItem>
                                {[...Array(12).keys()]
                                    .filter(hour => hour + 1 >= 7) // Filter out hours less than 7
                                    .map((hour) => {
                                        const hourValue = hour + 1;
                                        const currentDate = new Date();
                                        const currentHour = currentDate.getHours();
                                        const currentMinutes = currentDate.getMinutes();

                                        // Check if date is today
                                        const isToday = getDate &&
                                            getDate.getDate() === currentDate.getDate() &&
                                            getDate.getMonth() === currentDate.getMonth() &&
                                            getDate.getFullYear() === currentDate.getFullYear();

                                        // Convert hourValue to 24-hour format based on AM/PM from dropdown
                                        const selectedPeriod = getStartMinute ? getStartMinute.split(" ")[1] : "AM";
                                        let hour24 = hourValue;
                                        if (selectedPeriod === "PM" && hourValue !== 12) hour24 += 12;
                                        if (selectedPeriod === "AM" && hourValue === 12) hour24 = 0;

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
                                <MenuItem value="" disabled>00 PM</MenuItem>
                                {["00 AM", "15 AM", "30 AM", "45 AM", "00 PM", "15 PM", "30 PM", "45 PM"].map((minute) => (
                                    <MenuItem key={minute} value={minute}>{minute}</MenuItem>))}
                            </Select>
                            <Typography>-</Typography>
                            <Select
                                value={getEndHour}
                                onChange={(e) => setEndHour(e.target.value)}
                                displayEmpty
                                sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                            >
                                <MenuItem value="" disabled>00</MenuItem>
                                {[...Array(12).keys()]
                                    .filter(hour => hour + 1 >= 7 || hour + 1 <= 5) // Allow hours from 7 AM to 5 PM
                                    .map((hour) => (
                                        <MenuItem key={hour + 1} value={hour + 1}>{hour + 1}</MenuItem>
                                    ))}
                            </Select>
                            <Typography>:</Typography>
                            <Select
                                value={getEndMinute || ''}
                                onChange={(e) => setEndMinute(e.target.value)}
                                displayEmpty
                                sx={{ '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' } }}
                            >
                                <MenuItem value="" disabled>00 PM</MenuItem>
                                {["00 AM", "15 AM", "30 AM", "45 AM", "00 PM", "15 PM", "30 PM", "45 PM"].map((minute) => (
                                    <MenuItem key={minute} value={minute}>{minute}</MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <Select
                            value={getYearSection || ''}
                            onChange={(e) => setYearSection(e.target.value)}
                            fullWidth
                            displayEmpty
                            sx={{
                                '& .MuiInputBase-root': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                        >
                            <MenuItem value="" disabled>
                                Select Year and Section
                            </MenuItem>
                            <MenuItem value="Year 1 - Section A">Year 1 - Section A</MenuItem>
                            <MenuItem value="Year 1 - Section B">Year 1 - Section B</MenuItem>
                            <MenuItem value="Year 2 - Section A">Year 2 - Section A</MenuItem>
                            <MenuItem value="Year 2 - Section B">Year 2 - Section B</MenuItem>
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
                            {/* <MenuItem value="Mathematics">Mathematics</MenuItem>
                                <MenuItem value="Science">Science</MenuItem>
                                <MenuItem value="History">History</MenuItem>
                                <MenuItem value="English">English</MenuItem> */}
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