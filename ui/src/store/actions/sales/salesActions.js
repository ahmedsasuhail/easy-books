import {
  SALES_CREATE_REQUEST,
  SALES_CREATE_SUCCESS,
  SALES_CREATE_FAILURE,
  SALES_UPDATE_REQUEST,
  SALES_UPDATE_SUCCESS,
  SALES_UPDATE_FAILURE,
  SALES_READ_REQUEST,
  SALES_READ_SUCCESS,
  SALES_READ_FAILURE,
  SALES_DELETE_REQUEST,
  SALES_DELETE_SUCCESS,
  SALES_DELETE_FAILURE,
} from '../actionTypes';

// sales Actions
export const salesActions = {
  // Create
  salesCreateRequest: () => {
    return {
      type: SALES_CREATE_REQUEST,
    };
  },

  salesCreateSuccess: (values) => {
    return {
      type: SALES_CREATE_SUCCESS,
      payload: {
        sales: values,
      },
    };
  },

  salesCreateFailure: () => {
    return {
      type: SALES_CREATE_FAILURE,
    };
  },

  // Update
  salesUpdateRequest: () => {
    return {
      type: SALES_UPDATE_REQUEST,
    };
  },

  salesUpdateSuccess: (values) => {
    return {
      type: SALES_UPDATE_SUCCESS,
      payload: {
        sales: values,
      },
    };
  },

  salesUpdateFailure: () => {
    return {
      type: SALES_UPDATE_FAILURE,
    };
  },

  // Read
  salesReadRequest: () => {
    return {
      type: SALES_READ_REQUEST,
    };
  },

  salesReadSuccess: (values) => {
    return {
      type: SALES_READ_SUCCESS,
      payload: {
        sales: values.records,
        pageNo: values.page,
      },
    };
  },

  salesReadFailure: () => {
    return {
      type: SALES_READ_FAILURE,
    };
  },

  // Delete
  salesDeleteRequest: () => {
    return {
      type: SALES_DELETE_REQUEST,
    };
  },

  salesDeleteSuccess: (value) => {
    return {
      type: SALES_DELETE_SUCCESS,
      payload: {
        salesId: value.id,
      },
    };
  },

  salesDeleteFailure: () => {
    return {
      type: SALES_DELETE_FAILURE,
    };
  },
};
