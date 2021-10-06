import * as actionTypes from '../actionTypes';

// Miscellaneous Actions
export const miscellaneousActions = {
  // Create or Update
  miscellaneousCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.MISCELLANEOUS_CREATE_UPDATE_SUCCESS,
      payload: {
        miscellaneous: values,
      },
    };
  },

  miscellaneousCreateUpdateFailure: () => {
    return {
      type: actionTypes.MISCELLANEOUS_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  miscellaneousReadSuccess: (values) => {
    return {
      type: actionTypes.MISCELLANEOUS_READ_SUCCESS,
      payload: {
        miscellaneous: values.records,
        pageNo: values.page,
      },
    };
  },

  miscellaneousReadFailure: () => {
    return {
      type: actionTypes.MISCELLANEOUS_READ_FAILURE,
    };
  },

  // Delete
  miscellaneousDeleteSuccess: (value) => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_SUCCESS,
      payload: {
        miscellaneousId: value.ID,
      },
    };
  },

  miscellaneousDeleteFailure: () => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_FAILURE,
    };
  },

  // Loading API Request
  loading: () => {
    return {
      type: actionTypes.LOADING_REQUEST,
    };
  },
};
