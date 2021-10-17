import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateSales from './CreateUpdateSales';

import { salesCreateUpdate, salesDelete } from '../../store/actions/sales';
import { inventoryPurchaseActions } from '../../store/actions/inventory_purchase/inventoryPurchaseActions';

import { formattedDate } from '../../utils/helpers';

const ReadSales = () => {
  const dispatch = useDispatch();
  const salesItems = useSelector((state) => state.sales.sales);
  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.sales.formLoading);

  useEffect(() => {
    document.title = `Sales | ${process.env.REACT_APP_NAME}`;
  }, []);

  const [openCreateUpdateSales, setOpenCreateUpdateSales] = useState(false);
  const [valueForm, setValueForm] = useState(null);

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
    dispatch(salesCreateUpdate({ formValues, token }));
    handleCloseCreateOrEditSales();
  };

  const handleSubmitDeleteSales = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete sales ${id}?`,
    );
    if (result) {
      dispatch(salesDelete({ id, token }));
    }
  };

  // Rows
  let tableStructure = [];
  if (salesItems) {
    tableStructure = salesItems.map((sales, idx) => {
      const salesDate = new Date(sales.date).toISOString().split('T')[0];
      return [
        idx + 1,
        sales.purchases.id
          ? `${sales.purchases.company_name} - ${sales.purchases.vehicle_name}`
          : 'Not Specified',
        sales.inventory.id ? sales.inventory.part_name : 'Not Specified',
        sales.price ? sales.price : 'Not Specified',
        sales.relationships.id ? sales.relationships.name : 'Not Specified',
        sales.date ? formattedDate(sales.date) : 'Not Specified',
        {
          id: sales.id,
          purchase_id: sales.purchases.id,
          inventory_id: sales.inventory.id,
          price: sales.price,
          relationship_id: sales.relationships.id,
          date: salesDate || null,
        },
      ];
    });
  }

  // Columns
  const columns = [
    'SN',
    'Purchase Name',
    'Part Name',
    'Price',
    'Buyer',
    'Date',
  ];

  columns.push({
    name: 'Actions',
    options: {
      customBodyRender: (value) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenEditSales(value)}
              color='primary'
              aria-label='create-edit-sales'
              component='span'
              size='small'
            >
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              onClick={() => handleSubmitDeleteSales(value.id, value.name)}
              color='primary'
              aria-label='delete-sales'
              component='span'
              size='small'
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </>
        );
      },
    },
  });

  // Config
  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    selectableRows: 'none',
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15],
    textLabels: {
      pagination: {
        rowsPerPage: 'Total Items Per Page',
      },
    },
  };

  return (
    <>
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
          <MUIDataTable
            title='All Sales'
            data={tableStructure}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={openCreateUpdateSales}
        handleClose={handleCloseCreateOrEditSales}
        title={`${valueForm ? 'Edit' : 'Create'} Sales`}
        handleSubmit={handleSubmitCreateUpdateSales}
        initialValues={valueForm}
        isLoading={isLoading}
      >
        <CreateUpdateSales />
      </Dialog>
    </>
  );
};

export default ReadSales;
