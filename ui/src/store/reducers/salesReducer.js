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
} from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  sales: [],
  pageNo: null,
  formLoading: false,
  pageLoading: false,
};

// Reducer
const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create
    case SALES_CREATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case SALES_CREATE_SUCCESS:
      let modifySalesForCreate;
      if (state.sales) {
        modifySalesForCreate = [...state.sales, action.payload.sales];
      } else {
        modifySalesForCreate = [action.payload.sales];
      }

      return mergeObjects(state, {
        sales: modifySalesForCreate,
        formLoading: false,
        pageLoading: false,
      });

    case SALES_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Update
    case SALES_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case SALES_UPDATE_SUCCESS:
      let modifySalesForUpdate = [...state.sales];
      const salesIndex = modifySalesForUpdate.findIndex(
        (sales) => +action.payload.sales.id === +sales.id,
      );

      modifySalesForUpdate.splice(salesIndex, 1, action.payload.sales);

      return mergeObjects(state, {
        sales: modifySalesForUpdate,
        formLoading: false,
        pageLoading: false,
      });

    case SALES_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    // Read
    case SALES_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case SALES_READ_SUCCESS:
      return mergeObjects(state, {
        sales: action.payload.sales,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case SALES_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case SALES_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case SALES_DELETE_SUCCESS:
      let modifySalesForDelete = [...state.sales];
      const modifiedSalesAfterDeleted = modifySalesForDelete.filter(
        (sales) => +action.payload.salesId !== +sales.id,
      );
      return mergeObjects(state, {
        sales: modifiedSalesAfterDeleted,
        pageLoading: false,
      });

    case SALES_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default salesReducer;
