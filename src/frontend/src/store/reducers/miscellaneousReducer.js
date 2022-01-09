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
} from "../actions/actionTypes";
import { mergeObjects } from "../../utils/helpers";

const initialState = {
  miscellaneous: [],
  orderBy: "id",
  order: "asc",
  pageNo: 0,
  rowsPerPage: 5,
  count: 0,
  query: "",
  formLoading: false,
  pageLoading: false,
};

const miscellaneousReducer = (state = initialState, action) => {
  switch (action.type) {
    case MISCELLANEOUS_CREATE_REQUEST:
      return mergeObjects(state, {
        query: "",
        formLoading: true,
        pageLoading: true,
      });

    case MISCELLANEOUS_CREATE_SUCCESS:
      let modifyMiscellaneousForCreate;
      let nextPageNo = state.pageNo;

      modifyMiscellaneousForCreate =
        state.miscellaneous.length === 0
          ? [action.payload.miscellaneous]
          : state.miscellaneous.length === 5
          ? []
          : [...state.miscellaneous, action.payload.miscellaneous];

      if (
        state.miscellaneous.length !== 0 &&
        state.miscellaneous.length % state.rowsPerPage === 0
      ) {
        nextPageNo = Math.floor(state.count / state.rowsPerPage);
      }

      return mergeObjects(state, {
        miscellaneous: modifyMiscellaneousForCreate,
        formLoading: false,
        pageLoading: false,
        pageNo: nextPageNo,
        count: state.count + 1,
      });

    case MISCELLANEOUS_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case MISCELLANEOUS_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case MISCELLANEOUS_UPDATE_SUCCESS:
      let modifyMiscellaneousForUpdate = [...state.miscellaneous];

      const miscellaneousIndex = modifyMiscellaneousForUpdate.findIndex(
        (miscellaneous) =>
          +action.payload.miscellaneous.id === +miscellaneous.id
      );

      modifyMiscellaneousForUpdate.splice(
        miscellaneousIndex,
        1,
        action.payload.miscellaneous
      );

      return mergeObjects(state, {
        miscellaneous: modifyMiscellaneousForUpdate,
        formLoading: false,
        pageLoading: false,
        pageNo: state.pageNo,
        count: state.count,
      });

    case MISCELLANEOUS_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case MISCELLANEOUS_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case MISCELLANEOUS_READ_SUCCESS:
      return mergeObjects(state, {
        miscellaneous: action.payload.miscellaneous || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        query: action.payload.query,
        pageLoading: false,
      });

    case MISCELLANEOUS_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case MISCELLANEOUS_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case MISCELLANEOUS_DELETE_SUCCESS:
      return mergeObjects(state, {
        pageLoading: false,
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
