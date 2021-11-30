import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Field, useFormState } from "react-final-form";

import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { makeStyles, CircularProgress } from "@material-ui/core";

import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";

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
    } else if (
      formState.values.id &&
      purchaseItems.length > 0 &&
      !inventoryId &&
      !inventoryName
    ) {
      setInventoryId(+formState.values.inventory_id);
      setInventoryName(formState.values.part_name);
    } else if (
      formState.values.id &&
      relationshipItems.length > 0 &&
      !relationshipId &&
      !relationshipName
    ) {
      setRelationshipId(+formState.values.relationship_id);
      setRelationshipName(formState.values.buyer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseId, inventoryId, relationshipId]);

  const dispatch = useDispatch();

  const required = (value) => (value ? undefined : "Required");

  const handleSetPurchaseName = (value) => {
    setPurchaseId(value.id);
    setPurchaseName(`${value.company_name} - ${value.vehicle_name}`);
    handleClosePurchasesModal();
  };

  const handleSetInventoryName = (value) => {
    setInventoryId(value.id);
    setInventoryName(value.part_name);
    setInventoryQuantity(value.quantity);
    handleCloseInventoryModal();
  };

  const handleSetRelationshipName = (value) => {
    setRelationshipId(value.id);
    setRelationshipName(value.name);
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
        disabled={!purchaseId}
        InputLabelProps={{
          shrink: !purchaseId ? false : true,
        }}
        fullWidth
        required
        validate={required}
        onChange={(e) => inventoryPurchaseHandler(e.target.value)}
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
        component={Select}
        options={[{ id: inventoryId, name: inventoryName }]}
        id="inventory_id"
        name="inventory_id"
        label="Inventory Id"
        margin="normal"
        hasEmptyOption={true}
        disabled={!inventoryId}
        InputLabelProps={{
          shrink: !inventoryId ? false : true,
        }}
        fullWidth
        required
        validate={required}
      />
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
        component={Select}
        options={[{ id: relationshipId, name: relationshipName }]}
        id="relationship_id"
        name="relationship_id"
        label="Relationship Id"
        margin="normal"
        hasEmptyOption={true}
        disabled={!relationshipId}
        InputLabelProps={{
          shrink: !relationshipId ? false : true,
        }}
        fullWidth
        required
        validate={required}
      />
      <Field>
        {() => (
          <Button
            variant="text"
            onClick={() => setOpenRelationshipModal(true)}
            size="small"
            color="primary"
          >
            Add Relationship
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
