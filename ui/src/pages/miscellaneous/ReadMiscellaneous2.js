import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Grid, Button } from '@material-ui/core';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';

import CustomTable from '../../components/Table/Table2';

import { formattedDate } from '../../utils/helpers';

import CreateUpdateMiscellaneous from './CreateUpdateMiscellaneous';
import {
  miscellaneousRead,
  miscellaneousCreateUpdate,
  miscellaneousDelete,
} from '../../store/actions/miscellaneous';

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'SN',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
];

const ReadMiscellaneous = () => {
  let rows = [];
  const dispatch = useDispatch();

  const [openCreateUpdateMiscellaneous, setOpenCreateUpdateMiscellaneous] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  const miscellaneousItems = useSelector(
    (state) => state.miscellaneous.miscellaneous,
  );
  const isLoading = useSelector((state) => state.miscellaneous.formLoading);
  const totalCount = useSelector((state) => state.miscellaneous.count);
  const token = useSelector((state) => state.user.token);

  if (miscellaneousItems) {
    rows = miscellaneousItems.map((miscellaneous, idx) => {
      return {
        id: miscellaneous.id ? miscellaneous.id : idx + 1,
        description: miscellaneous.description
          ? miscellaneous.description
          : 'Not Specified',
        price: miscellaneous.price ? miscellaneous.price : 'Not Specified',
        date: miscellaneous.date
          ? formattedDate(miscellaneous.date)
          : 'Not Specified',
      };
    });
  }

  useEffect(() => {
    document.title = `Miscellaneous | ${process.env.REACT_APP_NAME}`;
  }, []);

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
    dispatch(
      miscellaneousCreateUpdate({
        formValues,
        token,
      }),
    );
    handleCloseCreateOrEditMiscellaneous();
  };

  const handleSubmitDeleteMiscellaneous = (id) => {
    const result = window.confirm(
      `Are you sure you want to delete this miscellaneous item?`,
    );
    if (result) {
      dispatch(
        miscellaneousDelete({
          id,
          token,
        }),
      );
    }
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
          <CustomTable
            tableTitle='All Miscellaneous'
            miscellaneousRead={miscellaneousRead}
            headCells={headCells}
            rows={rows}
            totalCount={totalCount}
            token={token}
            openEditMiscellaneous={handleOpenEditMiscellaneous}
            submitDeleteMiscellaneous={handleSubmitDeleteMiscellaneous}
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
