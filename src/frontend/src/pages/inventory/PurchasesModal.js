import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import { purchaseActions } from "../../store/actions/purchase/purchaseActions";

import { CustomMuiTable } from "../purchases/ReadPurchase";

import { formattedDate } from "../../utils/helpers";

const PurchasesModal = (props) => {
  const dispatch = useDispatch();

  const {
    purchaseItems,
    openPurchasesModal,
    handleClosePurchasesModal,
    handleSetPurchaseName,
  } = props;

  let rows = [];
  const headCells = [
    {
      id: "id",
      label: "ID",
      display: false,
      disableSort: true,
    },
    {
      id: "company_name",
      label: "Company Name",
    },
    {
      id: "vehicle_name",
      label: "Vehicle Name",
    },
    {
      id: "price",
      label: "Price",
    },
    {
      id: "seller",
      label: "Seller",
    },
    {
      id: "date",
      label: "Date",
    },
  ];

  useEffect(() => {
    dispatch(purchaseActions.purchaseReadClear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageNo = useSelector((state) => state.purchase.pageNo);
  const rowsPerPage = useSelector((state) => state.purchase.rowsPerPage);

  if (purchaseItems) {
    rows = purchaseItems.map((purchase, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: purchase.id,
        company_name: purchase.company_name
          ? purchase.company_name
          : "Not Specified",
        vehicle_name: purchase.vehicle_name
          ? purchase.vehicle_name
          : "Not Specified",
        price: purchase.price ? purchase.price : "Not Specified",
        seller: purchase.relationships.id
          ? purchase.relationships.name
          : "Not Specified",
        date: purchase.date ? formattedDate(purchase.date) : "Not Specified",
      };
    });
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={openPurchasesModal}
      onClose={handleClosePurchasesModal}
    >
      <DialogTitle id="max-width-dialog-title">Purchases</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <CustomMuiTable
            headCells={headCells}
            rows={rows}
            submitAddFunction={handleSetPurchaseName}
          />
        </TableContainer>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default PurchasesModal;
