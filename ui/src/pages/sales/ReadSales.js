import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Grid, Button, makeStyles } from '@material-ui/core';
import Box from '@mui/material/Box';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CustomTable from '../../components/Table/CustomTable';

import CreateUpdateSales from './CreateUpdateSales';

import {
  salesCreate,
  salesUpdate,
  salesDelete,
  salesRead,
} from '../../store/actions/sales';
import { inventoryPurchaseActions } from '../../store/actions/inventory_purchase/inventoryPurchaseActions';

import { formattedDate } from '../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.up('lg')]: {
      width: '80%',
      margin: 'auto',
    },
  },
}));

const ReadSales = () => {
  let rows = [];
  const headCells = [
    {
      id: 'sn',
      label: 'SN',
      disableSort: true,
    },
    {
      id: 'purchase_name',
      label: 'Purchase Name',
      disableSort: true,
    },
    {
      id: 'purchase_id',
      display: false,
    },
    {
      id: 'part_name',
      label: 'Part Name',
      disableSort: true,
    },
    {
      id: 'inventory_id',
      display: false,
    },
    {
      id: 'buyer',
      label: 'Buyer',
      disableSort: true,
    },
    {
      id: 'relationship_id',
      display: false,
    },
    {
      id: 'price',
      label: 'Price',
    },
    {
      id: 'date',
      label: 'Date',
    },
    {
      id: 'returned',
      label: 'Returned',
      checkbox: true,
      disableSort: true,
    },
    {
      id: 'credit',
      display: false,
    },
    {
      id: 'credit_name',
      label: 'Credit',
      disableSort: true,
    },
  ];

  const dispatch = useDispatch();

  const classes = useStyles();

  const [openCreateUpdateSales, setOpenCreateUpdateSales] = useState(false);
  const [valueForm, setValueForm] = useState(null);

  const token = useSelector((state) => state.user.token);
  const salesItems = useSelector((state) => state.sales.sales);
  const pageNo = useSelector((state) => state.sales.pageNo);
  const rowsPerPage = useSelector((state) => state.sales.rowsPerPage);
  const orderBy = useSelector((state) => state.sales.orderBy);
  const order = useSelector((state) => state.sales.order);
  const totalCount = useSelector((state) => state.sales.count);
  const isLoading = useSelector((state) => state.sales.formLoading);

  if (salesItems) {
    rows = salesItems.map((sale, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: sale.id,
        purchase_name: sale.purchases.id
          ? `${sale.purchases.company_name} - ${sale.purchases.vehicle_name}`
          : 'Not Specified',
        purchase_id: sale.purchases.id ? sale.purchases.id : 'Not Specified',
        part_name: sale.inventory.id
          ? sale.inventory.part_name
          : 'Not Specified',
        inventory_id: sale.inventory.id ? sale.inventory.id : 'Not Specified',
        buyer: sale.relationships.id
          ? sale.relationships.name
          : 'Not Specified',
        relationship_id: sale.relationships.id
          ? sale.relationships.id
          : 'Not Specified',
        price: sale.price ? sale.price : 'Not Specified',
        date: sale.date ? formattedDate(sale.date) : 'Not Specified',
        returned: sale.returned ? true : false,
        credit: sale.credit,
        credit_name: sale.credit ? 'Yes' : 'No',
      };
    });
  }

  useEffect(() => {
    document.title = `Sales | ${process.env.REACT_APP_NAME}`;
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    const direction = isAsc ? 'desc' : 'asc';
    dispatch(
      salesRead({
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
      salesRead({
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
      salesRead({
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

  const handleOpenCreateSales = () => {
    setOpenCreateUpdateSales(true);
  };

  const handleOpenEditSales = (values) => {
    setValueForm(values);
    setOpenCreateUpdateSales(true);
  };

  const handleCloseCreateOrEditSales = () => {
    setValueForm(null);
    setOpenCreateUpdateSales(false);
    dispatch(inventoryPurchaseActions.inventoryPurchaseClear());
  };

  const handleSubmitCreateUpdateSales = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    if (formValues.id) {
      dispatch(salesUpdate({ formValues, token }));
    } else {
      dispatch(salesCreate({ formValues, token }));
    }
    handleCloseCreateOrEditSales();
  };

  const handleSubmitDeleteSales = (id) => {
    const result = window.confirm(
      `Are you sure you want to delete this sales item?`,
    );
    if (result) {
      dispatch(salesDelete({ id, token }));
    }
  };

  const handleSubmitReturn = (value) => {
    const result = window.confirm(
      `Are you sure you want to return this sales item?`,
    );
    if (result) {
      value['returned'] = true;

      handleSubmitCreateUpdateSales(value);
    } else {
      return false;
    }
  };

  return (
    <>
      <Box className={classes.pageContainer}>
        <PageTitle
          title={'Sales'}
          button={
            <Button
              variant='outlined'
              size='medium'
              color='secondary'
              onClick={handleOpenCreateSales}
            >
              Add Sales
            </Button>
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomTable
              tableTitle='All Sales'
              pageNo={pageNo}
              rowsPerPage={rowsPerPage}
              order={order}
              orderBy={orderBy}
              headCells={headCells}
              rows={rows}
              totalCount={totalCount}
              requestSort={handleRequestSort}
              changePage={handleChangePage}
              changeRowsPerPage={handleChangeRowsPerPage}
              actions={true}
              openEditFunction={handleOpenEditSales}
              submitDeleteFunction={handleSubmitDeleteSales}
              submitReturnFunction={handleSubmitReturn}
              size='medium'
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        title={`${valueForm ? 'Edit' : 'Create'} Sales`}
        fullWidth={true}
        maxWidth='sm'
        initialValues={valueForm}
        isLoading={isLoading}
        open={openCreateUpdateSales}
        handleClose={handleCloseCreateOrEditSales}
        handleSubmit={handleSubmitCreateUpdateSales}
      >
        <CreateUpdateSales initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadSales;
