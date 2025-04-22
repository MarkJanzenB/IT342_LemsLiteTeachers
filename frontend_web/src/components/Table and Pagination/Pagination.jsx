import React from 'react';
import { TablePagination, Button } from '@mui/material';

const CustomTablePagination = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange, onAddClick, roleid, isAtInventory, isAtDamages }) => {
    const showAddButton = isAtInventory && Number(roleid) !== 1;
    const showNewButton = isAtDamages && Number(roleid) !== 1;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {showAddButton && (
                <Button onClick={onAddClick} style={{ marginRight: 'auto' }}>
                    Add
                </Button>
            )}
            {showNewButton && (
                <Button onClick={onAddClick} style={{ marginRight: 'auto' }} variant="contained" color="primary">
                    Create +
                </Button>
            )}
            <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                labelRowsPerPage=""
            />
        </div>
    );
};

export default CustomTablePagination;