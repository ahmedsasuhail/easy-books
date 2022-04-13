import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Field, useFormState } from "react-final-form";

import Button from "@mui/material/Button";

import Input from "../../components/Input/Input";

import PurchasesModal from "./PurchasesModal";

const CreateUpdateInventory = () => {
  const formState = useFormState();

  const purchaseItems = useSelector((state) => state.purchase.purchases);

  const [purchaseId, setPurchaseId] = useState();
  const [purchaseName, setPurchaseName] = useState();
  const [openPurchasesModal, setOpenPurchasesModal] = useState(false);

  useEffect(() => {
    if (
      formState.values.id &&
      purchaseItems.length > 0 &&
      !purchaseId &&
      !purchaseName
    ) {
      setPurchaseId(+formState.values.purchase_id);
      setPurchaseName(formState.values.purchase_name);
      window.setFormValue("purchase_id", +formState.values.purchase_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseId]);

  const handleSetPurchaseName = (value) => {
    setPurchaseId(value.id);
    setPurchaseName(`${value.company_name} - ${value.vehicle_name}`);
    window.setFormValue("purchase_id", value.id);
    handleClosePurchasesModal();
  };

  const handleClosePurchasesModal = () => {
    setOpenPurchasesModal(false);
  };

  const required = (value) => (value ? undefined : "Required");
  const validateString = (maxValue) => (value) =>
    value && value.length <= maxValue ? undefined : "Invalid value";

  return (
    <>
      <Field
        component={Input}
        id="purchase_id"
        name="purchase_id"
        type="hidden"
        margin="normal"
        required
        validate={required}
      />
      <p>
        Purchase Name: <br />
        {purchaseName}
      </p>
      <Field>
        {() => (
          <Button
            variant="text"
            onClick={() => setOpenPurchasesModal(true)}
            size="small"
            color="primary"
          >
            Choose Purchase
          </Button>
        )}
      </Field>
      <Field
        component={Input}
        id="part_name"
        name="part_name"
        label="Part Name"
        type="text"
        margin="normal"
        fullWidth
        autoFocus
        required
        validate={validateString(100)}
      />
      <Field
        component={Input}
        id="quantity"
        name="quantity"
        label="Quantity"
        type="number"
        margin="normal"
        fullWidth
        required
        validate={required}
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
      <PurchasesModal
        purchaseId={purchaseId}
        purchaseItems={purchaseItems}
        openPurchasesModal={openPurchasesModal}
        handleSetPurchaseName={handleSetPurchaseName}
        handleClosePurchasesModal={handleClosePurchasesModal}
      />
    </>
  );
};

export default CreateUpdateInventory;
