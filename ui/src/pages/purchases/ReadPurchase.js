import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, makeStyles } from '@material-ui/core';
import Box from '@mui/material/Box';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CustomTable from '../../components/Table/CustomTable';

import CreateUpdatePurchase from './CreateUpdatePurchase';

import {
  purchaseCreate,
  purchaseRead,
  purchaseUpdate,
  purchaseDelete,
} from '../../store/actions/purchase';

import { formattedDate } from '../../utils/helpers';

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
  const pageNo = useSelector((state) => state.purchase.pageNo);
  const rowsPerPage = useSelector((state) => state.purchase.rowsPerPage);
  const orderBy = useSelector((state) => state.purchase.orderBy);
  const order = useSelector((state) => state.purchase.order);
  const totalCount = useSelector((state) => state.purchase.count);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    dispatch(
      purchaseRead({
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
      purchaseRead({
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
      purchaseRead({
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

const ReadPurchase = (props) => {
  let rows = [];
  const headCells = [
    {
      id: 'sn',
      label: 'SN',
      disableSort: true,
    },
    {
      id: 'relationship_id',
      display: false,
    },
    {
      id: 'company_name',
      label: 'Company Name',
    },
    {
      id: 'vehicle_name',
      label: 'Vehicle Name',
    },
    {
      id: 'price',
      label: 'Price',
    },
    {
      id: 'seller',
      label: 'Seller',
      disableSort: true,
    },
    {
      id: 'date',
      label: 'Date',
    },
  ];

  const dispatch = useDispatch();

  const classes = useStyles();

  const [openCreateUpdatePurchase, setOpenCreateUpdatePurchase] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  const token = useSelector((state) => state.user.token);
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const pageNo = useSelector((state) => state.purchase.pageNo);
  const rowsPerPage = useSelector((state) => state.purchase.rowsPerPage);
  const isLoading = useSelector((state) => state.purchase.formLoading);

  if (purchaseItems) {
    rows = purchaseItems.map((purchase, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: purchase.id,
        relationship_id: purchase.relationships.id,
        company_name: purchase.company_name
          ? purchase.company_name
          : 'Not Specified',
        vehicle_name: purchase.vehicle_name
          ? purchase.vehicle_name
          : 'Not Specified',
        price: purchase.price ? purchase.price : 'Not Specified',
        seller: purchase.relationships.id
          ? purchase.relationships.name
          : 'Not Specified',
        date: purchase.date ? formattedDate(purchase.date) : 'Not Specified',
      };
    });
  }

  useEffect(() => {
    document.title = `Purchases | ${process.env.REACT_APP_NAME}`;
  }, []);

  const handleOpenCreatePurchase = () => {
    setOpenCreateUpdatePurchase(true);
  };

  const handleOpenEditPurchase = (values) => {
    setValueForm(values);
    setOpenCreateUpdatePurchase(true);
  };

  const handleCloseCreateOrEditPurchase = () => {
    setValueForm(null);
    setOpenCreateUpdatePurchase(false);
  };

  const handleSubmitCreateUpdatePurchase = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    if (formValues.id) {
      dispatch(purchaseUpdate({ formValues, token }));
    } else {
      dispatch(purchaseCreate({ formValues, token }));
    }
    handleCloseCreateOrEditPurchase();
  };

  const handleSubmitDeletePurchase = (id) => {
    const result = window.confirm(
      `Are you sure you want to delete this purchase item?`,
    );
    if (result) {
      dispatch(purchaseDelete({ id, token }));
    }
  };

  return (
    <>
      <Box className={classes.pageContainer}>
        <PageTitle
          title={'Purchases'}
          button={
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              onClick={handleOpenCreatePurchase}
            >
              Add Purchase
            </Button>
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomMuiTable
              headCells={headCells}
              rows={rows}
              openEditFunction={handleOpenEditPurchase}
              submitDeleteFunction={handleSubmitDeletePurchase}
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        title={`${valueForm ? 'Edit' : 'Create'} Purchase`}
        fullWidth={true}
        maxWidth='xs'
        initialValues={valueForm}
        isLoading={isLoading}
        open={openCreateUpdatePurchase}
        handleClose={handleCloseCreateOrEditPurchase}
        handleSubmit={handleSubmitCreateUpdatePurchase}
      >
        <CreateUpdatePurchase />
      </Dialog>
    </>
  );
};

export default ReadPurchase;
