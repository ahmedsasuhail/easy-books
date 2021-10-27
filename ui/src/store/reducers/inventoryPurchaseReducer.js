import {
  INVENTORY_PURCHASE_REQUEST,
  INVENTORY_PURCHASE_SUCCESS,
  INVENTORY_PURCHASE_FAILURE,
} from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

const initialState = {
  data: '',
};

const inventoryPurchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORY_PURCHASE_REQUEST:
      return mergeObjects(state, {
        data: '',
      });
    case INVENTORY_PURCHASE_SUCCESS:
      return mergeObjects(state, {
        data: action.payload.data,
      });
    case INVENTORY_PURCHASE_FAILURE:
      return mergeObjects(state, {
        data: '',
      });
    default:
      return state;
  }
};

export default inventoryPurchaseReducer;
