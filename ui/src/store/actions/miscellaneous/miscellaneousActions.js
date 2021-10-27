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
} from '../actionTypes';

// Miscellaneous Actions
export const miscellaneousActions = {
  // Create
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

  // Update
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

  // Read
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
        count: values.total_count,
      },
    };
  },

  miscellaneousReadFailure: () => {
    return {
      type: MISCELLANEOUS_READ_FAILURE,
    };
  },

  // Delete
  miscellaneousDeleteRequest: () => {
    return {
      type: MISCELLANEOUS_DELETE_REQUEST,
    };
  },

  miscellaneousDeleteSuccess: (values) => {
    return {
      type: MISCELLANEOUS_DELETE_SUCCESS,
      payload: {
        miscellaneousId: values.id,
      },
    };
  },

  miscellaneousDeleteFailure: () => {
    return {
      type: MISCELLANEOUS_DELETE_FAILURE,
    };
  },
};
