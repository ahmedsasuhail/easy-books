import React from 'react';
import { useSelector } from 'react-redux';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

const CreateUpdateInventory = () => {
  const purchaseItems = useSelector((state) => state.purchase.purchases);

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
      />
      <Field
        component={Input}
        id='part_name'
        name='part_name'
        label='Part Name'
        type='text'
        margin='normal'
        fullWidth
        required
        autoFocus
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
      />
    </>
  );
};

export default CreateUpdateInventory;
