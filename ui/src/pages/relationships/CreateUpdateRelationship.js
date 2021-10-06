import React from 'react';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';

const CreateUpdateRelationship = () => {
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
        required
        autoFocus
      />
      <Field
        component={Input}
        id='phno'
        name='phno'
        label='Phone No'
        type='tel'
        margin='normal'
        fullWidth
        required
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
      />
    </>
  );
};

export default CreateUpdateRelationship;
