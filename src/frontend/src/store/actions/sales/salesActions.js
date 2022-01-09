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
} from "../actionTypes";

export const salesActions = {
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
        pageNo: values.page - 1,
        rowsPerPage: values.page_limit,
        orderBy: values.order_by,
        order: values.sort_order,
        count: values.query ? values.total_matched_count : values.total_count,
        query: values.query,
      },
    };
  },

  salesReadFailure: () => {
    return {
      type: SALES_READ_FAILURE,
    };
  },

  salesDeleteRequest: () => {
    return {
      type: SALES_DELETE_REQUEST,
    };
  },

  salesDeleteSuccess: () => {
    return {
      type: SALES_DELETE_SUCCESS,
    };
  },

  salesDeleteFailure: () => {
    return {
      type: SALES_DELETE_FAILURE,
    };
  },
};
