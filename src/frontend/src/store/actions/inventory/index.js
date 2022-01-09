import { inventoryActions } from "./inventoryActions";
import axios from "../../../utils/axiosInstance";
import { userActions } from "../user/userActions";

// Action Creators
export const inventoryCreate = (values) => {
  return async (dispatch) => {
    dispatch(inventoryActions.inventoryCreateRequest());
    try {
      const response = await axios.post(
        "inventory/",
        {
          part_name: values.formValues.part_name,
          quantity: +values.formValues.quantity,
          purchase_id: +values.formValues.purchase_id,
          date: values.formValues.date,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(inventoryActions.inventoryCreateSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(inventoryActions.inventoryCreateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(inventoryActions.inventoryCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };
};

export const inventoryUpdate = (values) => {
  return async (dispatch) => {
    dispatch(inventoryActions.inventoryUpdateRequest());
    try {
      const response = await axios.patch(
        "inventory/",
        {
          part_name: values.formValues.part_name,
          quantity: +values.formValues.quantity,
          purchase_id: +values.formValues.purchase_id,
          date: values.formValues.date,
          id: +values.formValues.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(inventoryActions.inventoryUpdateSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(inventoryActions.inventoryUpdateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(inventoryActions.inventoryUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };
};

export const inventoryRead = (values) => {
  return async (dispatch) => {
    dispatch(inventoryActions.inventoryReadRequest());
    try {
      const response = await axios.get(
        `inventory/?page=${values.pageNo + 1}&page_limit=${
          values.rowsPerPage
        }&order_by=${values.orderBy}&sort_order=${values.order}&q=${
          values.query
        }`,
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(inventoryActions.inventoryReadSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(inventoryActions.inventoryReadFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(inventoryActions.inventoryReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };
};

export const inventoryDelete = (values) => {
  return async (dispatch) => {
    let result;
    dispatch(inventoryActions.inventoryDeleteRequest());
    try {
      const response = await axios.delete("inventory/", {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(inventoryActions.inventoryDeleteSuccess());
        result = true;
      } else {
        console.log("Error: ", response);
        dispatch(inventoryActions.inventoryDeleteFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(inventoryActions.inventoryDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      } else if (error.response && error.response.status === 500) {
        result = false;
      }
    }
    return result;
  };
};
