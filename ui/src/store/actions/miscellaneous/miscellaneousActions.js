import * as actionTypes from '../actionTypes';

// Miscellaneous Actions
export const miscellaneousActions = {
  // Create or Update
  miscellaneousCreateUpdateRequest: () => {
    return {
      type: actionTypes.MISCELLANEOUS_CREATE_UPDATE_REQUEST,
    };
  },

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
  miscellaneousReadRequest: () => {
    return {
      type: actionTypes.MISCELLANEOUS_READ_REQUEST,
    };
  },

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
  miscellaneousDeleteRequest: () => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_REQUEST,
    };
  },

  miscellaneousDeleteSuccess: (value) => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_SUCCESS,
      payload: {
        miscellaneousId: value.id,
      },
    };
  },

  miscellaneousDeleteFailure: () => {
    return {
      type: actionTypes.MISCELLANEOUS_DELETE_FAILURE,
    };
  },
};
