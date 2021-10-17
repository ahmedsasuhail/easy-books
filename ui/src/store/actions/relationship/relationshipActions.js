import {
  RELATIONSHIP_CREATE_UPDATE_REQUEST,
  RELATIONSHIP_CREATE_UPDATE_SUCCESS,
  RELATIONSHIP_CREATE_UPDATE_FAILURE,
  RELATIONSHIP_READ_REQUEST,
  RELATIONSHIP_READ_SUCCESS,
  RELATIONSHIP_READ_FAILURE,
  RELATIONSHIP_DELETE_REQUEST,
  RELATIONSHIP_DELETE_SUCCESS,
  RELATIONSHIP_DELETE_FAILURE,
} from '../actionTypes';

// Relationship Actions
export const relationshipActions = {
  // Create or Update
  relationshipCreateUpdateRequest: () => {
    return {
      type: RELATIONSHIP_CREATE_UPDATE_REQUEST,
    };
  },

  relationshipCreateUpdateSuccess: (values) => {
    return {
      type: RELATIONSHIP_CREATE_UPDATE_SUCCESS,
      payload: {
        relationship: values,
      },
    };
  },

  relationshipCreateUpdateFailure: () => {
    return {
      type: RELATIONSHIP_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  relationshipReadRequest: () => {
    return {
      type: RELATIONSHIP_READ_REQUEST,
    };
  },

  relationshipReadSuccess: (values) => {
    return {
      type: RELATIONSHIP_READ_SUCCESS,
      payload: {
        relationships: values.records,
        pageNo: values.page,
      },
    };
  },

  relationshipReadFailure: () => {
    return {
      type: RELATIONSHIP_READ_FAILURE,
    };
  },

  // Delete
  relationshipDeleteRequest: () => {
    return {
      type: RELATIONSHIP_DELETE_REQUEST,
    };
  },

  relationshipDeleteSuccess: (value) => {
    return {
      type: RELATIONSHIP_DELETE_SUCCESS,
      payload: {
        relationshipId: value.id,
      },
    };
  },

  relationshipDeleteFailure: () => {
    return {
      type: RELATIONSHIP_DELETE_FAILURE,
    };
  },
};
