import * as actionTypes from '../actionTypes';

// Relationship Actions
export const relationshipActions = {
  // Create or Update
  relationshipCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.RELATIONSHIP_CREATE_UPDATE_SUCCESS,
      payload: {
        relationships: values,
      },
    };
  },

  relationshipCreateUpdateFailure: () => {
    return {
      type: actionTypes.RELATIONSHIP_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  relationshipReadSuccess: (values) => {
    return {
      type: actionTypes.RELATIONSHIP_READ_SUCCESS,
      payload: {
        relationships: values.records,
        pageNo: values.page,
      },
    };
  },

  relationshipReadFailure: () => {
    return {
      type: actionTypes.RELATIONSHIP_READ_FAILURE,
    };
  },

  // Delete
  relationshipDeleteSuccess: (value) => {
    return {
      type: actionTypes.RELATIONSHIP_DELETE_SUCCESS,
      payload: {
        relationshipId: value.ID,
      },
    };
  },

  relationshipDeleteFailure: () => {
    return {
      type: actionTypes.RELATIONSHIP_DELETE_FAILURE,
    };
  },

  // Loading API Request
  loading: () => {
    return {
      type: actionTypes.LOADING_REQUEST,
    };
  },
};
