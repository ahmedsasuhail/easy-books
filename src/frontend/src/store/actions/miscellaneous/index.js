import { miscellaneousActions } from "./miscellaneousActions";
import axios from "../../../utils/axiosInstance";
import { userActions } from "../user/userActions";

// Action Creators
export const miscellaneousCreate = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.miscellaneousCreateRequest());
    try {
      const response = await axios.post(
        "miscellaneous/",
        {
          date: values.formValues.date,
          description: values.formValues.description,
          price: +values.formValues.price,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(
          miscellaneousActions.miscellaneousCreateSuccess(response.data.data)
        );
      } else {
        console.log("Error: ", response);
        dispatch(miscellaneousActions.miscellaneousCreateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(miscellaneousActions.miscellaneousCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

export const miscellaneousUpdate = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.miscellaneousUpdateRequest());
    try {
      const response = await axios.patch(
        "miscellaneous/",
        {
          date: values.formValues.date,
          description: values.formValues.description,
          price: +values.formValues.price,
          id: +values.formValues.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        }
      );
      if (response.data.data) {
        dispatch(
          miscellaneousActions.miscellaneousUpdateSuccess(response.data.data)
        );
      } else {
        console.log("Error: ", response);
        dispatch(miscellaneousActions.miscellaneousUpdateFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(miscellaneousActions.miscellaneousUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

export const miscellaneousRead = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.miscellaneousReadRequest());
    try {
      const response = await axios.get(
        `miscellaneous/?page=${values.pageNo + 1}&page_limit=${
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
        dispatch(
          miscellaneousActions.miscellaneousReadSuccess(response.data.data)
        );
      } else {
        console.log("Error: ", response);
        dispatch(miscellaneousActions.miscellaneousReadFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(miscellaneousActions.miscellaneousReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

export const miscellaneousDelete = (values) => {
  return async (dispatch) => {
    let result;
    dispatch(miscellaneousActions.miscellaneousDeleteRequest());
    try {
      const response = await axios.delete("miscellaneous/", {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(miscellaneousActions.miscellaneousDeleteSuccess());
        result = true;
      } else {
        console.log("Error: ", response);
        dispatch(miscellaneousActions.miscellaneousDeleteFailure());
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch(miscellaneousActions.miscellaneousDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
    return result;
  };
};
