import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import MUIDataTable from 'mui-datatables';

import PageTitle from '../../components/PageTitle/PageTitle';
import Dialog from '../../components/Dialog/Dialog';
import CreateUpdatePurchase from './CreateUpdatePurchase';

import {
  purchaseCreateUpdate,
  purchaseDelete,
} from '../../store/actions/purchase';

import { formattedDate } from '../../utils/helpers';

const ReadPurchase = (props) => {
  const dispatch = useDispatch();
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const token = useSelector((state) => state.user.token);
  const isLoading = useSelector((state) => state.relationship.formLoading);

  // On Load
  useEffect(() => {
    document.title = `Purchases | ${process.env.REACT_APP_NAME}`;
  }, []);

  // Local
  const [openCreateUpdatePurchase, setOpenCreateUpdatePurchase] =
    useState(false);
  const [valueForm, setValueForm] = useState(null);

  const handleOpenCreatePurchase = () => {
    setOpenCreateUpdatePurchase(true);
  };

  const handleOpenEditPurchase = (values) => {
    setValueForm(values);
    setOpenCreateUpdatePurchase(true);
  };

  const handleCloseCreateOrEditPurchase = () => {
    setValueForm(null);
    setOpenCreateUpdatePurchase(false);
  };

  const handleSubmitCreateUpdatePurchase = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    dispatch(purchaseCreateUpdate({ formValues, token }));
    handleCloseCreateOrEditPurchase();
  };

  const handleSubmitDeletePurchase = (id, name) => {
    const result = window.confirm(
      `Are you sure you want to delete purchase ${id}?`,
    );
    if (result) {
      dispatch(purchaseDelete({ id, token }));
    }
  };

  // Rows
  let tableStructure = [];
  if (purchaseItems) {
    tableStructure = purchaseItems.map((purchase, idx) => {
      const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
      return [
        idx + 1,
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

  // Columns
  const columns = [
    'SN',
    'Company Name',
    'Vehicle Name',
    'Price',
    'Seller',
    'Date',
  ];

  columns.push({
    name: 'Actions',
    options: {
      customBodyRender: (value) => {
        return (
          <>
            <IconButton
              onClick={() => handleOpenEditPurchase(value)}
              color='primary'
              aria-label='create-edit-purchase'
              component='span'
              size='small'
            >
              <EditIcon fontSize='small' />
            </IconButton>
            <IconButton
              onClick={() => handleSubmitDeletePurchase(value.id, value.name)}
              color='primary'
              aria-label='delete-purchase'
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
    searchText: props.location && props.location.search.slice(1),
  };

  return (
    <>
      <PageTitle
        title={'Purchases'}
        button={
          <Button
            variant='outlined'
            size='medium'
            color='secondary'
            onClick={handleOpenCreatePurchase}
          >
            Add Purchase
          </Button>
        }
      />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title='All Purchases'
            data={tableStructure}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        fullWidth={true}
        maxWidth='xs'
        open={openCreateUpdatePurchase}
        handleClose={handleCloseCreateOrEditPurchase}
        title={`${valueForm ? 'Edit' : 'Create'} Purchase`}
        handleSubmit={handleSubmitCreateUpdatePurchase}
        initialValues={valueForm}
        isLoading={isLoading}
      >
        <CreateUpdatePurchase initialValues={valueForm} />
      </Dialog>
    </>
  );
};

export default ReadPurchase;
