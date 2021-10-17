import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Field } from 'react-final-form';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

import { getInventoryPurchase } from '../../store/actions/inventory_purchase';

const CreateUpdateSales = (props) => {
  const token = useSelector((state) => state.user.token);
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );
  const invId = useSelector((state) => state.inventoryPurchase.id);

  const dispatch = useDispatch();

  const required = (value) => (value ? undefined : 'Required');

  const something = (e) => {
    dispatch(getInventoryPurchase({ id: e.target.value, token: token }));
  };

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
        onChange={something}
      />
      <Field
        component={Select}
        options={invId.records}
        id='inventory_id'
        name='inventory_id'
        label='Part Name'
        margin='normal'
        hasEmptyOption={true}
        fullWidth
        required
        validate={required}
        disabled={!invId.records}
      />
      <Field
        component={Select}
        options={relationshipItems}
        id='relationship_id'
        name='relationship_id'
        label='Buyer'
        margin='normal'
        hasEmptyOption={true}
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

export default CreateUpdateSales;
