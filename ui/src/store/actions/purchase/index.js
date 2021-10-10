import { purchaseActions } from './purchaseActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create or Update
export const purchaseCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(purchaseActions.purchaseCreateUpdateRequest());
    try {
      const response = await axios.put(
        'purchases/',
        {
          company_name: values.formValues.company_name,
          vehicle_name: values.formValues.vehicle_name,
          date: values.formValues.date,
          price: +values.formValues.price,
          relationship_id: +values.formValues.relationship_id,
          ...(values.formValues.id && { id: +values.formValues.id }),
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(
          purchaseActions.purchaseCreateUpdateSuccess(response.data.data),
        );
      } else if (response.status === 401) {
        console.log(response);
        dispatch(userActions.logoutUser());
        dispatch(purchaseActions.purchaseCreateUpdateFailure());
      } else {
        console.log(response);
        dispatch(purchaseActions.purchaseCreateUpdateFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(purchaseActions.purchaseCreateUpdateFailure());
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
        dispatch(purchaseActions.purchaseReadFailure());
        // dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(purchaseActions.purchaseReadFailure());
      // dispatch(userActions.logoutUser());
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
        dispatch(purchaseActions.purchaseDeleteFailure());
        // dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(purchaseActions.purchaseDeleteFailure());
      // dispatch(userActions.logoutUser());
    }
  };
};
