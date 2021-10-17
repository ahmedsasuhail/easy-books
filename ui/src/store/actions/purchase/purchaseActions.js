import {
  PURCHASE_CREATE_UPDATE_REQUEST,
  PURCHASE_CREATE_UPDATE_SUCCESS,
  PURCHASE_CREATE_UPDATE_FAILURE,
  PURCHASE_READ_REQUEST,
  PURCHASE_READ_SUCCESS,
  PURCHASE_READ_FAILURE,
  PURCHASE_DELETE_REQUEST,
  PURCHASE_DELETE_SUCCESS,
  PURCHASE_DELETE_FAILURE,
} from '../actionTypes';

// Purchase Actions
export const purchaseActions = {
  // Create or Update
  purchaseCreateUpdateRequest: () => {
    return {
      type: PURCHASE_CREATE_UPDATE_REQUEST,
    };
  },

  purchaseCreateUpdateSuccess: (values) => {
    return {
      type: PURCHASE_CREATE_UPDATE_SUCCESS,
      payload: {
        purchase: values,
      },
    };
  },

  purchaseCreateUpdateFailure: () => {
    return {
      type: PURCHASE_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  purchaseReadRequest: () => {
    return {
      type: PURCHASE_READ_REQUEST,
    };
  },

  purchaseReadSuccess: (values) => {
    return {
      type: PURCHASE_READ_SUCCESS,
      payload: {
        purchases: values.records,
        pageNo: values.page,
      },
    };
  },

  purchaseReadFailure: () => {
    return {
      type: PURCHASE_READ_FAILURE,
    };
  },

  // Delete
  purchaseDeleteRequest: () => {
    return {
      type: PURCHASE_DELETE_REQUEST,
    };
  },

  purchaseDeleteSuccess: (value) => {
    return {
      type: PURCHASE_DELETE_SUCCESS,
      payload: {
        purchaseId: value.id,
      },
    };
  },

  purchaseDeleteFailure: () => {
    return {
      type: PURCHASE_DELETE_FAILURE,
    };
  },
};
