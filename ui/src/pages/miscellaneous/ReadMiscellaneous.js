import { useEffect, useState } from 'react';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateMiscellaneous from './CreateUpdateMiscellaneous';
import { miscellaneousItems } from '../../mocks/tableItems';

const ReadMiscellaneous = () => {
  // On Load
  useEffect(() => {
    document.title = `Miscellaneous | ${process.env.REACT_APP_NAME}`;
  }, []);

  // Local
  const [
    openCreateUpdateMiscellaneous,
    setOpenCreateUpdateMiscellaneous,
  ] = useState(false);
  const [valueForm, setValueForm] = useState(null);

  const handleOpenCreateMiscellaneous = () => {
    setOpenCreateUpdateMiscellaneous(true);
  };

  const handleOpenEditMiscellaneous = (values) => {
    setValueForm(values);
    setOpenCreateUpdateMiscellaneous(true);
  };

  const handleCloseCreateOrEditMiscellaneous = () => {
    setValueForm(null);
    setOpenCreateUpdateMiscellaneous(false);
  };

  const handleSubmitCreateUpdateMiscellaneous = (values) => {
    const IDExists = values.hasOwnProperty('id');
    if (IDExists) {
      console.log('Update');
    } else {
      console.log('Create ');
    }
    handleCloseCreateOrEditMiscellaneous();
  };

  const handleSubmitDeleteMiscellaneous = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete miscellaneous ${name}?`,
    );
    if (result) {
      console.log('Delete');
    }
  };

  // Rows
  let tableStructure = [];
  if (miscellaneousItems) {
    tableStructure = miscellaneousItems.map((miscellaneous, idx) => {
      return [
        miscellaneous.id ? miscellaneous.id : idx + 1,
        miscellaneous.description ? miscellaneous.description : 'Not Specified',
        miscellaneous.price ? miscellaneous.price : 'Not Specified',
        miscellaneous.date ? miscellaneous.date : 'Not Specified',
        {
          id: miscellaneous.id,
          description: miscellaneous.description,
          price: miscellaneous.price,
          date: miscellaneous.date || null,
        },
      ];
    });
  }

  // Columns
  const columns = ['SNo.', 'Description', 'Price', 'Date'];

  columns.push({
    name: 'Actions',
    options: {
      customBodyRender: (value) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenEditMiscellaneous(value)}
              color='primary'
              aria-label='create-edit-miscellaneous'
              component='span'
              size='small'
            >
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              onClick={() =>
                handleSubmitDeleteMiscellaneous(value.id, value.name)
              }
              color='primary'
              aria-label='delete-miscellaneous'
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
        title={'Miscellaneous'}
        button={
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            onClick={handleOpenCreateMiscellaneous}
          >
            Add Miscellaneous
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title='All Miscellaneous'
            data={tableStructure}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth='xs'
        open={openCreateUpdateMiscellaneous}
        handleClose={handleCloseCreateOrEditMiscellaneous}
        title={`${valueForm ? 'Edit' : 'Create'} Miscellaneous`}
        handleSubmit={handleSubmitCreateUpdateMiscellaneous}
        initialValues={valueForm}
      >
        <CreateUpdateMiscellaneous initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadMiscellaneous;
