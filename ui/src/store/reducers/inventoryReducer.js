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
    // Create
    case INVENTORY_CREATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case INVENTORY_CREATE_SUCCESS:
      let modifyInventoryForCreate;
      if (state.inventory) {
        modifyInventoryForCreate = [
          ...state.inventory,
          action.payload.inventory,
        ];
      } else {
        modifyInventoryForCreate = [action.payload.inventory];
      }

      return mergeObjects(state, {
        inventory: modifyInventoryForCreate,
        formLoading: false,
        pageLoading: false,
      });

    case INVENTORY_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Create
    case INVENTORY_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case INVENTORY_UPDATE_SUCCESS:
      let modifyInventoryForUpdate = [...state.inventory];
      const inventoryIndex = modifyInventoryForUpdate.findIndex(
        (inventory) => +action.payload.inventory.id === +inventory.id,
      );

      modifyInventoryForUpdate.splice(
        inventoryIndex,
        1,
        action.payload.inventory,
      );
      return mergeObjects(state, {
        inventory: modifyInventoryForUpdate,
        formLoading: false,
        pageLoading: false,
      });

    case INVENTORY_UPDATE_FAILURE:
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
      const modifiedInventoryAfterDeleted = modifyInventoryForDelete.filter(
        (inventory) => {
          return +action.payload.inventoryId !== +inventory.id;
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
