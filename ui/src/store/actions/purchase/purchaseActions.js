import * as actionTypes from '../actionTypes';

// Purchase Actions
export const purchaseActions = {
  // Create or Update
  purchaseCreateUpdateRequest: () => {
    return {
      type: actionTypes.PURCHASE_CREATE_UPDATE_REQUEST,
    };
  },

  purchaseCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.PURCHASE_CREATE_UPDATE_SUCCESS,
      payload: {
        purchase: values,
      },
    };
  },

  purchaseCreateUpdateFailure: () => {
    return {
      type: actionTypes.PURCHASE_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  purchaseReadRequest: () => {
    return {
      type: actionTypes.PURCHASE_READ_REQUEST,
    };
  },

  purchaseReadSuccess: (values) => {
    return {
      type: actionTypes.PURCHASE_READ_SUCCESS,
      payload: {
        purchases: values.records,
        pageNo: values.page,
      },
    };
  },

  purchaseReadFailure: () => {
    return {
      type: actionTypes.PURCHASE_READ_FAILURE,
    };
  },

  // Delete
  purchaseDeleteRequest: () => {
    return {
      type: actionTypes.PURCHASE_DELETE_REQUEST,
    };
  },

  purchaseDeleteSuccess: (value) => {
    return {
      type: actionTypes.PURCHASE_DELETE_SUCCESS,
      payload: {
        purchaseId: value.id,
      },
    };
  },

  purchaseDeleteFailure: () => {
    return {
      type: actionTypes.PURCHASE_DELETE_FAILURE,
    };
  },
};
