import React from 'react';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';

const CreateUpdateMiscellaneous = () => {
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
        rows={3}
        rowsMax={3}
        autoFocus
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

export default CreateUpdateMiscellaneous;
