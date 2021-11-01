import { relationshipActions } from './relationshipActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create
export const relationshipCreate = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.relationshipCreateRequest());
    try {
      const response = await axios.post(
        'relationships/',
        {
          name: values.formValues.name,
          address: values.formValues.address,
          phone_number: values.formValues.phone_number,
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(
          relationshipActions.relationshipCreateSuccess(response.data.data),
        );
      } else {
        console.log('Error: ', response);
        dispatch(relationshipActions.relationshipCreateFailure());
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch(relationshipActions.relationshipCreateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

// Update
export const relationshipUpdate = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.relationshipUpdateRequest());
    try {
      const response = await axios.patch(
        'relationships/',
        {
          name: values.formValues.name,
          address: values.formValues.address,
          phone_number: values.formValues.phone_number,
          id: +values.formValues.id,
        },
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(
          relationshipActions.relationshipUpdateSuccess(response.data.data),
        );
      } else {
        console.log('Error: ', response);
        dispatch(relationshipActions.relationshipUpdateFailure());
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch(relationshipActions.relationshipUpdateFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};

// Read
export const relationshipRead = (values) => {
  return async (dispatch) => {
    dispatch(relationshipActions.relationshipReadRequest());
    try {
      const response = await axios.get(
        `relationships/?page=${values.pageNo + 1}&page_limit=${
          values.rowsPerPage
        }&order_by=${values.orderBy}&sort_order=${values.order}`,
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
        console.log('Error: ', response);
        dispatch(relationshipActions.relationshipReadFailure());
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch(relationshipActions.relationshipReadFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
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
        console.log('Error: ', response);
        dispatch(relationshipActions.relationshipDeleteFailure());
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch(relationshipActions.relationshipDeleteFailure());
      if (error.response && error.response.status === 401) {
        dispatch(userActions.logoutUser());
      }
    }
  };
};
