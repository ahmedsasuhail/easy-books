import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';

import CreateUpdateInventory from './CreateUpdateInventory';

import {
  inventoryCreateUpdate,
  inventoryDelete,
} from '../../store/actions/inventory';

import { formattedDate } from '../../utils/helpers';

const ReadInventory = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.inventory.formLoading);
  const inventoryItems = useSelector((state) => state.inventory.inventory);

  useEffect(() => {
    document.title = `Inventory | ${process.env.REACT_APP_NAME}`;
  }, []);

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

  const handleSubmitCreateUpdateInventory = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    dispatch(inventoryCreateUpdate({ formValues, token }));
    handleCloseCreateOrEditInventory();
  };

  const handleSubmitDeleteInventory = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete inventory ${id}?`,
    );
    if (result) {
      dispatch(inventoryDelete({ id, token }));
    }
  };

  // Rows
  let tableStructure = [];
  if (inventoryItems) {
    tableStructure = inventoryItems.map((inventory, idx) => {
      const inventoryDate = new Date(inventory.date)
        .toISOString()
        .split('T')[0];
      return [
        idx + 1,
        inventory.purchases.id
          ? `${inventory.purchases.company_name} - ${inventory.purchases.vehicle_name}`
          : 'Not Specified',
        inventory.part_name ? inventory.part_name : 'Not Specified',
        inventory.quantity ? inventory.quantity : 'Not Specified',
        inventory.date ? formattedDate(inventory.date) : 'Not Specified',
        {
          id: inventory.id,
          purchase_id: inventory.purchases.id,
          part_name: inventory.part_name,
          quantity: inventory.quantity,
          date: inventoryDate || null,
        },
      ];
    });
  }

  // Columns
  const columns = ['SN', 'Purchase Name', 'Part Name', 'Quantity', 'Date'];

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
        isLoading={isLoading}
      >
        <CreateUpdateInventory initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadInventory;
