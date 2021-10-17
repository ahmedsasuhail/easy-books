import { inventoryPurchaseActions } from './inventoryPurchaseActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

export const getInventoryPurchase = (values) => {
  return async (dispatch) => {
    try {
      dispatch(inventoryPurchaseActions.inventoryPurchaseClear());
      const response = await axios.post(
        'inventory/get_by_purchase?page=1&page_limit=50&order_by=id&sort_order=asc',
        {
          id: +values.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(
          inventoryPurchaseActions.inventoryPurchaseSuccess(response.data.data),
        );
      } else if (response.status === 401) {
        console.log(response);
        dispatch(inventoryPurchaseActions.inventoryPurchaseClear());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(inventoryPurchaseActions.inventoryPurchaseClear());
      }
    } catch (error) {
      console.log(error);
      dispatch(inventoryPurchaseActions.inventoryPurchaseClear());
    }
  };
};
