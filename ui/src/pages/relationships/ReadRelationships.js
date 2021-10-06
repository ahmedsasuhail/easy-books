import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateRelationship from './CreateUpdateRelationship';

import {
  relationshipRead,
  relationshipCreateUpdate,
  relationshipDelete,
} from '../../store/actions/relationship';

const ReadRelationship = () => {
  const dispatch = useDispatch();
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );
  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.relationship.loading);

  const handleReadRelationship = useCallback(() => {
    dispatch(relationshipRead({ token: token }));
  }, [dispatch, token]);

  // On Load
  useEffect(() => {
    document.title = `Relationships | ${process.env.REACT_APP_NAME}`;
    handleReadRelationship();
  }, [handleReadRelationship]);

  // Local
  const [openCreateUpdateRelationship, setOpenCreateUpdateRelationship] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  const handleOpenCreateRelationship = () => {
    setOpenCreateUpdateRelationship(true);
  };

  const handleOpenEditRelationship = (values) => {
    setValueForm(values);
    setOpenCreateUpdateRelationship(true);
  };

  const handleCloseCreateOrEditRelationship = () => {
    setValueForm(null);
    setOpenCreateUpdateRelationship(false);
  };

  const handleSubmitCreateUpdateRelationship = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    dispatch(relationshipCreateUpdate({ formValues, token }));
    handleCloseCreateOrEditRelationship();
  };

  const handleSubmitDeleteRelationship = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete relationship ${id}?`,
    );
    if (result) {
      dispatch(relationshipDelete({ id, token }));
    }
  };

  // Rows
  let tableStructure = [];
  if (relationshipItems) {
    tableStructure = relationshipItems.map((relationship, idx) => {
      const relationshipDate = new Date(relationship.Date)
        .toISOString()
        .split('T')[0];
      return [
        idx + 1,
        relationship.name ? relationship.name : 'Not Specified',
        relationship.phno ? relationship.phno : 'Not Specified',
        relationship.address ? relationship.address : 'Not Specified',
        relationship.Date ? relationshipDate : 'Not Specified',
        {
          id: relationship.id,
          name: relationship.name,
          phno: relationship.phno,
          address: relationship.address,
          date: relationshipDate || null,
        },
      ];
    });
  }

  // Columns
  const columns = ['SNo.', 'Name', 'Phno', 'Address', 'Date'];

  columns.push({
    name: 'Actions',
    options: {
      customBodyRender: (value) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenEditRelationship(value)}
              color='primary'
              aria-label='create-edit-relationship'
              component='span'
              size='small'
            >
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              onClick={() =>
                handleSubmitDeleteRelationship(value.id, value.name)
              }
              color='primary'
              aria-label='delete-relationship'
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
        title={'Relationships'}
        button={
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            onClick={handleOpenCreateRelationship}
          >
            Add Relationship
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title='All Relationships'
            data={tableStructure}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth='xs'
        open={openCreateUpdateRelationship}
        handleClose={handleCloseCreateOrEditRelationship}
        title={`${valueForm ? 'Edit' : 'Create'} Relationship`}
        handleSubmit={handleSubmitCreateUpdateRelationship}
        initialValues={valueForm}
        isLoading={isLoading}
      >
        <CreateUpdateRelationship initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadRelationship;
