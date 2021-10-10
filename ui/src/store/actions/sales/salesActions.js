import * as actionTypes from '../actionTypes';

// sales Actions
export const salesActions = {
  // Create or Update
  salesCreateUpdateRequest: () => {
    return {
      type: actionTypes.SALES_CREATE_UPDATE_REQUEST,
    };
  },

  salesCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.SALES_CREATE_UPDATE_SUCCESS,
      payload: {
        sales: values,
      },
    };
  },

  salesCreateUpdateFailure: () => {
    return {
      type: actionTypes.SALES_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  salesReadRequest: () => {
    return {
      type: actionTypes.SALES_READ_REQUEST,
    };
  },

  salesReadSuccess: (values) => {
    return {
      type: actionTypes.SALES_READ_SUCCESS,
      payload: {
        sales: values.records,
        pageNo: values.page,
      },
    };
  },

  salesReadFailure: () => {
    return {
      type: actionTypes.SALES_READ_FAILURE,
    };
  },

  // Delete
  salesDeleteRequest: () => {
    return {
      type: actionTypes.SALES_DELETE_REQUEST,
    };
  },

  salesDeleteSuccess: (value) => {
    return {
      type: actionTypes.SALES_DELETE_SUCCESS,
      payload: {
        salesId: value.id,
      },
    };
  },

  salesDeleteFailure: () => {
    return {
      type: actionTypes.SALES_DELETE_FAILURE,
    };
  },
};
