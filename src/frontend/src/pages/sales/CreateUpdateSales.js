import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Field, useFormState } from "react-final-form";

import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { makeStyles, CircularProgress } from "@material-ui/core";

import Input from "../../components/Input/Input";

import PurchasesModal from "../inventory/PurchasesModal";
import RelationshipModal from "../purchases/RelationshipModal";
import InventoryModal from "./InventoryModal";
import MessageDialogue from "../../components/Dialog/MessageDialogue";

import { getInventoryPurchase } from "../../store/actions/inventory_purchase";

import { validateFloat, validateLimit } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  switchMargin: {
    marginTop: "16px",
  },
}));

const CreateUpdateSales = (props) => {
  const formState = useFormState();

  const classes = useStyles();

  const token = useSelector((state) => state.user.token);
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships
  );
  const inventoryPurchaseData = useSelector(
    (state) => state.inventoryPurchase.data
  );
  const isLoading = useSelector((state) => state.inventoryPurchase.loading);
  const pageNo = useSelector((state) => state.inventoryPurchase.pageNo);
  const rowsPerPage = useSelector(
    (state) => state.inventoryPurchase.rowsPerPage
  );
  const orderBy = useSelector((state) => state.inventoryPurchase.orderBy);
  const order = useSelector((state) => state.inventoryPurchase.order);

  const [purchaseId, setPurchaseId] = useState();
  const [purchaseName, setPurchaseName] = useState();
  const [inventoryId, setInventoryId] = useState();
  const [inventoryName, setInventoryName] = useState();
  const [inventoryQuantity, setInventoryQuantity] = useState();
  const [relationshipId, setRelationshipId] = useState();
  const [relationshipName, setRelationshipName] = useState();
  const [openPurchasesModal, setOpenPurchasesModal] = useState(false);
  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const [openRelationshipModal, setOpenRelationshipModal] = useState(false);
  const [openAlertModal, setOpenAlertModal] = useState(false);

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
    } else if (
      formState.values.id &&
      purchaseItems.length > 0 &&
      !inventoryId &&
      !inventoryName
    ) {
      setInventoryId(+formState.values.inventory_id);
      setInventoryName(formState.values.part_name);
      window.setFormValue("inventory_id", +formState.values.inventory_id);
    } else if (
      formState.values.id &&
      relationshipItems.length > 0 &&
      !relationshipId &&
      !relationshipName
    ) {
      setRelationshipId(+formState.values.relationship_id);
      setRelationshipName(formState.values.buyer);
      window.setFormValue("relationship_id", +formState.values.relationship_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseId, inventoryId, relationshipId]);

  const dispatch = useDispatch();

  const required = (value) => (value ? undefined : "Required");

  const handleSetPurchaseName = (value) => {
    setPurchaseId(value.id);
    setPurchaseName(`${value.company_name} - ${value.vehicle_name}`);
    window.setFormValue("purchase_id", value.id);
    handleClosePurchasesModal();
  };

  const handleSetInventoryName = (value) => {
    setInventoryId(value.id);
    setInventoryName(value.part_name);
    setInventoryQuantity(value.quantity);
    window.setFormValue("inventory_id", value.id);
    handleCloseInventoryModal();
  };

  const handleSetRelationshipName = (value) => {
    setRelationshipId(value.id);
    setRelationshipName(value.name);
    window.setFormValue("relationship_id", value.id);
    handleCloseRelationshipModal();
  };

  const handleClosePurchasesModal = () => {
    setOpenPurchasesModal(false);
  };

  const handleCloseInventoryModal = () => {
    setOpenInventoryModal(false);
  };

  const handleCloseRelationshipModal = () => {
    setOpenRelationshipModal(false);
  };

  const inventoryPurchaseHandler = (id) => {
    dispatch(
      getInventoryPurchase({ id, token, pageNo, rowsPerPage, orderBy, order })
    ).then((res) => {
      if (!res) {
        setOpenAlertModal(true);
      }
    });
  };

  useEffect(() => {
    if (props.initialValues && props.initialValues.purchase_id) {
      inventoryPurchaseHandler(props.initialValues.purchase_id);
      setInventoryQuantity(props.initialValues.inventory_quantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    inventoryPurchaseHandler(purchaseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseId]);

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
        Purchase Name: <br /> {purchaseName}
      </p>
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
        id="inventory_id"
        name="inventory_id"
        type="hidden"
        margin="normal"
        required
        validate={required}
      />
      <p>
        Inventory Name: <br /> {inventoryName}
      </p>
      {isLoading ? (
        <CircularProgress size={16} />
      ) : (
        <Field>
          {() => (
            <Button
              variant="text"
              onClick={() => setOpenInventoryModal(true)}
              size="small"
              color="primary"
              disabled={
                !inventoryPurchaseData.records ||
                inventoryPurchaseData.records.length === 0
              }
            >
              Add Inventory
            </Button>
          )}
        </Field>
      )}
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
        Buyer Name: <br /> {relationshipName}
      </p>
      <Field>
        {() => (
          <Button
            variant="text"
            onClick={() => setOpenRelationshipModal(true)}
            size="small"
            color="primary"
          >
            Add Buyer
          </Button>
        )}
      </Field>
      <Field
        component={Input}
        id="quantity"
        name="quantity"
        label={`Quantity (Max: ${inventoryQuantity || 1})`}
        type="number"
        margin="normal"
        fullWidth
        required
        validate={validateLimit(1, inventoryQuantity || 1)}
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
      <Field id="credit" name="credit" type="checkbox">
        {(props) => (
          <div className={classes.switchMargin}>
            Credit? <Switch color="primary" {...props.input} />
          </div>
        )}
      </Field>
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
      <InventoryModal
        id={purchaseId}
        inventoryItems={inventoryPurchaseData.records}
        openInventoryModal={openInventoryModal}
        handleSetInventoryName={handleSetInventoryName}
        handleCloseInventoryModal={handleCloseInventoryModal}
      />
      <RelationshipModal
        relationshipItems={relationshipItems}
        openRelationshipModal={openRelationshipModal}
        handleSetRelationshipName={handleSetRelationshipName}
        handleCloseRelationshipModal={handleCloseRelationshipModal}
      />
      <MessageDialogue
        title="Alert"
        message="There are no inventory items with the current purchase item."
        button={
          <>
            <Button
              size="small"
              onClick={() => setOpenAlertModal(false)}
              color="primary"
            >
              Close
            </Button>
          </>
        }
        openModal={openAlertModal}
        handleCloseModal={() => setOpenAlertModal(false)}
      />
    </>
  );
};

export default CreateUpdateSales;
