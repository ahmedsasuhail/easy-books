import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";

const MessageDialogue = (props) => {
  const { title, message, button, openModal, handleCloseModal } = props;

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={openModal}
      onClose={handleCloseModal}
    >
      <DialogTitle id="max-width-dialog-title">{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>{button}</DialogActions>
    </Dialog>
  );
};

export default MessageDialogue;
