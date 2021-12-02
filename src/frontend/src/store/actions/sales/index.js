import { salesActions } from "./salesActions";
import axios from "../../../utils/axiosInstance";
import { userActions } from "../user/userActions";

// Action Creators
export const salesCreate = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesCreateRequest());
    try {
      const response = await axios.post(
        "sales/",
        {
          purchase_id: +values.formValues.purchase_id,
          inventory_id: +values.formValues.inventory_id,
          relationship_id: +values.formValues.relationship_id,
          price: +values.formValues.price,
          date: values.formValues.date,
          credit: values.formValues.credit,
          quantity: +values.formValues.quantity,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(salesActions.salesCreateSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(salesActions.salesCreateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(salesActions.salesCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };
};

export const salesUpdate = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesUpdateRequest());
    try {
      const response = await axios.patch(
        "sales/",
        values.formValues.purchase_id
          ? {
              purchase_id: +values.formValues.purchase_id,
              inventory_id: +values.formValues.inventory_id,
              relationship_id: +values.formValues.relationship_id,
              price: +values.formValues.price,
              date: values.formValues.date,
              credit: values.formValues.credit && values.formValues.credit,
              quantity: +values.formValues.quantity,
              id: +values.formValues.id,
            }
          : {
              id: +values.formValues.id,
              returned:
                values.formValues.returned === true
                  ? values.formValues.returned
                  : false,
            },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(salesActions.salesUpdateSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(salesActions.salesUpdateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(salesActions.salesUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };
};

export const salesRead = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesReadRequest());
    try {
      const response = await axios.get(
        `sales/?page=${values.pageNo + 1}&page_limit=${
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
        dispatch(salesActions.salesReadSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(salesActions.salesReadFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(salesActions.salesReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };
};

export const salesDelete = (values) => {
  return async (dispatch) => {
    let result;
    dispatch(salesActions.salesDeleteRequest());
    try {
      const response = await axios.delete("sales/", {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(salesActions.salesDeleteSuccess(response.data.data));
        result = true;
      } else {
        console.log("Error: ", response);
        dispatch(salesActions.salesDeleteFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(salesActions.salesDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
    return result;
  };
};
