import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';
import Checkbox from '@material-ui/core/Checkbox';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateSales from './CreateUpdateSales';

import { salesCreateUpdate, salesDelete } from '../../store/actions/sales';

import { formattedDate } from '../../utils/helpers';

const ReadSales = () => {
  const dispatch = useDispatch();
  const salesItems = useSelector((state) => state.sales.sales);
  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.sales.formLoading);

  // On Load
  useEffect(() => {
    document.title = `Sales | ${process.env.REACT_APP_NAME}`;
  }, []);

  // Local
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
        sales.purchase_id
          ? `${sales.purchases.company_name} - ${sales.purchases.vehicle_name}`
          : 'Not Specified',
        sales.inventory_id ? sales.inventory.part_name : 'Not Specified',
        sales.price ? sales.price : 'Not Specified',
        sales.relationship_id ? sales.relationship.name : 'Not Specified',
        sales.date ? formattedDate(sales.date) : 'Not Specified',
        <Checkbox color='primary' checked={sales.returned} />,
        sales.returned_date ? sales.returned_date : '-',
        {
          id: sales.id,
          purchase_id: sales.purchase_id,
          inventory_id: sales.inventory_id,
          price: sales.price,
          contact_id: sales.contact_id,
          date: salesDate || null,
          returned: sales.returned,
          returned_date: sales.returned_date,
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
    'Returned',
    'Returned Date',
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
        <CreateUpdateSales initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadSales;
