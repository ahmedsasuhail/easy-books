import React from 'react';
import { Field } from 'react-final-form';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import {
  contactItems,
  purchaseItems,
  inventoryItems,
} from '../../mocks/tableItems';

const returnOptions = [
  { id: 'true', name: 'Yes' },
  { id: 'false', name: 'No' },
];

const CreateUpdateSales = () => {
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
        component={Select}
        options={inventoryItems}
        id='inventory_id'
        name='inventory_id'
        label='Part Name'
        margin='normal'
        hasEmptyOption={true}
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
        autofocus
      />
      <Field
        component={Select}
        options={contactItems}
        id='contact_id'
        name='contact_id'
        label='Buyer'
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
      <Field
        component={Select}
        options={returnOptions}
        id='returned'
        name='returned'
        label='Returned'
        margin='normal'
        hasEmptyOption={true}
        fullWidth
        required
      />
      <Field
        component={Input}
        id='returned_date'
        name='returned_date'
        label='Returned Date'
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

export default CreateUpdateSales;
