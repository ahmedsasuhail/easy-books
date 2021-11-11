import React from 'react';

import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';

import EnhancedTableContent from './EnhancedTableContent';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTablePagination from './EnhancedTablePagination';

const Table = (props) => {
  const {
    tableTitle,
    pageNo,
    rowsPerPage,
    order,
    orderBy,
    headCells,
    rows,
    totalCount,
    requestSort,
    changePage,
    changeRowsPerPage,
    actions,
    openEditFunction,
    submitDeleteFunction,
    submitAddFunction,
    submitReturnFunction,
    size,
  } = props;

  return (
    <Paper sx={{ width: '100%', mb: 2, padding: '10px' }}>
      <EnhancedTableToolbar title={tableTitle} />
      <TableContainer>
        <MuiTable
          sx={{ minWidth: 750 }}
          aria-labelledby='tableTitle'
          size={size}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={requestSort}
            headCells={headCells}
            actions={true}
          />
          <TableBody>
            <EnhancedTableContent
              rows={rows}
              headCells={headCells}
              actions={actions}
              submitAddFunction={submitAddFunction}
              openEditFunction={openEditFunction}
              submitDeleteFunction={submitDeleteFunction}
              submitReturnFunction={submitReturnFunction}
            />
          </TableBody>
        </MuiTable>
      </TableContainer>
      <EnhancedTablePagination
        totalCount={totalCount}
        pageNo={pageNo}
        rowsPerPage={rowsPerPage}
        changePage={changePage}
        changeRowsPerPage={changeRowsPerPage}
      />
    </Paper>
  );
};

export default Table;
