import React from 'react';
import { TextField } from '@material-ui/core';

// Styles
import useStyles from './inputStyles';

const Input = (props) => {
  var classes = useStyles();

  return (
    <TextField
      {...props.input}
      type={props.input.type}
      variant={props.variant}
      className={props.className}
      margin={props.margin}
      fullWidth={props.fullWidth}
      id={props.id}
      label={props.label}
      placeholder={props.placeholder}
      disabled={props.disabled}
      autoFocus={props.autoFocus}
      required={props.required}
      InputProps={{
        classes: {
          underline: classes.textFieldUnderline,
          input: classes.textField,
        },
      }}
      InputLabelProps={props.InputLabelProps}
      multiline={props.multiline}
      rows={props.rows}
      rowsMax={props.rowsMax}
      error={props.error}
    />
  );
};

export default Input;
