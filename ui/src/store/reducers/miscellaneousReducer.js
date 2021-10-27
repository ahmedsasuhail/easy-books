import {
  MISCELLANEOUS_CREATE_REQUEST,
  MISCELLANEOUS_CREATE_SUCCESS,
  MISCELLANEOUS_CREATE_FAILURE,
  MISCELLANEOUS_UPDATE_REQUEST,
  MISCELLANEOUS_UPDATE_SUCCESS,
  MISCELLANEOUS_UPDATE_FAILURE,
  MISCELLANEOUS_READ_REQUEST,
  MISCELLANEOUS_READ_SUCCESS,
  MISCELLANEOUS_READ_FAILURE,
  MISCELLANEOUS_DELETE_REQUEST,
  MISCELLANEOUS_DELETE_SUCCESS,
  MISCELLANEOUS_DELETE_FAILURE,
} from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  miscellaneous: [],
  pageNo: 0,
  rowsPerPage: 5,
  orderBy: 'id',
  order: 'asc',
  count: 5,
  formLoading: false,
  pageLoading: false,
};

// Reducer
const miscellaneousReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create
    case MISCELLANEOUS_CREATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case MISCELLANEOUS_CREATE_SUCCESS:
      let modifyMiscellaneousForCreate;

      if (state.miscellaneous.length % state.rowsPerPage === 0) {
        modifyMiscellaneousForCreate = [action.payload.miscellaneous];
      } else {
        modifyMiscellaneousForCreate = [
          ...state.miscellaneous,
          action.payload.miscellaneous,
        ];
      }

      const createNextPageNo =
        state.count % state.rowsPerPage === 0 ? state.pageNo + 1 : state.pageNo;

      return mergeObjects(state, {
        miscellaneous: modifyMiscellaneousForCreate,
        formLoading: false,
        pageLoading: false,
        pageNo: createNextPageNo,
        count: state.count + 1,
      });

    case MISCELLANEOUS_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Update
    case MISCELLANEOUS_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case MISCELLANEOUS_UPDATE_SUCCESS:
      let modifyMiscellaneousForUpdate = [...state.miscellaneous];
      const miscellaneousIndex = modifyMiscellaneousForUpdate.findIndex(
        (miscellaneous) =>
          +action.payload.miscellaneous.id === +miscellaneous.id,
      );

      modifyMiscellaneousForUpdate.splice(
        miscellaneousIndex,
        1,
        action.payload.miscellaneous,
      );

      const nextPageNo =
        state.count % state.rowsPerPage === 0 ? state.pageNo + 1 : state.pageNo;

      return mergeObjects(state, {
        miscellaneous: modifyMiscellaneousForUpdate,
        formLoading: false,
        pageLoading: false,
        pageNo: nextPageNo,
        count: state.count + 1,
      });

    case MISCELLANEOUS_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Read
    case MISCELLANEOUS_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case MISCELLANEOUS_READ_SUCCESS:
      return mergeObjects(state, {
        miscellaneous: action.payload.miscellaneous,
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        pageLoading: false,
      });

    case MISCELLANEOUS_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case MISCELLANEOUS_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case MISCELLANEOUS_DELETE_SUCCESS:
      let modifyMiscellaneousForDelete = [...state.miscellaneous];
      const modifiedMiscellaneousAfterDeleted =
        modifyMiscellaneousForDelete.filter(
          (miscellaneous) =>
            +action.payload.miscellaneousId !== +miscellaneous.id,
        );
      const prevPageNo =
        state.count % state.rowsPerPage === 1 && state.count > state.rowsPerPage
          ? state.pageNo - 1
          : state.pageNo;

      return mergeObjects(state, {
        miscellaneous: modifiedMiscellaneousAfterDeleted,
        pageLoading: false,
        pageNo: prevPageNo,
        count: state.count - 1,
      });

    case MISCELLANEOUS_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default miscellaneousReducer;
