import {
  PURCHASE_CREATE_REQUEST,
  PURCHASE_CREATE_SUCCESS,
  PURCHASE_CREATE_FAILURE,
  PURCHASE_UPDATE_REQUEST,
  PURCHASE_UPDATE_SUCCESS,
  PURCHASE_UPDATE_FAILURE,
  PURCHASE_READ_REQUEST,
  PURCHASE_READ_SUCCESS,
  PURCHASE_READ_FAILURE,
  PURCHASE_READ_CLEAR,
  PURCHASE_DELETE_REQUEST,
  PURCHASE_DELETE_SUCCESS,
  PURCHASE_DELETE_FAILURE,
} from "../actions/actionTypes";
import { mergeObjects } from "../../utils/helpers";

const initialState = {
  purchases: [],
  orderBy: "id",
  order: "asc",
  pageNo: 0,
  rowsPerPage: 5,
  count: 0,
  query: "",
  formLoading: false,
  pageLoading: false,
};

const purchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case PURCHASE_CREATE_REQUEST:
      return mergeObjects(state, {
        query: "",
        formLoading: true,
        pageLoading: true,
      });

    case PURCHASE_CREATE_SUCCESS:
      let modifyPurchasesForCreate;
      let nextPageNo = state.pageNo;

      modifyPurchasesForCreate =
        state.purchases.length === 0
          ? [action.payload.purchase]
          : state.purchases.length === 5
          ? []
          : [...state.purchases, action.payload.purchase];

      if (
        state.purchases.length !== 0 &&
        state.purchases.length % state.rowsPerPage === 0
      ) {
        nextPageNo = Math.floor(state.count / state.rowsPerPage);
      }

      return mergeObjects(state, {
        purchases: modifyPurchasesForCreate,
        formLoading: false,
        pageLoading: false,
        pageNo: nextPageNo,
        count: state.count + 1,
      });

    case PURCHASE_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case PURCHASE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case PURCHASE_UPDATE_SUCCESS:
      let modifyPurchasesForUpdate = [...state.purchases];

      const purchaseIndex = modifyPurchasesForUpdate.findIndex(
        (purchase) => +action.payload.purchase.id === +purchase.id
      );

      modifyPurchasesForUpdate.splice(
        purchaseIndex,
        1,
        action.payload.purchase
      );

      return mergeObjects(state, {
        purchases: modifyPurchasesForUpdate,
        formLoading: false,
        pageLoading: false,
        pageNo: state.pageNo,
        count: state.count,
      });

    case PURCHASE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case PURCHASE_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case PURCHASE_READ_SUCCESS:
      return mergeObjects(state, {
        purchases: action.payload.purchases || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        query: action.payload.query,
        pageLoading: false,
      });

    case PURCHASE_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case PURCHASE_READ_CLEAR:
      return mergeObjects(state, {
        pageLoading: false,
        pageNo: 0,
        rowsPerPage: 5,
        orderBy: "id",
        order: "asc",
        query: "",
      });

    case PURCHASE_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case PURCHASE_DELETE_SUCCESS:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case PURCHASE_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default purchaseReducer;
