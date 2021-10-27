import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import MuiTable from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableBody from '@mui/material/TableBody';

import EnhancedTableContent from './EnhancedTableContent';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import EnhancedTablePagination from './EnhancedTablePagination';

const Table2 = (props) => {
  const dispatch = useDispatch();

  const [pageNo, setPageNo] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('id');
  const [order, setOrder] = useState('asc');

  const {
    tableTitle,
    miscellaneousRead,
    token,
    rows,
    headCells,
    totalCount,
    openEditMiscellaneous,
    submitDeleteMiscellaneous,
  } = props;

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    setOrder(direction);
    setOrderBy(property);
    dispatch(
      miscellaneousRead({
        token,
        pageNo,
        rowsPerPage,
        order: direction,
        orderBy: property,
      }),
    );
  };

  const handleChangePage = (_event, newPage) => {
    setPageNo(newPage);
    dispatch(
      miscellaneousRead({
        token,
        pageNo: newPage,
        rowsPerPage,
        orderBy,
        order,
      }),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    dispatch(
      miscellaneousRead({
        token,
        pageNo,
        rowsPerPage: newRowsPerPage,
        orderBy,
        order,
      }),
    );
  };

  // useEffect(() => {
  //   if (rows.length === 6) {
  //     const newPageNo = pageNo;
  //     handleChangePage(null, newPageNo + 1);
  //   } else
  //   if (rows.length === 0 && pageNo > 0) {
  //     const newPageNo = pageNo;
  //     handleChangePage(null, newPageNo - 1);
  //   }
  // }, [pageNo, rows.length]);

  // if (rows.length === 6) {

  //   handleChangePage(null, pageNo + 1);
  // }

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
            onRequestSort={handleRequestSort}
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
        changePage={handleChangePage}
        changeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Table2;
