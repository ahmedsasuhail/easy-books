import {
  INVENTORY_CREATE_REQUEST,
  INVENTORY_CREATE_SUCCESS,
  INVENTORY_CREATE_FAILURE,
  INVENTORY_UPDATE_REQUEST,
  INVENTORY_UPDATE_SUCCESS,
  INVENTORY_UPDATE_FAILURE,
  INVENTORY_READ_REQUEST,
  INVENTORY_READ_SUCCESS,
  INVENTORY_READ_FAILURE,
  INVENTORY_DELETE_REQUEST,
  INVENTORY_DELETE_SUCCESS,
  INVENTORY_DELETE_FAILURE,
} from '../actionTypes';

// Inventory Actions
export const inventoryActions = {
  // Create
  inventoryCreateRequest: () => {
    return {
      type: INVENTORY_CREATE_REQUEST,
    };
  },

  inventoryCreateSuccess: (values) => {
    return {
      type: INVENTORY_CREATE_SUCCESS,
      payload: {
        inventory: values,
      },
    };
  },

  inventoryCreateFailure: () => {
    return {
      type: INVENTORY_CREATE_FAILURE,
    };
  },

  // Update
  inventoryUpdateRequest: () => {
    return {
      type: INVENTORY_UPDATE_REQUEST,
    };
  },

  inventoryUpdateSuccess: (values) => {
    return {
      type: INVENTORY_UPDATE_SUCCESS,
      payload: {
        inventory: values,
      },
    };
  },

  inventoryUpdateFailure: () => {
    return {
      type: INVENTORY_UPDATE_FAILURE,
    };
  },

  // Read
  inventoryReadRequest: () => {
    return {
      type: INVENTORY_READ_REQUEST,
    };
  },

  inventoryReadSuccess: (values) => {
    return {
      type: INVENTORY_READ_SUCCESS,
      payload: {
        inventory: values.records,
        pageNo: values.page,
      },
    };
  },

  inventoryReadFailure: () => {
    return {
      type: INVENTORY_READ_FAILURE,
    };
  },

  // Delete
  inventoryDeleteRequest: () => {
    return {
      type: INVENTORY_DELETE_REQUEST,
    };
  },

  inventoryDeleteSuccess: (value) => {
    return {
      type: INVENTORY_DELETE_SUCCESS,
      payload: {
        inventoryId: value.id,
      },
    };
  },

  inventoryDeleteFailure: () => {
    return {
      type: INVENTORY_DELETE_FAILURE,
    };
  },
};
