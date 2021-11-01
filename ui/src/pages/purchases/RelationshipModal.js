import React from 'react';
import { useSelector } from 'react-redux';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from '@material-ui/core';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import CustomTable from '../../components/Table/CustomTable.js';

const RelationshipModal = (props) => {
  const {
    relationshipItems,
    openCreateUpdatePurchase,
    handleCloseCreateOrEditPurchase,
  } = props;

  let rows = [];
  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name',
    },
    {
      id: 'phno',
      numeric: false,
      disablePadding: false,
      label: 'Phno',
    },
    {
      id: 'address',
      numeric: false,
      disablePadding: false,
      label: 'Address',
    },
  ];

  if (relationshipItems) {
    rows = relationshipItems.map((relationship) => {
      return [
        relationship.name ? relationship.name : 'Not Specified',
        relationship.phone_number ? relationship.phone_number : 'Not Specified',
        relationship.address ? relationship.address : 'Not Specified',
        {
          id: relationship.id,
          name: relationship.name,
          phone_number: relationship.phone_number,
          address: relationship.address,
        },
      ];
    });
  }

  const pageNo = useSelector((state) => state.miscellaneous.pageNo);
  const rowsPerPage = useSelector((state) => state.miscellaneous.rowsPerPage);
  const orderBy = useSelector((state) => state.miscellaneous.orderBy);
  const order = useSelector((state) => state.miscellaneous.order);
  const totalCount = useSelector((state) => state.miscellaneous.count);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
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
    dispatch(
      miscellaneousRead({
        token,
        pageNo,
        rowsPerPage: parseInt(event.target.value, 10),
        orderBy,
        order,
      }),
    );
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth='sm'
      open={openCreateUpdatePurchase}
      onClose={handleCloseCreateOrEditPurchase}
    >
      <DialogTitle id='max-width-dialog-title'>Relationships</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          {/* <MUIDataTable
              title='All Relationships'
              data={tableStructure}
              columns={columns}
              options={options}
            /> */}
          <CustomTable
            tableTitle='All Relationships'
            order={order}
            orderBy={orderBy}
            requestSort={handleRequestSort}
            headCells={headCells}
            rows={rows}
            totalCount={totalCount}
            pageNo={pageNo}
            rowsPerPage={rowsPerPage}
            changePage={handleChangePage}
            changeRowsPerPage={handleChangeRowsPerPage}
            size='medium'
          />
        </TableContainer>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default RelationshipModal;
