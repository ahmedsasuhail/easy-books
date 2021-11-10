import React from 'react';
import { Field } from 'react-final-form';

import Input from '../../components/Input/Input';

const CreateUpdateRelationship = () => {
  const required = (value) => (value ? undefined : 'Required');

  return (
    <>
      <Field
        component={Input}
        id='name'
        name='name'
        label='Name'
        type='text'
        margin='normal'
        fullWidth
        autoFocus
        required
        validate={required}
      />
      <Field
        component={Input}
        id='phone_number'
        name='phone_number'
        label='Phone No'
        type='tel'
        margin='normal'
        fullWidth
        required
        validate={required}
      />
      <Field
        component={Input}
        id='address'
        name='address'
        label='Address'
        type='text'
        margin='normal'
        fullWidth
        multiline={true}
        rows={3}
        rowsMax={3}
      />
    </>
  );
};

export default CreateUpdateRelationship;
