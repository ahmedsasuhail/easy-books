import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdateRelationship from './CreateUpdateRelationship';

import {
  relationshipCreate,
  relationshipUpdate,
  relationshipDelete,
} from '../../store/actions/relationship';

const ReadRelationship = () => {
  const dispatch = useDispatch();
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );
  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.relationship.formLoading);

  const [openCreateUpdateRelationship, setOpenCreateUpdateRelationship] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  useEffect(() => {
    document.title = `Relationships | ${process.env.REACT_APP_NAME}`;
  }, []);

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
    if (formValues.id) {
      dispatch(relationshipUpdate({ formValues, token }));
    } else {
      dispatch(relationshipCreate({ formValues, token }));
    }
    handleCloseCreateOrEditRelationship();
  };

  const handleSubmitDeleteRelationship = (id) => {
    const result = window.confirm(
      `Are you sure you want to delete this relationship item?`,
    );
    if (result) {
      dispatch(relationshipDelete({ id, token }));
    }
  };

  // Rows
  let tableStructure = [];
  if (relationshipItems) {
    tableStructure = relationshipItems.map((relationship, idx) => {
      return [
        idx + 1,
        relationship.name ? relationship.name : 'Not Specified',
        relationship.phone_number ? relationship.phone_number : 'Not Specified',
        relationship.address ? relationship.address : 'Not Specified',
        {
          id: relationship.id,
          name: relationship.name,
          phone_number: relationship.phone_number,
          address: relationship.address,
        },
      ];
    });
  }

  // Columns
  const columns = ['SN', 'Name', 'Phno', 'Address'];

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
