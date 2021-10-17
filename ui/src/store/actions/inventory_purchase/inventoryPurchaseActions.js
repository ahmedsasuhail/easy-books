import {
  INVENTORY_PURCHASE_SUCCESS,
  INVENTORY_PURCHASE_CLEAR,
} from '../actionTypes';

export const inventoryPurchaseActions = {
  inventoryPurchaseSuccess: (values) => {
    return {
      type: INVENTORY_PURCHASE_SUCCESS,
      payload: {
        id: values,
      },
    };
  },

  inventoryPurchaseClear: () => {
    return {
      type: INVENTORY_PURCHASE_CLEAR,
    };
  },
};
