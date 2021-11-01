import { purchaseActions } from './purchaseActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create
export const purchaseCreate = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseCreateRequest());
    try {
      const response = await axios.post(
        'purchases/',
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
        },
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseCreateSuccess(response.data.data));
      } else {
        console.log('Error: ', response);
        dispatch(purchaseActions.purchaseCreateFailure());
      }
    } catch (error) {
      dispatch(purchaseActions.purchaseCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

// Update
export const purchaseUpdate = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseUpdateRequest());
    try {
      const response = await axios.patch(
        'purchases/',
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
        },
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseUpdateSuccess(response.data.data));
      } else {
        console.log('Error: ', response);
        dispatch(purchaseActions.purchaseUpdateFailure());
      }
    } catch (error) {
      dispatch(purchaseActions.purchaseUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

// Read
export const purchaseRead = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseReadRequest());
    try {
      const response = await axios.get(
        `purchases/?page=1&page_limit=50&order_by=id&sort_order=asc`,
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(purchaseActions.purchaseReadSuccess(response.data.data));
      } else {
        console.log('Error: ', response);
        dispatch(purchaseActions.purchaseReadFailure());
      }
    } catch (error) {
      dispatch(purchaseActions.purchaseReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

// Delete
export const purchaseDelete = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseDeleteRequest());
    try {
      const response = await axios.delete('purchases/', {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(purchaseActions.purchaseDeleteSuccess(response.data.data));
      } else {
        console.log('Error: ', response);
        dispatch(purchaseActions.purchaseDeleteFailure());
      }
    } catch (error) {
      dispatch(purchaseActions.purchaseDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};
