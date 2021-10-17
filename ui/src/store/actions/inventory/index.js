import { inventoryActions } from './inventoryActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create or Update
export const inventoryCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(inventoryActions.inventoryCreateUpdateRequest());
    try {
      const response = await axios.put(
        'inventory/',
        {
          part_name: values.formValues.part_name,
          quantity: +values.formValues.quantity,
          purchase_id: +values.formValues.purchase_id,
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
        dispatch(
          inventoryActions.inventoryCreateUpdateSuccess(response.data.data),
        );
      } else if (response.status === 401) {
        dispatch(inventoryActions.inventoryCreateUpdateFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(inventoryActions.inventoryCreateUpdateFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(inventoryActions.inventoryCreateUpdateFailure());
    }
  };
};

// Read
export const inventoryRead = (values) => {
  return async (dispatch) => {
    dispatch(inventoryActions.inventoryReadRequest());
    try {
      const response = await axios.get(
        `inventory/?page=1&page_limit=50&order_by=id&sort_order=asc`,
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(inventoryActions.inventoryReadSuccess(response.data.data));
      } else if (response.status === 401) {
        dispatch(inventoryActions.inventoryReadFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(inventoryActions.inventoryReadFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(inventoryActions.inventoryReadFailure());
    }
  };
};

// Delete
export const inventoryDelete = (values) => {
  return async (dispatch) => {
    dispatch(inventoryActions.inventoryDeleteRequest());
    try {
      const response = await axios.delete('inventory/', {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(inventoryActions.inventoryDeleteSuccess(response.data.data));
      } else if (response.status === 401) {
        console.log(response);
        dispatch(inventoryActions.inventoryDeleteFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(inventoryActions.inventoryDeleteFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(inventoryActions.inventoryDeleteFailure());
    }
  };
};
