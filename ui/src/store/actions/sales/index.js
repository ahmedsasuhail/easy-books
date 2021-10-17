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
          purchase_id: +values.formValues.purchase_id,
          inventory_id: +values.formValues.inventory_id,
          relationship_id: +values.formValues.relationship_id,
          price: +values.formValues.price,
          date: values.formValues.date,
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
      } else if (response.status === 401) {
        console.log(response);
        dispatch(salesActions.salesCreateUpdateFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(salesActions.salesCreateUpdateFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(salesActions.salesCreateUpdateFailure());
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
      } else if (response.status === 401) {
        console.log(response);
        dispatch(salesActions.salesDeleteFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(salesActions.salesDeleteFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(salesActions.salesDeleteFailure());
    }
  };
};
