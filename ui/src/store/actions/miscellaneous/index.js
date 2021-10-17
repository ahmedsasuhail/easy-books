import { miscellaneousActions } from './miscellaneousActions';
import axios from '../../../utils/axiosInstance';
import { userActions } from '../user/userActions';

// Action Creators
// Create or Update
export const miscellaneousCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.miscellaneousCreateUpdateRequest());
    try {
      const response = await axios.put(
        'miscellaneous/',
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
          miscellaneousActions.miscellaneousCreateUpdateSuccess(
            response.data.data,
          ),
        );
      } else if (response.status === 401) {
        console.log(response);
        dispatch(miscellaneousActions.miscellaneousCreateUpdateFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(miscellaneousActions.miscellaneousCreateUpdateFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(miscellaneousActions.miscellaneousCreateUpdateFailure());
    }
  };
};

// Read
export const miscellaneousRead = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.miscellaneousReadRequest());
    try {
      const response = await axios.get(
        `miscellaneous/?page=1&page_limit=50&order_by=id&sort_order=asc`,
        {
          headers: {
            Authorization: values.token,
          },
        },
      );
      if (response.data.data) {
        dispatch(
          miscellaneousActions.miscellaneousReadSuccess(response.data.data),
        );
      } else if (response.status === 401) {
        console.log(response);
        dispatch(miscellaneousActions.miscellaneousReadFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(miscellaneousActions.miscellaneousReadFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(miscellaneousActions.miscellaneousReadFailure());
    }
  };
};

// Delete
export const miscellaneousDelete = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.miscellaneousDeleteRequest());
    try {
      const response = await axios.delete('miscellaneous/', {
        headers: {
          Authorization: values.token,
        },
        data: {
          id: +values.id,
        },
      });
      if (response.data.data) {
        dispatch(
          miscellaneousActions.miscellaneousDeleteSuccess(response.data.data),
        );
      } else if (response.status === 401) {
        console.log(response);
        dispatch(miscellaneousActions.miscellaneousDeleteFailure());
        dispatch(userActions.logoutUser());
      } else {
        console.log(response);
        dispatch(miscellaneousActions.miscellaneousDeleteFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(miscellaneousActions.miscellaneousDeleteFailure());
    }
  };
};
