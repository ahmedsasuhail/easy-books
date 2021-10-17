import {
  MISCELLANEOUS_CREATE_UPDATE_REQUEST,
  MISCELLANEOUS_CREATE_UPDATE_SUCCESS,
  MISCELLANEOUS_CREATE_UPDATE_FAILURE,
  MISCELLANEOUS_READ_REQUEST,
  MISCELLANEOUS_READ_SUCCESS,
  MISCELLANEOUS_READ_FAILURE,
  MISCELLANEOUS_DELETE_REQUEST,
  MISCELLANEOUS_DELETE_SUCCESS,
  MISCELLANEOUS_DELETE_FAILURE,
} from '../actionTypes';

// Miscellaneous Actions
export const miscellaneousActions = {
  // Create or Update
  miscellaneousCreateUpdateRequest: () => {
    return {
      type: MISCELLANEOUS_CREATE_UPDATE_REQUEST,
    };
  },

  miscellaneousCreateUpdateSuccess: (values) => {
    return {
      type: MISCELLANEOUS_CREATE_UPDATE_SUCCESS,
      payload: {
        miscellaneous: values,
      },
    };
  },

  miscellaneousCreateUpdateFailure: () => {
    return {
      type: MISCELLANEOUS_CREATE_UPDATE_FAILURE,
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
        pageNo: values.page,
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

  miscellaneousDeleteSuccess: (value) => {
    return {
      type: MISCELLANEOUS_DELETE_SUCCESS,
      payload: {
        miscellaneousId: value.id,
      },
    };
  },

  miscellaneousDeleteFailure: () => {
    return {
      type: MISCELLANEOUS_DELETE_FAILURE,
    };
  },
};
