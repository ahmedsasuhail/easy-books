import React from 'react';
import { Field } from 'react-final-form';

import Input from '../../components/Input/Input';

const CreateUpdateMiscellaneous = () => {
  const required = (value) => (value ? undefined : 'Required');

  return (
    <>
      <Field
        component={Input}
        id='description'
        name='description'
        label='Description'
        type='text'
        margin='normal'
        fullWidth
        multiline={true}
        minRows={3}
        maxRows={3}
        autoFocus
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

export default CreateUpdateMiscellaneous;
