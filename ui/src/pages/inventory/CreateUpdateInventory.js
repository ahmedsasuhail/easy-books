import React from 'react';
import { useSelector } from 'react-redux';
import { Field } from 'react-final-form';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

const CreateUpdateInventory = () => {
  const purchaseItems = useSelector((state) => state.purchase.purchases);

  const required = (value) => (value ? undefined : 'Required');

  return (
    <>
      <Field
        component={Select}
        options={purchaseItems}
        id='purchase_id'
        name='purchase_id'
        label='Purchase Name'
        margin='normal'
        hasEmptyOption={true}
        fullWidth
        required
        validate={required}
      />
      <Field
        component={Input}
        id='part_name'
        name='part_name'
        label='Part Name'
        type='text'
        margin='normal'
        fullWidth
        autoFocus
        required
        validate={required}
      />
      <Field
        component={Input}
        id='quantity'
        name='quantity'
        label='Quantity'
        type='number'
        margin='normal'
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

export default CreateUpdateInventory;
