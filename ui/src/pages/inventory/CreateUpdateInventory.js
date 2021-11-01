import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Field, useFormState } from 'react-final-form';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from '@material-ui/core';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { AddBox as AddBoxIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

import { formattedDate } from '../../utils/helpers';

const CreateUpdateInventory = () => {
  const formState = useFormState();

  const purchaseItems = useSelector((state) => state.purchase.purchases);

  const [purchaseId, setPurchaseId] = useState();
  const [purchaseName, setPurchaseName] = useState();
  const [openCreateUpdateInventory, setOpenCreateUpdateInventory] =
    useState(false);

  useEffect(() => {
    if (formState.values && purchaseItems.length > 0) {
      setPurchaseId(formState.values.purchase_id);

      const items = purchaseItems.filter(
        (item) => item.id === formState.values.purchase_id,
      );
      if (items.length > 0) {
        setPurchaseName(`${items[0].company_name}-${items[0].vehicle_name}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPurchaseId]);

  const required = (value) => (value ? undefined : 'Required');

  const handleSetPurchaseName = (value) => {
    setPurchaseId(value.id);
    setPurchaseName(`${value.company_name}-${value.vehicle_name}`);
    handleCloseCreateOrEditInventory();
  };

  let tableStructure = [];
  if (purchaseItems) {
    tableStructure = purchaseItems.map((purchase) => {
      const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
      return [
        purchase.company_name ? purchase.company_name : 'Not Specified',
        purchase.vehicle_name ? purchase.vehicle_name : 'Not Specified',
        purchase.price ? purchase.price : 'Not Specified',
        purchase.relationships.id
          ? purchase.relationships.name
          : 'Not Specified',
        purchase.date ? formattedDate(purchase.date) : 'Not Specified',
        {
          id: purchase.id,
          company_name: purchase.company_name,
          vehicle_name: purchase.vehicle_name,
          price: purchase.price,
          relationship_id: +purchase.relationships.id,
          date: purchaseDate || null,
        },
      ];
    });
  }

  const columns = ['Company Name', 'Vehicle Name', 'Price', 'Seller', 'Date'];

  columns.push({
    name: 'Action',
    options: {
      customBodyRender: (value) => {
        return (
          <IconButton
            onClick={() => handleSetPurchaseName(value)}
            color='primary'
            aria-label='create-edit-purchase'
            component='span'
            size='small'
          >
            <AddBoxIcon fontSize='small' />
          </IconButton>
        );
      },
    },
  });

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

  const handleCloseCreateOrEditInventory = () => {
    setOpenCreateUpdateInventory(false);
  };

  return (
    <>
      {/* <Field
        component={Select}
        options={purchaseItems}
        id='purchase_id'
        name='purchase_id'
        label='Purchase Name'
        margin='normal'
        hasEmptyOption={true}
        fullWidth
        required
        validate={required}
      /> */}
      <Field
        component={Select}
        options={[{ id: purchaseId, name: purchaseName }]}
        id='purchase_id'
        name='purchase_id'
        label='Purchase Id'
        margin='normal'
        hasEmptyOption={true}
        disabled={!purchaseId}
        InputLabelProps={{
          shrink: !purchaseId ? false : true,
        }}
        oneOption={true}
        fullWidth
        required
        validate={required}
      />
      <Field>
        {() => (
          <Button
            variant='text'
            onClick={() => setOpenCreateUpdateInventory(true)}
            size='small'
            color='primary'
          >
            Add Purchase
          </Button>
        )}
      </Field>
      <Field
        component={Input}
        id='part_name'
        name='part_name'
        label='Part Name'
        type='text'
        margin='normal'
        fullWidth
        autoFocus
        required
        validate={required}
      />
      <Field
        component={Input}
        id='quantity'
        name='quantity'
        label='Quantity'
        type='number'
        margin='normal'
        fullWidth
        required
        validate={required}
      />
      <Field
        component={Input}
        id='date'
        name='date'
        label='Date'
        type='date'
        margin='normal'
        fullWidth
        defaultValue={new Date().toISOString().split('T')[0]}
        InputLabelProps={{
          shrink: true,
        }}
        required
        validate={required}
      />
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={openCreateUpdateInventory}
        onClose={handleCloseCreateOrEditInventory}
      >
        <DialogTitle id='max-width-dialog-title'>Purchases</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <MUIDataTable
              title='All Purchases'
              data={tableStructure}
              columns={columns}
              options={options}
            />
          </TableContainer>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </>
  );
};

export default CreateUpdateInventory;
