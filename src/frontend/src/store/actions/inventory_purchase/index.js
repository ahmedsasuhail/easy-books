import { inventoryPurchaseActions } from "./inventoryPurchaseActions";
import axios from "../../../utils/axiosInstance";
import { userActions } from "../user/userActions";

// Action Creators
export const getInventoryPurchase = (values) => {
  return async (dispatch) => {
    let result;
    dispatch(inventoryPurchaseActions.inventoryPurchaseRequest());
    try {
      const response = await axios.post(
        `inventory/get_by_purchase?page=${values.pageNo + 1}&page_limit=${
          values.rowsPerPage
        }&order_by=${values.orderBy}&sort_order=${values.order}`,
        {
          purchase_id: +values.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        result = response.data.data.records;
        dispatch(
          inventoryPurchaseActions.inventoryPurchaseSuccess(response.data.data)
        );
      } else {
        console.log("Error: ", response);
        dispatch(inventoryPurchaseActions.inventoryPurchaseFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(inventoryPurchaseActions.inventoryPurchaseFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.message));
      }
    }
    return result;
  };
};
