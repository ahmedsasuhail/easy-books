import { useEffect, useState } from 'react';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateContact from './CreateUpdateContact';
import { contactItems } from '../../mocks/tableItems';

const ReadContact = () => {
  // On Load
  useEffect(() => {
    document.title = `Contacts | ${process.env.REACT_APP_NAME}`;
  }, []);

  // Local
  const [openCreateUpdateContact, setOpenCreateUpdateContact] = useState(false);
  const [valueForm, setValueForm] = useState(null);

  const handleOpenCreateContact = () => {
    setOpenCreateUpdateContact(true);
  };

  const handleOpenEditContact = (values) => {
    setValueForm(values);
    setOpenCreateUpdateContact(true);
  };

  const handleCloseCreateOrEditContact = () => {
    setValueForm(null);
    setOpenCreateUpdateContact(false);
  };

  const handleSubmitCreateUpdateContact = (values) => {
    const IDExists = values.hasOwnProperty('id');
    if (IDExists) {
      console.log('Update');
    } else {
      console.log('Create ');
    }
    handleCloseCreateOrEditContact();
  };

  const handleSubmitDeleteContact = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete contact ${name}?`,
    );
    if (result) {
      console.log('Delete');
    }
  };

  // Rows
  let tableStructure = [];
  if (contactItems) {
    tableStructure = contactItems.map((contact, idx) => {
      return [
        contact.id ? contact.id : idx + 1,
        contact.name ? contact.name : 'Not Specified',
        contact.phno ? contact.phno : 'Not Specified',
        contact.address ? contact.address : 'Not Specified',
        {
          id: contact.id,
          name: contact.name,
          phno: contact.phno,
          address: contact.address,
        },
      ];
    });
  }

  // Columns
  const columns = ['SNo.', 'Name', 'Phno', 'Address'];

  columns.push({
    name: 'Actions',
    options: {
      customBodyRender: (value) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenEditContact(value)}
              color='primary'
              aria-label='create-edit-contact'
              component='span'
              size='small'
            >
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              onClick={() => handleSubmitDeleteContact(value.id, value.name)}
              color='primary'
              aria-label='delete-contact'
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
        title={'Contacts'}
        button={
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            onClick={handleOpenCreateContact}
          >
            Add Contact
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title='All Contacts'
            data={tableStructure}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth='xs'
        open={openCreateUpdateContact}
        handleClose={handleCloseCreateOrEditContact}
        title={`${valueForm ? 'Edit' : 'Create'} Contact`}
        handleSubmit={handleSubmitCreateUpdateContact}
        initialValues={valueForm}
      >
        <CreateUpdateContact initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadContact;
