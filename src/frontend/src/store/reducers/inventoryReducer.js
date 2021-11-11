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

const initialState = {
  inventory: [],
  orderBy: 'date',
  order: 'desc',
  pageNo: 0,
  rowsPerPage: 5,
  count: 0,
  formLoading: false,
  pageLoading: false,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORY_CREATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case INVENTORY_CREATE_SUCCESS:
      let modifyInventoryForCreate;
      let nextPageNo = state.pageNo;

      modifyInventoryForCreate =
        state.inventory.length === 0
          ? [action.payload.inventory]
          : state.inventory.length === 5
          ? []
          : [...state.inventory, action.payload.inventory];

      if (
        state.inventory.length !== 0 &&
        state.inventory.length % state.rowsPerPage === 0
      ) {
        nextPageNo = Math.floor(state.count / state.rowsPerPage);
      }

      return mergeObjects(state, {
        inventory: modifyInventoryForCreate,
        formLoading: false,
        pageLoading: false,
        pageNo: nextPageNo,
        count: state.count + 1,
      });

    case INVENTORY_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

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
        pageNo: state.pageNo,
        count: state.count,
      });

    case INVENTORY_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case INVENTORY_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case INVENTORY_READ_SUCCESS:
      return mergeObjects(state, {
        inventory: action.payload.inventory || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        pageLoading: false,
      });

    case INVENTORY_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

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

      let prevPageNo =
        state.count % state.rowsPerPage === 1 &&
        state.count > state.rowsPerPage &&
        state.pageNo === Math.floor(state.count / state.rowsPerPage)
          ? state.pageNo - 1
          : state.pageNo;

      return mergeObjects(state, {
        inventory: modifiedInventoryAfterDeleted,
        pageLoading: false,
        pageNo: prevPageNo,
        count: state.count - 1,
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
