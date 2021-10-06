import { relationshipActions } from './relationshipActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create or Update
export const relationshipCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.loading());
    try {
      const response = await axios.put(
        'relationships/',
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
        dispatch(
          relationshipActions.relationshipCreateUpdateSuccess(
            response.data.data,
          ),
        );
      } else {
        dispatch(relationshipActions.relationshipCreateUpdateFailure());
        dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(relationshipActions.relationshipCreateUpdateFailure());
      dispatch(userActions.logoutUser());
    }
  };
};

// Read
export const relationshipRead = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.loading());
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
        dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(relationshipActions.relationshipReadFailure());
      dispatch(userActions.logoutUser());
    }
  };
};

// Delete
export const relationshipDelete = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.loading());
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
        dispatch(userActions.logoutUser());
      }
    } catch (error) {
      dispatch(relationshipActions.relationshipDeleteFailure());
      dispatch(userActions.logoutUser());
    }
  };
};
