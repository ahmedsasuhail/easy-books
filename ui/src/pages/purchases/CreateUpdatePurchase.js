import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Field, useFormState } from 'react-final-form';

import { IconButton } from '@material-ui/core';
import Button from '@mui/material/Button';
import { AddBox as AddBoxIcon } from '@material-ui/icons';
// import MUIDataTable from 'mui-datatables';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

const CreateUpdatePurchase = () => {
  const formState = useFormState();

  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );

  const [relationshipId, setRelationshipId] = useState();
  const [relationshipName, setRelationshipName] = useState();
  const [openCreateUpdatePurchase, setOpenCreateUpdatePurchase] =
    useState(false);

  useEffect(() => {
    if (formState.values && relationshipItems.length > 0) {
      setRelationshipId(formState.values.relationship_id);

      const items = relationshipItems.filter(
        (item) => item.id === formState.values.relationship_id,
      );
      if (items.length > 0) {
        setRelationshipName(items[0].name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRelationshipId]);

  const required = (value) => {
    return value ? undefined : 'Required';
  };

  const handleSetSellerName = (value) => {
    setRelationshipId(value.id);
    setRelationshipName(value.name);
    handleCloseCreateOrEditPurchase();
  };

  // let tableStructure = [];
  // if (relationshipItems) {
  //   tableStructure = relationshipItems.map((relationship) => {
  //     return [
  //       relationship.name ? relationship.name : 'Not Specified',
  //       relationship.phone_number ? relationship.phone_number : 'Not Specified',
  //       relationship.address ? relationship.address : 'Not Specified',
  //       {
  //         id: relationship.id,
  //         name: relationship.name,
  //         phone_number: relationship.phone_number,
  //         address: relationship.address,
  //       },
  //     ];
  //   });
  // }

  const columns = ['Name', 'Phno', 'Address'];

  columns.push({
    name: 'Action',
    options: {
      customBodyRender: (value) => {
        return (
          <IconButton
            onClick={() => handleSetSellerName(value)}
            color='primary'
            aria-label='create-edit-relationship'
            component='span'
            size='small'
          >
            <AddBoxIcon fontSize='small' />
          </IconButton>
        );
      },
    },
  });

  // const options = {
  //   filter: true,
  //   filterType: 'dropdown',
  //   responsive: 'standard',
  //   selectableRows: 'none',
  //   rowsPerPage: 5,
  //   rowsPerPageOptions: [5, 10, 15],
  //   textLabels: {
  //     pagination: {
  //       rowsPerPage: 'Total Items Per Page',
  //     },
  //   },
  // };

  const handleCloseCreateOrEditPurchase = () => {
    setOpenCreateUpdatePurchase(false);
  };

  return (
    <>
      <Field
        component={Input}
        id='company_name'
        name='company_name'
        label='Company Name'
        type='text'
        margin='normal'
        fullWidth
        autoFocus
        required
        validate={required}
      />
      <Field
        component={Input}
        id='vehicle_name'
        name='vehicle_name'
        label='Vehicle Name'
        type='text'
        margin='normal'
        fullWidth
        required
        validate={required}
      />
      <Field
        component={Input}
        id='price'
        name='price'
        label='Price'
        type='number'
        margin='normal'
        fullWidth
        required
        validate={required}
      />
      <Field
        component={Select}
        options={[{ id: relationshipId, name: relationshipName }]}
        id='relationship_id'
        name='relationship_id'
        label='Relationship Id'
        margin='normal'
        hasEmptyOption={true}
        disabled={!relationshipId}
        InputLabelProps={{
          shrink: !relationshipId ? false : true,
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
            onClick={() => setOpenCreateUpdatePurchase(true)}
            size='small'
            color='primary'
          >
            Add Seller
          </Button>
        )}
      </Field>
      <Field
        component={Input}
        id='date'
        name='date'
        label='Date'
        type='date'
        margin='normal'
        defaultValue={new Date().toISOString().split('T')[0]}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        required
        validate={required}
      />
    </>
  );
};

export default CreateUpdatePurchase;
