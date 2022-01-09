import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Field, useFormState } from "react-final-form";

import Button from "@mui/material/Button";

import Input from "../../components/Input/Input";

import RelationshipModal from "./RelationshipModal";

import { validateFloat } from "../../utils/helpers";

const CreateUpdatePurchase = () => {
  const formState = useFormState();

  const relationshipItems = useSelector(
    (state) => state.relationship.relationships
  );

  const [relationshipId, setRelationshipId] = useState();
  const [relationshipName, setRelationshipName] = useState();
  const [openRelationshipModal, setOpenRelationshipModal] = useState(false);

  useEffect(() => {
    if (
      formState.values.id &&
      relationshipItems.length > 0 &&
      !relationshipId &&
      !relationshipName
    ) {
      setRelationshipId(+formState.values.relationship_id);
      setRelationshipName(formState.values.seller);
      window.setFormValue("relationship_id", +formState.values.relationship_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipId]);

  const required = (value) => {
    return value ? undefined : "Required";
  };
  const validateString = (maxValue) => (value) =>
    value && value.length <= maxValue ? undefined : "Invalid value";

  const handleSetRelationshipName = (value) => {
    setRelationshipId(value.id);
    setRelationshipName(value.name);
    window.setFormValue("relationship_id", value.id);
    handleCloseRelationshipModal();
  };

  const handleCloseRelationshipModal = () => {
    setOpenRelationshipModal(false);
  };

  return (
    <>
      <Field
        component={Input}
        id="company_name"
        name="company_name"
        label="Company Name"
        type="text"
        margin="normal"
        fullWidth
        autoFocus
        required
        validate={validateString(100)}
      />
      <Field
        component={Input}
        id="vehicle_name"
        name="vehicle_name"
        label="Vehicle Name"
        type="text"
        margin="normal"
        fullWidth
        required
        validate={validateString(100)}
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
        id="relationship_id"
        name="relationship_id"
        type="hidden"
        margin="normal"
        required
        validate={required}
      />
      <p>
        Seller Name: <br />
        {relationshipName}
      </p>
      <Field>
        {() => (
          <Button
            variant="text"
            onClick={() => setOpenRelationshipModal(true)}
            size="small"
            color="primary"
          >
            Add Seller
          </Button>
        )}
      </Field>
      <Field
        component={Input}
        id="date"
        name="date"
        label="Date"
        type="date"
        margin="normal"
        defaultValue={new Date().toISOString().split("T")[0]}
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        required
        validate={required}
      />
      <RelationshipModal
        relationshipItems={relationshipItems}
        openRelationshipModal={openRelationshipModal}
        handleSetRelationshipName={handleSetRelationshipName}
        handleCloseRelationshipModal={handleCloseRelationshipModal}
      />
    </>
  );
};

export default CreateUpdatePurchase;
