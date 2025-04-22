import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Sidebar from '../Sidebar/Sidebar';
import Appbar from '../Appbar/Appbar.jsx';
//import { initialRows } from '../Dashboard/Schedule/ScheduleTab/.jsx'; // Import data from Today.jsx
import StyledPaper from '../MyPaper.jsx'; // Import the StyledPaper component

const localizer = momentLocalizer(moment);

export default function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Process the initial data to create events, excluding Saturdays and Sundays
        const processedEvents = initialRows
            .map(item => ({
                title: item.instructor,
                start: new Date(),
                end: new Date(),
                allDay: true
            }))
            .filter(event => {
                const day = event.start.getDay();
                return day !== 0 && day !== 6; // Exclude Sundays (0) and Saturdays (6)
            });
        setEvents(processedEvents);
    }, []);

    // Custom event style getter to highlight days with schedules
    const eventStyleGetter = (event) => {
        const style = {
            backgroundColor: 'red',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    return (
        <StyledPaper>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <div style={{ flexGrow: 1 }}>
                    <Appbar />
                    <div style={{ height: '110vh', padding: '20px' }}>
                        <BigCalendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%', padding: '80px' }}
                            eventPropGetter={eventStyleGetter}
                        />
                    </div>
                </div>
            </div>
        </StyledPaper>
    );
}