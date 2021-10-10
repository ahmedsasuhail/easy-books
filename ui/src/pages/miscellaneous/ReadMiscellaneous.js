import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateMiscellaneous from './CreateUpdateMiscellaneous';

import {
  miscellaneousCreateUpdate,
  miscellaneousDelete,
} from '../../store/actions/miscellaneous';

import { formattedDate } from '../../utils/helpers';

const ReadMiscellaneous = () => {
  const dispatch = useDispatch();
  const miscellaneousItems = useSelector(
    (state) => state.miscellaneous.miscellaneous,
  );
  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.miscellaneous.formLoading);

  // On Load
  useEffect(() => {
    document.title = `Miscellaneous | ${process.env.REACT_APP_NAME}`;
  }, []);

  // Local
  const [openCreateUpdateMiscellaneous, setOpenCreateUpdateMiscellaneous] =
    useState(false);
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

  const handleSubmitCreateUpdateMiscellaneous = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    dispatch(miscellaneousCreateUpdate({ formValues, token }));
    handleCloseCreateOrEditMiscellaneous();
  };

  const handleSubmitDeleteMiscellaneous = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete miscellaneous ${id}?`,
    );
    if (result) {
      dispatch(miscellaneousDelete({ id, token }));
    }
  };

  // Rows
  let tableStructure = [];
  if (miscellaneousItems) {
    tableStructure = miscellaneousItems.map((miscellaneous, idx) => {
      const miscellaneousDate = new Date(miscellaneous.date)
        .toISOString()
        .split('T')[0];
      return [
        idx + 1,
        miscellaneous.description ? miscellaneous.description : 'Not Specified',
        miscellaneous.price ? miscellaneous.price : 'Not Specified',
        miscellaneous.date
          ? formattedDate(miscellaneous.date)
          : 'Not Specified',
        {
          id: miscellaneous.id,
          description: miscellaneous.description,
          price: miscellaneous.price,
          date: miscellaneousDate || null,
        },
      ];
    });
  }

  // Columns
  const columns = ['SN', 'Description', 'Price', 'Date'];

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
        isLoading={isLoading}
      >
        <CreateUpdateMiscellaneous initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadMiscellaneous;
