import {
  INVENTORY_CREATE_UPDATE_REQUEST,
  INVENTORY_CREATE_UPDATE_SUCCESS,
  INVENTORY_CREATE_UPDATE_FAILURE,
  INVENTORY_READ_REQUEST,
  INVENTORY_READ_SUCCESS,
  INVENTORY_READ_FAILURE,
  INVENTORY_DELETE_REQUEST,
  INVENTORY_DELETE_SUCCESS,
  INVENTORY_DELETE_FAILURE,
} from '../actions/actionTypes';
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
    case INVENTORY_CREATE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case INVENTORY_CREATE_UPDATE_SUCCESS:
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
        pageLoading: false,
      });

    case INVENTORY_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Read
    case INVENTORY_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case INVENTORY_READ_SUCCESS:
      return mergeObjects(state, {
        inventory: action.payload.inventory,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case INVENTORY_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case INVENTORY_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case INVENTORY_DELETE_SUCCESS:
      let modifyInventoryForDelete = [...state.inventory];
      console.log(modifyInventoryForDelete);
      const modifiedInventoryAfterDeleted = modifyInventoryForDelete.filter(
        (inventory) => {
          console.log(inventory);
          return (
            parseInt(action.payload.inventoryId) !== parseInt(inventory.id)
          );
        },
      );
      return mergeObjects(state, {
        inventory: modifiedInventoryAfterDeleted,
        pageLoading: false,
      });

    case INVENTORY_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default inventoryReducer;
