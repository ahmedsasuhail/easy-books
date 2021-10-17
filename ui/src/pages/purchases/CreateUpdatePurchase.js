import React from 'react';
import { useSelector } from 'react-redux';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

const CreateUpdatePurchase = () => {
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );

  const required = (value) => (value ? undefined : 'Required');

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
        options={relationshipItems}
        id='relationship_id'
        name='relationship_id'
        label='Seller'
        margin='normal'
        hasEmptyOption={true}
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
    </>
  );
};

export default CreateUpdatePurchase;
