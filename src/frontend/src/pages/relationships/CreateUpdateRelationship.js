import React from "react";
import { Field } from "react-final-form";

import Input from "../../components/Input/Input";

const CreateUpdateRelationship = () => {
  const validateMaxString = (maxValue) => (value) =>
    value
      ? value.length <= maxValue
        ? undefined
        : "Invalid value"
      : undefined;
  const validateString = (maxValue) => (value) =>
    value && value.length <= maxValue ? undefined : "Invalid value";

  return (
    <>
      <Field
        component={Input}
        id="name"
        name="name"
        label="Name"
        type="text"
        margin="normal"
        fullWidth
        autoFocus
        required
        validate={validateString(100)}
      />
      <Field
        component={Input}
        id="phone_number"
        name="phone_number"
        label="Phone No"
        type="number"
        margin="normal"
        fullWidth
        required
        validate={validateString(10)}
      />
      <Field
        component={Input}
        id="address"
        name="address"
        label="Address"
        type="text"
        margin="normal"
        fullWidth
        multiline={true}
        rows={3}
        rowsMax={3}
        validate={validateMaxString(5)}
      />
    </>
  );
};

export default CreateUpdateRelationship;
