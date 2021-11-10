import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Field, useFormState } from 'react-final-form';

import Button from '@mui/material/Button';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

import RelationshipModal from './RelationshipModal';

const CreateUpdatePurchase = () => {
  const formState = useFormState();

  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );

  const [relationshipId, setRelationshipId] = useState();
  const [relationshipName, setRelationshipName] = useState();
  const [openRelationshipModal, setOpenRelationshipModal] = useState(false);

  useEffect(() => {
    if (
      formState.values.id &&
      relationshipItems.length > 0 &&
      !relationshipId &&
      !relationshipName
    ) {
      setRelationshipId(formState.values.relationship_id);

      const items = relationshipItems.filter(
        (item) => item.id === formState.values.relationship_id,
      );

      if (items.length > 0) {
        setRelationshipName(items[0].name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipId]);

  const required = (value) => {
    return value ? undefined : 'Required';
  };

  const handleSetRelationshipName = (value) => {
    setRelationshipId(value.id);
    setRelationshipName(value.name);
    handleCloseRelationshipModal();
  };

  const handleCloseRelationshipModal = () => {
    setOpenRelationshipModal(false);
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
            onClick={() => setOpenRelationshipModal(true)}
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
      <RelationshipModal
        relationshipItems={relationshipItems}
        openRelationshipModal={openRelationshipModal}
        handleSetRelationshipName={handleSetRelationshipName}
        handleCloseRelationshipModal={handleCloseRelationshipModal}
      />
    </>
  );
};

export default CreateUpdatePurchase;
