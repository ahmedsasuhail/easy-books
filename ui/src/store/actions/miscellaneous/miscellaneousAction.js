import * as actionTypes from '../actionTypes';

// Miscellaneous Actions
export const miscellaneousActions = {
  // Loading API Request
  loading: () => {
    return {
      type: actionTypes.LOADING_REQUEST,
    };
  },

  // Create or Update
  miscellaneousCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.MISCELLANEOUS_CREATE_UPDATE_SUCCESS,
      payload: {
        miscellaneous: values.data,
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
        miscellaneous: values.data,
      },
    };
  },

  miscellaneousReadFailure: () => {
    return {
      type: actionTypes.MISCELLANEOUS_READ_FAILURE,
    };
  },

  // Delete
  miscellaneousDeleteSuccess: (values) => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_SUCCESS,
      payload: {
        miscellaneousId: values.id,
      },
    };
  },

  miscellaneousDeleteFailure: () => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_FAILURE,
    };
  },
};
