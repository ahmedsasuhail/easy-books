import React from "react";

import { TextField } from "@material-ui/core/";

const Select = (props) => {
  return (
    <TextField
      {...props.input}
      value={props.input.value}
      className={props.className}
      label={props.label}
      required={props.required}
      margin={props.margin}
      fullWidth={props.fullWidth}
      autoFocus={props.autoFocus}
      variant={props.variant}
      id={props.id}
      name={props.name}
      disabled={props.disabled}
      select
      SelectProps={{
        native: true,
      }}
      InputLabelProps={props.InputLabelProps}
      onChange={(e) => {
        props.input.onChange(e);
        props.onChange && props.onChange(e);
      }}
    >
      {props.hasEmptyOption && <option value="" />}
      {props.options
        ? props.options.map((item, index) => {
            return (
              <option key={index} value={item.id}>
                {item.name
                  ? item.name
                  : item.part_name
                  ? item.part_name
                  : item.company_name
                  ? `${item.company_name} - ${item.vehicle_name}`
                  : ""}
              </option>
            );
          })
        : ""}
    </TextField>
  );
};

export default Select;
