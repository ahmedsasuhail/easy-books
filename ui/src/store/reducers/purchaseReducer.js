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
  PURCHASE_DELETE_REQUEST,
  PURCHASE_DELETE_SUCCESS,
  PURCHASE_DELETE_FAILURE,
} from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  purchases: [],
  pageNo: null,
  formLoading: false,
  pageLoading: false,
};

// Reducer
const purchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create
    case PURCHASE_CREATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case PURCHASE_CREATE_SUCCESS:
      let modifyPurchasesForCreate = [
        ...state.purchases,
        action.payload.purchase,
      ];

      return mergeObjects(state, {
        purchases: modifyPurchasesForCreate,
        formLoading: false,
        pageLoading: false,
      });

    case PURCHASE_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Update
    case PURCHASE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case PURCHASE_UPDATE_SUCCESS:
      let modifyPurchasesForUpdate = [...state.purchases];
      const purchaseIndex = modifyPurchasesForUpdate.findIndex(
        (purchase) => +action.payload.purchase.id === +purchase.id,
      );

      modifyPurchasesForUpdate.splice(
        purchaseIndex,
        1,
        action.payload.purchase,
      );

      return mergeObjects(state, {
        purchases: modifyPurchasesForUpdate,
        formLoading: false,
        pageLoading: false,
      });

    case PURCHASE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Read
    case PURCHASE_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case PURCHASE_READ_SUCCESS:
      return mergeObjects(state, {
        purchases: action.payload.purchases,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case PURCHASE_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case PURCHASE_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case PURCHASE_DELETE_SUCCESS:
      let modifyPurchaseForDelete = [...state.purchases];
      const modifiedPurchasesAfterDeleted = modifyPurchaseForDelete.filter(
        (purchase) => +action.payload.purchaseId !== +purchase.id,
      );
      return mergeObjects(state, {
        purchases: modifiedPurchasesAfterDeleted,
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
