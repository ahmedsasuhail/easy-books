import {
  INVENTORY_PURCHASE_REQUEST,
  INVENTORY_PURCHASE_SUCCESS,
  INVENTORY_PURCHASE_FAILURE,
} from '../actionTypes';

export const inventoryPurchaseActions = {
  inventoryPurchaseRequest: () => {
    return {
      type: INVENTORY_PURCHASE_REQUEST,
    };
  },
  inventoryPurchaseSuccess: (values) => {
    return {
      type: INVENTORY_PURCHASE_SUCCESS,
      payload: {
        data: values,
      },
    };
  },

  inventoryPurchaseFailure: () => {
    return {
      type: INVENTORY_PURCHASE_FAILURE,
    };
  },
};
