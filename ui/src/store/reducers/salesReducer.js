import {
  SALES_CREATE_UPDATE_REQUEST,
  SALES_CREATE_UPDATE_SUCCESS,
  SALES_CREATE_UPDATE_FAILURE,
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
    // Create or Update
    case SALES_CREATE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case SALES_CREATE_UPDATE_SUCCESS:
      let modifySalesForCreateOrUpdate = [...state.sales];
      const salesIndex = modifySalesForCreateOrUpdate.findIndex(
        (sales) => parseInt(action.payload.sales.id) === parseInt(sales.id),
      );

      if (salesIndex >= 0) {
        modifySalesForCreateOrUpdate.splice(
          salesIndex,
          1,
          action.payload.sales,
        );
      } else {
        modifySalesForCreateOrUpdate = [...state.sales, action.payload.sales];
      }
      return mergeObjects(state, {
        sales: modifySalesForCreateOrUpdate,
        formLoading: false,
        pageLoading: false,
      });

    case SALES_CREATE_UPDATE_FAILURE:
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
        (sales) => parseInt(action.payload.salesId) !== parseInt(sales.id),
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
