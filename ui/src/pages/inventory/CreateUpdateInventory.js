import React from 'react';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { purchaseItems } from '../../mocks/tableItems';

const CreateUpdateInventory = () => {
  return (
    <>
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
        id='date'
        name='date'
        label='Date'
        type='date'
        margin='normal'
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
};

export default CreateUpdateInventory;
