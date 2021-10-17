import {
  INVENTORY_PURCHASE_SUCCESS,
  INVENTORY_PURCHASE_CLEAR,
} from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

const initialState = {
  id: '',
};

const inventoryPurchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORY_PURCHASE_SUCCESS:
      return mergeObjects(state, {
        id: action.payload.id,
      });
    case INVENTORY_PURCHASE_CLEAR:
      return mergeObjects(state, {
        id: '',
      });
    default:
      return state;
  }
};

export default inventoryPurchaseReducer;
