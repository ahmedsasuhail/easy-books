import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { Form } from 'react-final-form';

const CustomDialog = (props) => {
  return (
    <>
      <Dialog
        fullWidth={props.fullWidth}
        maxWidth={props.maxWidth}
        open={props.open}
        onClose={props.handleClose}
      >
        <DialogTitle id='max-width-dialog-title'>{props.title}</DialogTitle>
        <Form
          initialValues={props.initialValues}
          onSubmit={props.handleSubmit}
          render={({ handleSubmit, invalid, form, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                <DialogContent>{props.children}</DialogContent>
                <DialogActions>
                  <>
                    <Button onClick={props.handleClose} color='primary'>
                      {props.closeButtonLabel
                        ? props.closeButtonLabel
                        : 'Cancel'}
                    </Button>
                    <Button type='submit' color='secondary' disabled={invalid}>
                      {props.isLoading ? (
                        <CircularProgress size={16} />
                      ) : props.saveButtonLabel ? (
                        props.saveButtonLabel
                      ) : (
                        'Submit'
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
