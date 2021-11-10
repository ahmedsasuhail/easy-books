import {
  INVENTORY_PURCHASE_REQUEST,
  INVENTORY_PURCHASE_SUCCESS,
  INVENTORY_PURCHASE_FAILURE,
  INVENTORY_PURCHASE_CLEAR,
} from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

const initialState = {
  data: [],
  orderBy: 'date',
  order: 'desc',
  pageNo: 0,
  rowsPerPage: 5,
  count: 0,
  loading: false,
};

const inventoryPurchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORY_PURCHASE_REQUEST:
      return mergeObjects(state, {
        data: [],
        loading: true,
      });
    case INVENTORY_PURCHASE_SUCCESS:
      return mergeObjects(state, {
        data: action.payload.data || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        loading: false,
      });
    case INVENTORY_PURCHASE_FAILURE:
      return mergeObjects(state, {
        data: [],
        loading: false,
      });
    case INVENTORY_PURCHASE_CLEAR:
      return mergeObjects(state, {
        data: [],
        loading: false,
      });
    default:
      return state;
  }
};

export default inventoryPurchaseReducer;
