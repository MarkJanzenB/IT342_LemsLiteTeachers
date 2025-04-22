import React from "react";
import { Outlet } from 'react-router-dom';

export default function history() {
    return (
        <div>
            <Outlet />
        </div>

    );
}
