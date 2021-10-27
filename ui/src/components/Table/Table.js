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
    order,
    orderBy,
    requestSort,
    headCells,
    rows,
    openEditMiscellaneous,
    submitDeleteMiscellaneous,
    totalCount,
    pageNo,
    rowsPerPage,
    changePage,
    changeRowsPerPage,
  } = props;

  return (
    <Paper sx={{ width: '100%', mb: 2, padding: '10px' }}>
      <EnhancedTableToolbar title={tableTitle} />
      <TableContainer>
        <MuiTable
          sx={{ minWidth: 750 }}
          aria-labelledby='tableTitle'
          size='medium'
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
              openEditMiscellaneous={openEditMiscellaneous}
              submitDeleteMiscellaneous={submitDeleteMiscellaneous}
              actions={true}
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
