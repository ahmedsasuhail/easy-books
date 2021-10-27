import { salesActions } from './salesActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create
export const salesCreate = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesCreateRequest());
    try {
      const response = await axios.post(
        'sales/',
        {
          purchase_id: +values.formValues.purchase_id,
          inventory_id: +values.formValues.inventory_id,
          relationship_id: +values.formValues.relationship_id,
          price: +values.formValues.price,
          date: values.formValues.date,
          returned: values.formValues.returned,
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(salesActions.salesCreateSuccess(response.data.data));
      } else {
        console.log('Error: ', response);
        dispatch(salesActions.salesCreateFailure());
      }
    } catch (error) {
      dispatch(salesActions.salesCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

// Update
export const salesUpdate = (values) => {
  return async (dispatch) => {
    dispatch(salesActions.salesUpdateRequest());
    try {
      const response = await axios.patch(
        'sales/',
        {
          purchase_id: +values.formValues.purchase_id,
          inventory_id: +values.formValues.inventory_id,
          relationship_id: +values.formValues.relationship_id,
          price: +values.formValues.price,
          date: values.formValues.date,
          returned: values.formValues.returned,
          id: +values.formValues.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(salesActions.salesUpdateSuccess(response.data.data));
      } else {
        console.log('Error: ', response);
        dispatch(salesActions.salesUpdateFailure());
      }
    } catch (error) {
      dispatch(salesActions.salesUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
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
      } else {
        console.log('Error: ', response);
        dispatch(salesActions.salesReadFailure());
      }
    } catch (error) {
      dispatch(salesActions.salesReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
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
        console.log('Error: ', response);
        dispatch(salesActions.salesDeleteFailure());
      }
    } catch (error) {
      dispatch(salesActions.salesDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};
