import {
  RELATIONSHIP_CREATE_REQUEST,
  RELATIONSHIP_CREATE_SUCCESS,
  RELATIONSHIP_CREATE_FAILURE,
  RELATIONSHIP_UPDATE_REQUEST,
  RELATIONSHIP_UPDATE_SUCCESS,
  RELATIONSHIP_UPDATE_FAILURE,
  RELATIONSHIP_READ_REQUEST,
  RELATIONSHIP_READ_SUCCESS,
  RELATIONSHIP_READ_FAILURE,
  RELATIONSHIP_DELETE_REQUEST,
  RELATIONSHIP_DELETE_SUCCESS,
  RELATIONSHIP_DELETE_FAILURE,
} from '../actionTypes';

// Relationship Actions
export const relationshipActions = {
  // Create
  relationshipCreateRequest: () => {
    return {
      type: RELATIONSHIP_CREATE_REQUEST,
    };
  },

  relationshipCreateSuccess: (values) => {
    return {
      type: RELATIONSHIP_CREATE_SUCCESS,
      payload: {
        relationship: values,
      },
    };
  },

  relationshipCreateFailure: () => {
    return {
      type: RELATIONSHIP_CREATE_FAILURE,
    };
  },

  // Update
  relationshipUpdateRequest: () => {
    return {
      type: RELATIONSHIP_UPDATE_REQUEST,
    };
  },

  relationshipUpdateSuccess: (values) => {
    return {
      type: RELATIONSHIP_UPDATE_SUCCESS,
      payload: {
        relationship: values,
      },
    };
  },

  relationshipUpdateFailure: () => {
    return {
      type: RELATIONSHIP_UPDATE_FAILURE,
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
        pageNo: values.page - 1,
        rowsPerPage: values.page_limit,
        orderBy: values.order_by,
        order: values.sort_order,
        count: values.total_count,
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
