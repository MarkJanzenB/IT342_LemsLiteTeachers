import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './Authentication/Login.jsx';
import Register from './Authentication/Register.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import Home from './Landingpage/Home.jsx';
import Schedule from "./Dashboard/Schedule/Schedule.jsx";
import Inventory from "./Dashboard/Inventory/Inventory.jsx";
import Export from "./Dashboard/Inventory/Export.jsx";
import Request from "./Dashboard/Schedule/ScheduleTab/Request.jsx";
import Today from "./Dashboard/Schedule/ScheduleTab/Today.jsx";
import UpcomingSchedule from "./Dashboard/Schedule/ScheduleTab/UpcomingSchedule.jsx";
import Calendar from "./Calendar/Calendar.jsx";
import Report from "./Dashboard/Report/Report.jsx";
import Incidents from "./Dashboard/Report/ReportTab/Incidents.jsx";
import Status from "./Dashboard/Report/ReportTab/Status.jsx";
import Resupply from "./Dashboard/Report/ReportTab/Resupply.jsx";
import Borrow from "./Dashboard/Report/ReportTab/Borrow.jsx";
import ResupplyHistory from "./Dashboard/History/ResupplyHistory.jsx";
import ReturnHistory from "./Dashboard/History/ReturnHistory.jsx";
import List from "./Dashboard/History/List.jsx";
import History from "./Dashboard/History/History.jsx";
import UnauthorizedPage from './UnauthorizedPage.jsx';
import EditProfile from "./Menu/EditProfile.jsx";
import PrivateRoute from './PrivateRoute.jsx';
import useLocalStorageListener from '../hooks/useLocalStorageListener';
import PreparingItem from './Dashboard/History/PreparingItem.jsx';
import BorrowCart from './BorrowCart/BorrowCart';
import AllItems from "./Dashboard/Inventory/AllItems.jsx";
import Damages from "./Dashboard/Report/ReportTab/Incidents.jsx";
import Resolved from "./Dashboard/Report/ReportTab/Status.jsx";
import Categories from "./Dashboard/Inventory/Categories.jsx";
import {Category} from "@mui/icons-material";

function AppRoutes() {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useLocalStorageListener();

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken && location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/login') {
            navigate("/login");
            return;
        }

        const role = localStorage.getItem("userRole");
        setUserRole(role);
    }, [navigate, location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/schedules" element={<PrivateRoute><Schedule /></PrivateRoute>}>
                <Route path="request" element={<Request />} />
                <Route path="today" element={<Today />} />
                <Route path="upcoming" element={<UpcomingSchedule />} />
                <Route path="calendar" element={<Calendar />} />
            </Route>
            <Route path="/inventory" element={<PrivateRoute><Inventory userRole={userRole} /></PrivateRoute>}>
                <Route path="" element={<AllItems />} />
                <Route path="categories" element={<Categories />} />
            </Route>
            {/*<Route path="/inventory" element={<PrivateRoute><Inventory userRole={userRole} /></PrivateRoute>} />*/}
            {/*<Route path="/inventory/allitems" element={<PrivateRoute allowedRoles={[2, 3]}><AllItems /></PrivateRoute>} />*/}
            {/*<Route path="inventory/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />*/}
            <Route path="/inventory/export" element={<PrivateRoute allowedRoles={[2, 3]}><Export /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Report /></PrivateRoute>}>
                <Route path="incidents" element={<Incidents />} />
                <Route path="status" element={<Status />} />
                <Route path="resupply" element={<Resupply />} />
                <Route path="borrow" element={<Borrow />} />
            </Route>
            <Route path="/history" element={<PrivateRoute><History userRole={userRole} /></PrivateRoute>} >
                <Route path="/history/list" element={<List />} />
                <Route path="/history/ResupplyHistory" element={<ResupplyHistory />} />
                <Route path="/history/ReturnHistory" element={<ReturnHistory />} />
                <Route path="/history/PreparingItem" element={<PreparingItem />} />
            </Route>
            <Route path="/borrowcart" element={<PrivateRoute allowedRoles={[1]}><BorrowCart /></PrivateRoute>} />
            <Route path="/updateuser" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
            <Route path="*" element={<UnauthorizedPage />} />
        </Routes>
    );
}

export default AppRoutes;