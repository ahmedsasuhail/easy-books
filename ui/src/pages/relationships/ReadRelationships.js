import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, makeStyles } from '@material-ui/core';
import Box from '@mui/material/Box';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CustomTable from '../../components/Table/CustomTable';

import CreateUpdateRelationship from './CreateUpdateRelationship';

import {
  relationshipRead,
  relationshipCreate,
  relationshipUpdate,
  relationshipDelete,
} from '../../store/actions/relationship';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.up('lg')]: {
      width: '80%',
      margin: 'auto',
    },
  },
}));

export const CustomMuiTable = (props) => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const pageNo = useSelector((state) => state.relationship.pageNo);
  const rowsPerPage = useSelector((state) => state.relationship.rowsPerPage);
  const orderBy = useSelector((state) => state.relationship.orderBy);
  const order = useSelector((state) => state.relationship.order);
  const totalCount = useSelector((state) => state.relationship.count);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    dispatch(
      relationshipRead({
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
      relationshipRead({
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
      relationshipRead({
        token,
        pageNo,
        rowsPerPage: parseInt(event.target.value, 10),
        orderBy,
        order,
      }),
    );
  };

  useEffect(() => {
    handleChangePage(null, pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  return (
    <CustomTable
      tableTitle='All Purchases'
      pageNo={pageNo}
      rowsPerPage={rowsPerPage}
      order={order}
      orderBy={orderBy}
      headCells={props.headCells}
      rows={props.rows}
      totalCount={totalCount}
      requestSort={handleRequestSort}
      changePage={handleChangePage}
      changeRowsPerPage={handleChangeRowsPerPage}
      actions={true}
      openEditFunction={props.openEditFunction}
      submitDeleteFunction={props.submitDeleteFunction}
      submitAddFunction={props.submitAddFunction}
      size={props.submitAddFunction ? 'small' : 'medium'}
    />
  );
};

const ReadRelationship = () => {
  let rows = [];
  const headCells = [
    {
      id: 'sn',
      label: 'SN',
      disableSort: true,
    },
    {
      id: 'name',
      label: 'Name',
    },
    {
      id: 'phone_number',
      label: 'Phno',
    },
    {
      id: 'address',
      label: 'Address',
    },
  ];

  const dispatch = useDispatch();

  const classes = useStyles();

  const [openCreateUpdateRelationship, setOpenCreateUpdateRelationship] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  const token = useSelector((state) => state.user.token);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );
  const pageNo = useSelector((state) => state.relationship.pageNo);
  const rowsPerPage = useSelector((state) => state.relationship.rowsPerPage);
  const isLoading = useSelector((state) => state.relationship.formLoading);

  if (relationshipItems) {
    rows = relationshipItems.map((relationship, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: relationship.id,
        name: relationship.name ? relationship.name : 'Not Specified',
        phone_number: relationship.phone_number
          ? relationship.phone_number
          : 'Not Specified',
        address: relationship.address ? relationship.address : 'Not Specified',
      };
    });
  }

  useEffect(() => {
    document.title = `Relationships | ${process.env.REACT_APP_NAME}`;
  }, []);

  const handleOpenCreateRelationship = () => {
    setOpenCreateUpdateRelationship(true);
  };

  const handleOpenEditRelationship = (values) => {
    setValueForm(values);
    setOpenCreateUpdateRelationship(true);
  };

  const handleCloseCreateOrEditRelationship = () => {
    setValueForm(null);
    setOpenCreateUpdateRelationship(false);
  };

  const handleSubmitCreateUpdateRelationship = (formValues) => {
    if (formValues.id) {
      dispatch(relationshipUpdate({ formValues, token }));
    } else {
      dispatch(relationshipCreate({ formValues, token }));
    }
    handleCloseCreateOrEditRelationship();
  };

  const handleSubmitDeleteRelationship = (id) => {
    const result = window.confirm(
      `Are you sure you want to delete this relationship item?`,
    );
    if (result) {
      dispatch(relationshipDelete({ id, token }));
    }
  };

  return (
    <>
      <Box className={classes.pageContainer}>
        <PageTitle
          title={'Relationships'}
          button={
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              onClick={handleOpenCreateRelationship}
            >
              Add Relationship
            </Button>
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomMuiTable
              headCells={headCells}
              rows={rows}
              openEditFunction={handleOpenEditRelationship}
              submitDeleteFunction={handleSubmitDeleteRelationship}
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        title={`${valueForm ? 'Edit' : 'Create'} Relationship`}
        fullWidth={true}
        maxWidth='xs'
        initialValues={valueForm}
        isLoading={isLoading}
        open={openCreateUpdateRelationship}
        handleClose={handleCloseCreateOrEditRelationship}
        handleSubmit={handleSubmitCreateUpdateRelationship}
      >
        <CreateUpdateRelationship />
      </Dialog>
    </>
  );
};

export default ReadRelationship;
