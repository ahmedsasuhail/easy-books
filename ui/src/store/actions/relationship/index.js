import { relationshipActions } from './relationshipActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create or Update
export const relationshipCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.relationshipCreateUpdateRequest());
    try {
      const response = await axios.put(
        'relationships/',
        {
          name: values.formValues.name,
          address: values.formValues.address,
          phone_number: values.formValues.phone_number,
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
          relationshipActions.relationshipCreateUpdateSuccess(
            response.data.data,
          ),
        );
      } else if (response.status === 401) {
        console.log(response);
        dispatch(userActions.logoutUser());
        dispatch(relationshipActions.relationshipCreateUpdateFailure());
      } else {
        console.log(response);
        dispatch(relationshipActions.relationshipCreateUpdateFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(relationshipActions.relationshipCreateUpdateFailure());
    }
  };
};

// Read
export const relationshipRead = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.relationshipReadRequest());
    try {
      const response = await axios.get(
        `relationships/?page=1&page_limit=50&order_by=id&sort_order=asc`,
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(
          relationshipActions.relationshipReadSuccess(response.data.data),
        );
      } else {
        dispatch(relationshipActions.relationshipReadFailure());
        // dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(relationshipActions.relationshipReadFailure());
      // dispatch(userActions.logoutUser());
    }
  };
};

// Delete
export const relationshipDelete = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.relationshipDeleteRequest());
    try {
      const response = await axios.delete('relationships/', {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(
          relationshipActions.relationshipDeleteSuccess(response.data.data),
        );
      } else {
        dispatch(relationshipActions.relationshipDeleteFailure());
        // dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(relationshipActions.relationshipDeleteFailure());
      // dispatch(userActions.logoutUser());
    }
  };
};
