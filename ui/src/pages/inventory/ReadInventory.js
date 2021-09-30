import { useEffect, useState } from 'react';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateInventory from './CreateUpdateInventory';
import { inventoryItems, purchaseItems } from '../../mocks/tableItems';

const ReadInventory = () => {
  // On Load
  useEffect(() => {
    document.title = `Inventory | ${process.env.REACT_APP_NAME}`;
  }, []);

  // Local
  const [openCreateUpdateInventory, setOpenCreateUpdateInventory] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  const handleOpenCreateInventory = () => {
    setOpenCreateUpdateInventory(true);
  };

  const handleOpenEditInventory = (values) => {
    setValueForm(values);
    setOpenCreateUpdateInventory(true);
  };

  const handleCloseCreateOrEditInventory = () => {
    setValueForm(null);
    setOpenCreateUpdateInventory(false);
  };

  const handleSubmitCreateUpdateInventory = (values) => {
    const IDExists = values.hasOwnProperty('id');
    if (IDExists) {
      console.log('Update');
    } else {
      console.log('Create ');
    }
    handleCloseCreateOrEditInventory();
  };

  const handleSubmitDeleteInventory = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete inventory ${name}?`,
    );
    if (result) {
      console.log('Delete');
    }
  };

  // Rows
  let tableStructure = [];
  if (inventoryItems) {
    tableStructure = inventoryItems.map((inventory, idx) => {
      return [
        inventory.id ? inventory.id : idx + 1,
        inventory.purchase_id
          ? purchaseItems.map((item) => {
              return (
                item.id === inventory.purchase_id &&
                `${item.company_name} - ${item.vehicle_name}`
              );
            })
          : 'Not Specified',
        inventory.part_name ? inventory.part_name : 'Not Specified',
        inventory.quantity ? inventory.quantity : 'Not Specified',
        inventory.date ? inventory.date : 'Not Specified',
        {
          id: inventory.id,
          purchase_id: inventory.purchase_id,
          part_name: inventory.part_name,
          quantity: inventory.quantity,
          date: inventory.date,
        },
      ];
    });
  }

  // Columns
  const columns = ['SNo.', 'Purchase Name', 'Part Name', 'Quantity', 'Date'];

  columns.push({
    name: 'Actions',
    options: {
      customBodyRender: (value) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenEditInventory(value)}
              color='primary'
              aria-label='create-edit-inventory'
              component='span'
              size='small'
            >
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              onClick={() => handleSubmitDeleteInventory(value.id, value.name)}
              color='primary'
              aria-label='delete-inventory'
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
        title={'Inventory'}
        button={
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            onClick={handleOpenCreateInventory}
          >
            Add Inventory
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title='All Inventories'
            data={tableStructure}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth='xs'
        open={openCreateUpdateInventory}
        handleClose={handleCloseCreateOrEditInventory}
        title={`${valueForm ? 'Edit' : 'Create'} Inventory`}
        handleSubmit={handleSubmitCreateUpdateInventory}
        initialValues={valueForm}
      >
        <CreateUpdateInventory initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadInventory;
