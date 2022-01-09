import {
  PURCHASE_CREATE_REQUEST,
  PURCHASE_CREATE_SUCCESS,
  PURCHASE_CREATE_FAILURE,
  PURCHASE_UPDATE_REQUEST,
  PURCHASE_UPDATE_SUCCESS,
  PURCHASE_UPDATE_FAILURE,
  PURCHASE_READ_REQUEST,
  PURCHASE_READ_SUCCESS,
  PURCHASE_READ_FAILURE,
  PURCHASE_READ_CLEAR,
  PURCHASE_DELETE_REQUEST,
  PURCHASE_DELETE_SUCCESS,
  PURCHASE_DELETE_FAILURE,
} from "../actionTypes";

export const purchaseActions = {
  purchaseCreateRequest: () => {
    return {
      type: PURCHASE_CREATE_REQUEST,
    };
  },

  purchaseCreateSuccess: (values) => {
    return {
      type: PURCHASE_CREATE_SUCCESS,
      payload: {
        purchase: values,
      },
    };
  },

  purchaseCreateFailure: () => {
    return {
      type: PURCHASE_CREATE_FAILURE,
    };
  },

  purchaseUpdateRequest: () => {
    return {
      type: PURCHASE_UPDATE_REQUEST,
    };
  },

  purchaseUpdateSuccess: (values) => {
    return {
      type: PURCHASE_UPDATE_SUCCESS,
      payload: {
        purchase: values,
      },
    };
  },

  purchaseUpdateFailure: () => {
    return {
      type: PURCHASE_UPDATE_FAILURE,
    };
  },

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
        pageNo: values.page - 1,
        rowsPerPage: values.page_limit,
        orderBy: values.order_by,
        order: values.sort_order,
        count: values.query ? values.total_matched_count : values.total_count,
        query: values.query,
      },
    };
  },

  purchaseReadFailure: () => {
    return {
      type: PURCHASE_READ_FAILURE,
    };
  },

  purchaseReadClear: () => {
    return {
      type: PURCHASE_READ_CLEAR,
    };
  },

  purchaseDeleteRequest: () => {
    return {
      type: PURCHASE_DELETE_REQUEST,
    };
  },

  purchaseDeleteSuccess: () => {
    return {
      type: PURCHASE_DELETE_SUCCESS,
    };
  },

  purchaseDeleteFailure: () => {
    return {
      type: PURCHASE_DELETE_FAILURE,
    };
  },
};
