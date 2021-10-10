import * as actionTypes from '../actionTypes';

// Relationship Actions
export const relationshipActions = {
  // Create or Update
  relationshipCreateUpdateRequest: () => {
    return {
      type: actionTypes.RELATIONSHIP_CREATE_UPDATE_REQUEST,
    };
  },

  relationshipCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.RELATIONSHIP_CREATE_UPDATE_SUCCESS,
      payload: {
        relationship: values,
      },
    };
  },

  relationshipCreateUpdateFailure: () => {
    return {
      type: actionTypes.RELATIONSHIP_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  relationshipReadRequest: () => {
    return {
      type: actionTypes.RELATIONSHIP_READ_REQUEST,
    };
  },

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
  relationshipDeleteRequest: () => {
    return {
      type: actionTypes.RELATIONSHIP_DELETE_REQUEST,
    };
  },

  relationshipDeleteSuccess: (value) => {
    return {
      type: actionTypes.RELATIONSHIP_DELETE_SUCCESS,
      payload: {
        relationshipId: value.id,
      },
    };
  },

  relationshipDeleteFailure: () => {
    return {
      type: actionTypes.RELATIONSHIP_DELETE_FAILURE,
    };
  },
};
