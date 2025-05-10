import React, { useEffect, useState } from "react";
import Appbar from "../../../Appbar/Appbar.jsx";
import Sidebar from "../../../Sidebar/Sidebar.jsx";
import { Box, Button, Modal, TextField, useMediaQuery, Select, MenuItem, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CustomTable from "../../../Table and Pagination/Table.jsx";
import CustomTablePagination from "../../../Table and Pagination/Pagination.jsx";
import MyPaper from "../../../MyPaper.jsx";
import NewDamageReportModal from "../../../Modal/NewDamageReportModal.jsx";

const theme = createTheme({
    palette: {
        primary: { main: '#016565' },
        secondary: { main: '#000000' }
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
                    padding: '8px', // Adjust padding to match Resolved component
                },
            },
        },
    },
});

const generateSampleData = (numRows) => {
    const sampleData = [];
    for (let i = 0; i < numRows; i++) {
        sampleData.push({
            reportId: i + 1,
            serialNo: `SN${i + 1}`,
            itemName: `Item ${i + 1}`,
            dateBorrowed: `2023-10-${(i % 30) + 1}`,
            subject: `Subject ${i + 1}`,
            yearSec: `Year ${i + 1}`,
            instructor: `Instructor ${i + 1}`,
            photo: `Photo ${i + 1}`,
            accountable: `Accountable ${i + 1}`,
            status: 'Unresolved'
        });
    }
    return sampleData;
};

export default function BorrowReport() {
    const [damagesData, setDamagesData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState("");
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [openModal, setOpenModal] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState("");

    useEffect(() => {
        setDamagesData(generateSampleData(100)); // Generate 100 rows of sample data
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleStatusChange = (id, newStatus) => {
        const updatedData = damagesData.map(item =>
            item.reportId === id ? { ...item, status: newStatus } : item
        );
        setDamagesData(updatedData);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleModalSearchChange = (event) => {
        setModalSearchQuery(event.target.value);
    };

    const filteredRows = damagesData.filter((row) => {
        return (
            row.serialNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.dateBorrowed.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.yearSec.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.photo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.accountable.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.status.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
                <Appbar page={"reports"} />
                <Sidebar page={"reports"} />
                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', marginTop: '100px' }}>

                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{ marginBottom: '10px', width: isSmallScreen ? '90vw' : '80vw' }}
                    /><br/>
                    <MyPaper>
                        <CustomTable
                            columns={[
                                { field: 'serialNo', headerName: 'Serial No' },
                                { field: 'itemName', headerName: 'Item Name' },
                                { field: 'dateBorrowed', headerName: 'Date Borrowed' },
                                { field: 'subject', headerName: 'Subject' },
                                { field: 'yearSec', headerName: 'Year & Sec' },
                                { field: 'instructor', headerName: 'Instructor' },
                                { field: 'photo', headerName: 'Photo' },
                                { field: 'accountable', headerName: 'Accountable' },
                                { field: 'status', headerName: 'Status' }
                            ]}
                            data={displayedRows}
                            onRowClick={() => {}}
                            onRemoveClick={() => {}}
                            roleid={3}
                            showRemoveColumn={false}
                            isInventoryPage={false}
                        />
                        <CustomTablePagination
                            count={filteredRows.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            onAddClick={handleOpenModal}
                            roleid={3}
                            isAtInventory={false}
                            isAtDamages={true}
                        /></MyPaper>

                    <NewDamageReportModal 
                        open={openModal} 
                        onClose={() => setOpenModal(false)} 
                    />

                </div>
            </div>
        </ThemeProvider>
    );
}