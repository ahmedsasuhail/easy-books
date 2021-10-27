import { inventoryPurchaseActions } from './inventoryPurchaseActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

export const getInventoryPurchase = (values) => {
  return async (dispatch) => {
    try {
      dispatch(inventoryPurchaseActions.inventoryPurchaseRequest());
      const response = await axios.post(
        'inventory/get_by_purchase?page=1&page_limit=50&order_by=id&sort_order=asc',
        {
          purchase_id: +values.id,
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
      } else {
        console.log('Error: ', response);
        dispatch(inventoryPurchaseActions.inventoryPurchaseFailure());
      }
    } catch (error) {
      dispatch(inventoryPurchaseActions.inventoryPurchaseFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};
