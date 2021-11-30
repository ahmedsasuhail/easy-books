import {
  INVENTORY_PURCHASE_REQUEST,
  INVENTORY_PURCHASE_SUCCESS,
  INVENTORY_PURCHASE_FAILURE,
  INVENTORY_PURCHASE_CLEAR,
} from "../actionTypes";

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
        pageNo: values.page - 1,
        rowsPerPage: values.page_limit,
        orderBy: values.order_by,
        order: values.sort_order,
        count: values.total_matched_count,
      },
    };
  },

  inventoryPurchaseFailure: () => {
    return {
      type: INVENTORY_PURCHASE_FAILURE,
    };
  },

  inventoryPurchaseClear: () => {
    return {
      type: INVENTORY_PURCHASE_CLEAR,
    };
  },
};
