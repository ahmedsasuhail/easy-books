import React from "react";
import { Field } from "react-final-form";

import Input from "../../components/Input/Input";

import { validateFloat } from "../../utils/helpers";

const CreateUpdateMiscellaneous = () => {
  const required = (value) => (value ? undefined : "Required");
  const validateString = (maxValue) => (value) =>
    value && value.length <= maxValue ? undefined : "Invalid value";

  return (
    <>
      <Field
        component={Input}
        id="description"
        name="description"
        label="Description"
        type="text"
        margin="normal"
        fullWidth
        multiline={true}
        rows={3}
        minRows={3}
        maxRows={3}
        autoFocus
        required
        validate={validateString(250)}
      />
      <Field
        component={Input}
        id="price"
        name="price"
        label="Price"
        type="number"
        margin="normal"
        fullWidth
        required
        validate={validateFloat(8, 2)}
      />
      <Field
        component={Input}
        id="date"
        name="date"
        label="Date"
        type="date"
        margin="normal"
        fullWidth
        defaultValue={new Date().toISOString().split("T")[0]}
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
