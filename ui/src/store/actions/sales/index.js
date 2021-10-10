import { salesActions } from './salesActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create or Update
export const salesCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesCreateUpdateRequest());
    try {
      const response = await axios.put(
        'sales/',
        {
          date: values.formValues.date,
          description: values.formValues.description,
          price: +values.formValues.price,
          ...(values.formValues.id && { id: +values.formValues.id }),
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(salesActions.salesCreateUpdateSuccess(response.data.data));
      } else {
        dispatch(salesActions.salesCreateUpdateFailure());
        // dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(salesActions.salesCreateUpdateFailure());
      // dispatch(userActions.logoutUser());
    }
  };
};

// Read
export const salesRead = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesReadRequest());
    try {
      const response = await axios.get(
        `sales/?page=1&page_limit=50&order_by=id&sort_order=asc`,
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(salesActions.salesReadSuccess(response.data.data));
      } else if (response.status === 401) {
        console.log(response);
        dispatch(salesActions.salesReadFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(salesActions.salesReadFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(salesActions.salesReadFailure());
    }
  };
};

// Delete
export const salesDelete = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesDeleteRequest());
    try {
      const response = await axios.delete('sales/', {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(salesActions.salesDeleteSuccess(response.data.data));
      } else {
        dispatch(salesActions.salesDeleteFailure());
        // dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(salesActions.salesDeleteFailure());
      // dispatch(userActions.logoutUser());
    }
  };
};
