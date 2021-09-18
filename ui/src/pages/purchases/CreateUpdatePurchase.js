import React from 'react';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { contactItems } from '../../mocks/tableItems';

const CreateUpdatePurchase = () => {
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
        required
        autoFocus
      />
      <Field
        component={Select}
        options={contactItems}
        id='contact_id'
        name='contact_id'
        label='Seller'
        margin='normal'
        hasEmptyOption={true}
        fullWidth
        required
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

export default CreateUpdatePurchase;
