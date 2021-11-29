import {
  MISCELLANEOUS_CREATE_REQUEST,
  MISCELLANEOUS_CREATE_SUCCESS,
  MISCELLANEOUS_CREATE_FAILURE,
  MISCELLANEOUS_UPDATE_REQUEST,
  MISCELLANEOUS_UPDATE_SUCCESS,
  MISCELLANEOUS_UPDATE_FAILURE,
  MISCELLANEOUS_READ_REQUEST,
  MISCELLANEOUS_READ_SUCCESS,
  MISCELLANEOUS_READ_FAILURE,
  MISCELLANEOUS_DELETE_REQUEST,
  MISCELLANEOUS_DELETE_SUCCESS,
  MISCELLANEOUS_DELETE_FAILURE,
} from "../actionTypes";

export const miscellaneousActions = {
  miscellaneousCreateRequest: () => {
    return {
      type: MISCELLANEOUS_CREATE_REQUEST,
    };
  },

  miscellaneousCreateSuccess: (values) => {
    return {
      type: MISCELLANEOUS_CREATE_SUCCESS,
      payload: {
        miscellaneous: values,
      },
    };
  },

  miscellaneousCreateFailure: () => {
    return {
      type: MISCELLANEOUS_CREATE_FAILURE,
    };
  },

  miscellaneousUpdateRequest: () => {
    return {
      type: MISCELLANEOUS_UPDATE_REQUEST,
    };
  },

  miscellaneousUpdateSuccess: (values) => {
    return {
      type: MISCELLANEOUS_UPDATE_SUCCESS,
      payload: {
        miscellaneous: values,
      },
    };
  },

  miscellaneousUpdateFailure: () => {
    return {
      type: MISCELLANEOUS_UPDATE_FAILURE,
    };
  },

  miscellaneousReadRequest: () => {
    return {
      type: MISCELLANEOUS_READ_REQUEST,
    };
  },

  miscellaneousReadSuccess: (values) => {
    return {
      type: MISCELLANEOUS_READ_SUCCESS,
      payload: {
        miscellaneous: values.records,
        pageNo: values.page - 1,
        rowsPerPage: values.page_limit,
        orderBy: values.order_by,
        order: values.sort_order,
        count: values.query ? values.total_matched_count : values.total_count,
        query: values.query,
      },
    };
  },

  miscellaneousReadFailure: () => {
    return {
      type: MISCELLANEOUS_READ_FAILURE,
    };
  },

  miscellaneousDeleteRequest: () => {
    return {
      type: MISCELLANEOUS_DELETE_REQUEST,
    };
  },

  miscellaneousDeleteSuccess: () => {
    return {
      type: MISCELLANEOUS_DELETE_SUCCESS,
    };
  },

  miscellaneousDeleteFailure: () => {
    return {
      type: MISCELLANEOUS_DELETE_FAILURE,
    };
  },
};
