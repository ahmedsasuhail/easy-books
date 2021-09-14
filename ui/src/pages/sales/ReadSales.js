import { useEffect, useState } from 'react';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateSales from './CreateUpdateSales';
import {
  salesItems,
  purchaseItems,
  inventoryItems,
  contactItems,
} from '../../mocks/tableItems';

const ReadSales = () => {
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

  const handleSubmitCreateUpdateSales = (values) => {
    const IDExists = values.hasOwnProperty('id');
    if (IDExists) {
      console.log('Update');
    } else {
      console.log('Create ');
    }
    handleCloseCreateOrEditSales();
  };

  const handleSubmitDeleteSales = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete sales ${name}?`,
    );
    if (result) {
      console.log('Delete');
    }
  };

  // Rows
  let tableStructure = [];
  if (salesItems) {
    tableStructure = salesItems.map((sales, idx) => {
      return [
        sales.id ? sales.id : idx + 1,
        sales.purchase_id
          ? purchaseItems.map((item) => {
              return (
                item.id === sales.purchase_id &&
                `${item.company_name} - ${item.vehicle_name}`
              );
            })
          : 'Not Specified',
        sales.inventory_id
          ? inventoryItems.map((item) => {
              return item.id === sales.inventory_id && item.part_name;
            })
          : 'Not Specified',
        sales.price ? sales.price : 'Not Specified',
        sales.contact_id
          ? contactItems.map((item) => {
              return item.id === sales.contact_id && item.name;
            })
          : 'Not Specified',
        sales.date ? sales.date : 'Not Specified',
        <input type='checkbox' checked={sales.returned === 'true'} />,
        sales.returned_date ? sales.returned_date : '-',
        {
          id: sales.id,
          purchase_id: sales.purchase_id,
          inventory_id: sales.inventory_id,
          price: sales.price,
          contact_id: sales.contact_id,
          date: sales.date,
          returned: sales.returned,
          returned_date: sales.returned_date,
        },
      ];
    });
  }

  // Columns
  const columns = [
    'SNo.',
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
    jumpToPage: true,
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
        maxWidth='xs'
        open={openCreateUpdateSales}
        handleClose={handleCloseCreateOrEditSales}
        title={`${valueForm ? 'Edit' : 'Create'} Sales`}
        handleSubmit={handleSubmitCreateUpdateSales}
        initialValues={valueForm}
      >
        <CreateUpdateSales initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadSales;
