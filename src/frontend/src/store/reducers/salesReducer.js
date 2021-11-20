import {
  SALES_CREATE_REQUEST,
  SALES_CREATE_SUCCESS,
  SALES_CREATE_FAILURE,
  SALES_UPDATE_REQUEST,
  SALES_UPDATE_SUCCESS,
  SALES_UPDATE_FAILURE,
  SALES_READ_REQUEST,
  SALES_READ_SUCCESS,
  SALES_READ_FAILURE,
  SALES_DELETE_REQUEST,
  SALES_DELETE_SUCCESS,
  SALES_DELETE_FAILURE,
  SALES_SEARCH_REQUEST,
  SALES_SEARCH_SUCCESS,
  SALES_SEARCH_FAILURE,
} from "../actions/actionTypes";
import { mergeObjects } from "../../utils/helpers";

const initialState = {
  sales: [],
  orderBy: "id",
  order: "asc",
  pageNo: 0,
  rowsPerPage: 5,
  count: 0,
  formLoading: false,
  pageLoading: false,
};

const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALES_CREATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case SALES_CREATE_SUCCESS:
      let modifySalesForCreate;
      let nextPageNo = state.pageNo;

      modifySalesForCreate =
        state.sales.length === 0
          ? [action.payload.sales]
          : state.sales.length === 5
          ? []
          : [...state.sales, action.payload.sales];

      if (
        state.sales.length !== 0 &&
        state.sales.length % state.rowsPerPage === 0
      ) {
        nextPageNo = Math.floor(state.count / state.rowsPerPage);
      }

      return mergeObjects(state, {
        sales: modifySalesForCreate,
        formLoading: false,
        pageLoading: false,
        pageNo: nextPageNo,
        count: state.count + 1,
      });

    case SALES_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case SALES_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case SALES_UPDATE_SUCCESS:
      let modifySalesForUpdate = [...state.sales];

      const salesIndex = modifySalesForUpdate.findIndex(
        (sales) => +action.payload.sales.id === +sales.id
      );

      modifySalesForUpdate.splice(salesIndex, 1, action.payload.sales);

      return mergeObjects(state, {
        sales: modifySalesForUpdate,
        formLoading: false,
        pageLoading: false,
        pageNo: state.pageNo,
        count: state.count,
      });

    case SALES_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case SALES_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case SALES_READ_SUCCESS:
      return mergeObjects(state, {
        sales: action.payload.sales || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        pageLoading: false,
      });

    case SALES_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case SALES_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case SALES_DELETE_SUCCESS:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case SALES_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case SALES_SEARCH_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case SALES_SEARCH_SUCCESS:
      return mergeObjects(state, {
        sales: action.payload.sales || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        pageLoading: false,
      });

    case SALES_SEARCH_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default salesReducer;
