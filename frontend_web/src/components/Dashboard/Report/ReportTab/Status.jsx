import React, { useEffect, useState } from 'react';
import Appbar from '../../../Appbar/Appbar.jsx';
import Sidebar from '../../../Sidebar/Sidebar.jsx';
import { TextField, useMediaQuery, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CustomTable from '../../../Table and Pagination/Table.jsx';
import CustomTablePagination from '../../../Table and Pagination/Pagination.jsx';
import MyPaper from '../../../MyPaper.jsx';

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
                    fontSize: 16, // Increased font size
                    padding: '10px', // Adjusted padding
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
            status: 'Resolved'
        });
    }
    return sampleData;
};

export default function Status() {
    const [resolvedData, setResolvedData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        setResolvedData(generateSampleData(100)); // Generate 100 rows of sample data
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRows = resolvedData.filter((row) => {
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

                <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '80px' }}>

                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <br/>
                    <MyPaper>
                        <Box sx={{ height: '400px', overflow: 'auto' }}>
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
                                roleid={2}
                                showRemoveColumn={false}
                                isInventoryPage={false}
                            />
                        </Box>
                        <CustomTablePagination
                            count={filteredRows.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            onAddClick={() => {}}
                            roleid={2}
                            isAtInventory={false}
                            isAtDamages={false}
                        />
                    </MyPaper>
                </div>
            </div>
        </ThemeProvider>
    );
}