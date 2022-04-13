import React from "react";
import { Form } from "react-final-form";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const CustomDialog = (props) => {
  return (
    <>
      <Dialog
        fullWidth={props.fullWidth}
        maxWidth={props.maxWidth}
        open={props.open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            props.handleClose();
          }
        }}
      >
        <DialogTitle id="max-width-dialog-title">{props.title}</DialogTitle>
        <Form
          initialValues={props.initialValues}
          onSubmit={props.handleSubmit}
          mutators={{
            setValue: ([field, value], state, { changeValue }) => {
              changeValue(state, field, () => value);
            },
          }}
          render={({ form, handleSubmit, invalid }) => {
            window.setFormValue = form.mutators.setValue;
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent>{props.children}</DialogContent>
                <DialogActions>
                  <>
                    <Button onClick={props.handleClose} color="primary">
                      {props.closeButtonLabel
                        ? props.closeButtonLabel
                        : "Cancel"}
                    </Button>
                    <Button type="submit" color="secondary" disabled={invalid}>
                      {props.isLoading ? (
                        <CircularProgress size={16} />
                      ) : props.saveButtonLabel ? (
                        props.saveButtonLabel
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </>
                </DialogActions>
              </form>
            );
          }}
        />
      </Dialog>
    </>
  );
};

export default CustomDialog;
