import { purchaseActions } from "./purchaseActions";
import axios from "../../../utils/axiosInstance";
import { userActions } from "../user/userActions";

// Action Creators
export const purchaseCreate = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseCreateRequest());
    try {
      const response = await axios.post(
        "purchases/",
        {
          company_name: values.formValues.company_name,
          vehicle_name: values.formValues.vehicle_name,
          date: values.formValues.date,
          price: +values.formValues.price,
          relationship_id: +values.formValues.relationship_id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseCreateSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(purchaseActions.purchaseCreateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(purchaseActions.purchaseCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

export const purchaseUpdate = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseUpdateRequest());
    try {
      const response = await axios.patch(
        "purchases/",
        {
          company_name: values.formValues.company_name,
          vehicle_name: values.formValues.vehicle_name,
          date: values.formValues.date,
          price: +values.formValues.price,
          relationship_id: +values.formValues.relationship_id,
          id: +values.formValues.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseUpdateSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(purchaseActions.purchaseUpdateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(purchaseActions.purchaseUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

export const purchaseRead = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseReadRequest());
    try {
      const response = await axios.get(
        `purchases/?page=${values.pageNo + 1}&page_limit=${
          values.rowsPerPage
        }&order_by=${values.orderBy}&sort_order=${values.order}`,
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseReadSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(purchaseActions.purchaseReadFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(purchaseActions.purchaseReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

export const purchaseDelete = (values) => {
  return async (dispatch) => {
    let result;
    dispatch(purchaseActions.purchaseDeleteRequest());
    try {
      const response = await axios.delete("purchases/", {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(purchaseActions.purchaseDeleteSuccess());
        result = true;
      } else {
        console.log("Error: ", response);
        dispatch(purchaseActions.purchaseDeleteFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(purchaseActions.purchaseDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      } else if (error.response && error.response.status === 500) {
        result = false;
      }
    }
    return result;
  };
};

export const purchaseSearch = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseSearchRequest());
    try {
      const response = await axios.post(
        "purchases/search",
        {
          search_term: values.keyword,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseSearchSuccess(response.data.data));
      } else {
        console.log("Error: ", response);
        dispatch(purchaseActions.purchaseSearchFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(purchaseActions.purchaseSearchFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};
