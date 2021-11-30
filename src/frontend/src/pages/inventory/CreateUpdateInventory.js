import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Field, useFormState } from "react-final-form";

import Button from "@mui/material/Button";

import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";

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

      const items = purchaseItems.filter(
        (item) => item.id === formState.values.purchase_id
      );
      // TODO: Change below code like rest
      if (items.length > 0) {
        setPurchaseName(`${items[0].company_name}-${items[0].vehicle_name}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseId]);

  const handleSetPurchaseName = (value) => {
    setPurchaseId(value.id);
    setPurchaseName(`${value.company_name} - ${value.vehicle_name}`);
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
        component={Select}
        options={[{ id: purchaseId, name: purchaseName }]}
        id="purchase_id"
        name="purchase_id"
        label="Purchase Id"
        margin="normal"
        hasEmptyOption={true}
        hasOne={true}
        disabled={!purchaseId}
        InputLabelProps={{
          shrink: !purchaseId ? false : true,
        }}
        fullWidth
        required
        validate={required}
      />
      <Field>
        {() => (
          <Button
            variant="text"
            onClick={() => setOpenPurchasesModal(true)}
            size="small"
            color="primary"
          >
            Add Purchase
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
        purchaseItems={purchaseItems}
        openPurchasesModal={openPurchasesModal}
        handleSetPurchaseName={handleSetPurchaseName}
        handleClosePurchasesModal={handleClosePurchasesModal}
      />
    </>
  );
};

export default CreateUpdateInventory;
