import React from "react";
import { useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";

import { CustomMuiTable } from "../relationships/ReadRelationships";

const RelationshipModal = (props) => {
  const {
    relationshipItems,
    openRelationshipModal,
    handleCloseRelationshipModal,
    handleSetRelationshipName,
  } = props;

  let rows = [];
  const headCells = [
    {
      id: "id",
      label: "ID",
      display: false,
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "phone_number",
      label: "Phno",
      disableSort: true,
    },
    {
      id: "address",
      label: "Address",
      disableSort: true,
    },
  ];

  const pageNo = useSelector((state) => state.relationship.pageNo);
  const rowsPerPage = useSelector((state) => state.relationship.rowsPerPage);

  if (relationshipItems) {
    rows = relationshipItems.map((relationship, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: relationship.id,
        name: relationship.name ? relationship.name : "Not Specified",
        phone_number: relationship.phone_number
          ? relationship.phone_number
          : "Not Specified",
        address: relationship.address ? relationship.address : "Not Specified",
      };
    });
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={openRelationshipModal}
      onClose={handleCloseRelationshipModal}
    >
      <DialogTitle id="max-width-dialog-title">Relationships</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <CustomMuiTable
            headCells={headCells}
            rows={rows}
            submitAddFunction={handleSetRelationshipName}
          />
        </TableContainer>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default RelationshipModal;
