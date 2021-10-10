import * as actionTypes from '../actionTypes';

// Inventory Actions
export const inventoryActions = {
  // Create or Update
  inventoryCreateUpdateRequest: () => {
    return {
      type: actionTypes.INVENTORY_CREATE_UPDATE_REQUEST,
    };
  },

  inventoryCreateUpdateSuccess: (values) => {
    return {
      type: actionTypes.INVENTORY_CREATE_UPDATE_SUCCESS,
      payload: {
        inventory: values,
      },
    };
  },

  inventoryCreateUpdateFailure: () => {
    return {
      type: actionTypes.INVENTORY_CREATE_UPDATE_FAILURE,
    };
  },

  // Read
  inventoryReadRequest: () => {
    return {
      type: actionTypes.INVENTORY_READ_REQUEST,
    };
  },

  inventoryReadSuccess: (values) => {
    return {
      type: actionTypes.INVENTORY_READ_SUCCESS,
      payload: {
        inventory: values.records,
        pageNo: values.page,
      },
    };
  },

  inventoryReadFailure: () => {
    return {
      type: actionTypes.INVENTORY_READ_FAILURE,
    };
  },

  // Delete
  inventoryDeleteRequest: () => {
    return {
      type: actionTypes.INVENTORY_DELETE_REQUEST,
    };
  },

  inventoryDeleteSuccess: (value) => {
    return {
      type: actionTypes.INVENTORY_DELETE_SUCCESS,
      payload: {
        InventoryId: value.id,
      },
    };
  },

  inventoryDeleteFailure: () => {
    return {
      type: actionTypes.INVENTORY_DELETE_FAILURE,
    };
  },
};
