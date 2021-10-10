import * as actionTypes from '../actions/actionTypes';
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
    case actionTypes.SALES_CREATE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
      });

    case actionTypes.SALES_CREATE_UPDATE_SUCCESS:
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
      });

    case actionTypes.SALES_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
      });

    // Read
    case actionTypes.SALES_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.SALES_READ_SUCCESS:
      return mergeObjects(state, {
        sales: action.payload.sales,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case actionTypes.SALES_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case actionTypes.SALES_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.SALES_DELETE_SUCCESS:
      let modifySalesForDelete = [...state.sales];
      const modifiedSalesAfterDeleted = modifySalesForDelete.filter(
        (sales) => parseInt(action.payload.salesId) !== parseInt(sales.id),
      );
      return mergeObjects(state, {
        sales: modifiedSalesAfterDeleted,
        pageLoading: false,
      });

    case actionTypes.SALES_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default salesReducer;
