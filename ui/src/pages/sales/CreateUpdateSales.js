import React from 'react';
import { useSelector } from 'react-redux';
import { Field } from 'react-final-form';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// Components
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';

const checkBox = (props) => {
  return (
    <FormControlLabel
      control={<Checkbox size='small' id={props.id} color='primary' />}
      {...props.input}
      label={props.label}
      labelPlacement='top'
      checked={props.input.value}
    />
  );
};

const CreateUpdateSales = () => {
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const inventoryItems = useSelector((state) => state.inventory.inventory);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
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
      </Grid>
      <Grid item sm={6} xs={12}>
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
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          component={Select}
          options={relationshipItems}
          id='contact_id'
          name='contact_id'
          label='Buyer'
          margin='normal'
          hasEmptyOption={true}
          fullWidth
          required
        />
      </Grid>
      <Grid item sm={6} xs={12}>
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
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          component={checkBox}
          id='returned'
          name='returned'
          label='Returned *'
          required
        />
      </Grid>
      <Grid item sm={6} xs={12}>
        <Field
          component={Input}
          id='returned_date'
          name='returned_date'
          label='Returned Date'
          type='date'
          margin='normal'
          fullWidth
          defaultValue={new Date().toISOString().split('T')[0]}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
      </Grid>
    </Grid>
  );
};

export default CreateUpdateSales;
