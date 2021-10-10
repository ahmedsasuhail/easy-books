import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  inventory: [],
  pageNo: null,
  formLoading: false,
  pageLoading: false,
};

// Reducer
const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create or Update
    case actionTypes.INVENTORY_CREATE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
      });

    case actionTypes.INVENTORY_CREATE_UPDATE_SUCCESS:
      let modifyInventoryForCreateOrUpdate = [...state.inventory];
      const inventoryIndex = modifyInventoryForCreateOrUpdate.findIndex(
        (inventory) =>
          parseInt(action.payload.inventory.id) === parseInt(inventory.id),
      );

      if (inventoryIndex >= 0) {
        modifyInventoryForCreateOrUpdate.splice(
          inventoryIndex,
          1,
          action.payload.inventory,
        );
      } else {
        modifyInventoryForCreateOrUpdate = [
          ...state.inventory,
          action.payload.inventory,
        ];
      }
      return mergeObjects(state, {
        inventory: modifyInventoryForCreateOrUpdate,
        formLoading: false,
      });

    case actionTypes.INVENTORY_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
      });

    // Read
    case actionTypes.INVENTORY_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.INVENTORY_READ_SUCCESS:
      return mergeObjects(state, {
        inventory: action.payload.inventory,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case actionTypes.INVENTORY_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case actionTypes.INVENTORY_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.INVENTORY_DELETE_SUCCESS:
      let modifyInventoryForDelete = [...state.inventory];
      const modifiedInventoryAfterDeleted = modifyInventoryForDelete.filter(
        (inventory) =>
          parseInt(action.payload.inventoryId) !== parseInt(inventory.id),
      );
      return mergeObjects(state, {
        inventory: modifiedInventoryAfterDeleted,
        pageLoading: false,
      });

    case actionTypes.INVENTORY_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default inventoryReducer;
