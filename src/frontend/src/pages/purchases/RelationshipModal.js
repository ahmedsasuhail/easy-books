import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";

import { relationshipActions } from "../../store/actions/relationship/relationshipActions";

import { CustomMuiTable } from "../relationships/ReadRelationships";

const RelationshipModal = (props) => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(relationshipActions.relationshipReadClear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          handleCloseRelationshipModal();
        }
      }}
    >
      <DialogTitle id="max-width-dialog-title">Relationships</DialogTitle>
      <DialogContent>
        <CustomMuiTable
          headCells={headCells}
          rows={rows}
          submitAddFunction={handleSetRelationshipName}
          linkId={props.relationshipId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseRelationshipModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RelationshipModal;
