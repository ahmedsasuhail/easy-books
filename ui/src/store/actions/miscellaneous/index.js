import { miscellaneousActions } from './miscellaneousAction';
import axios from '../../../utils/axiosInstance';

// Action Creators
// Create or Update
export const miscellaneousCreateUpdate = (values) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.loading());
    try {
      console.log(values.values);
      const response = await axios.put('miscellaneous', {
        headers: {
          Authorization: 'Bearer ' + values.token,
        },
        data: { ...values.values },
      });
      console.log(response);
      if (response.data && response.data.id) {
        dispatch(
          miscellaneousActions.miscellaneousCreateUpdateSuccess(response),
        );
      } else {
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
    dispatch(miscellaneousActions.loading());
    try {
      const response = await axios.get(
        `miscellaneous/?page=1&page_limit=50&order_by=id&sort_order=asc`,
        {
          headers: {
            Authorization: 'Bearer ' + values.token,
          },
        },
      );

      if (response && response.data) {
        dispatch(miscellaneousActions.miscellaneousReadSuccess(response.data));
      }
      // else if ((response.status = 401)) {
      //   dispatch(userLogout());
      // }
      else {
        dispatch(miscellaneousActions.miscellaneousReadFailure());
      }
    } catch (error) {
      dispatch(miscellaneousActions.miscellaneousReadFailure());
    }
  };
};

// Delete
export const miscellaneousDelete = ({ id, token }) => {
  return async (dispatch) => {
    dispatch(miscellaneousActions.loading());
    try {
      // const response = await axios.delete(
      //   'miscellaneous',
      //   { id },
      //   { headers: { Authorization: 'Bearer ' + token } },
      // );

      const response = await fetch('miscellaneous', {
        method: 'DELETE',
        body: { id },
        headers: {
          'Content-type': 'application/json',
        },
      });

      // const response = axios.delete('miscellaneous', {
      //   headers: {
      //     Authorization: 'Bearer ' + token,
      //   },
      //   data: {
      //     id,
      //   },
      // });

      console.log(response);

      if (response.data) {
        dispatch(miscellaneousActions.miscellaneousDeleteSuccess(id));
      } else {
        dispatch(miscellaneousActions.miscellaneousDeleteFailure());
      }
    } catch (error) {
      console.log(error);
      dispatch(miscellaneousActions.miscellaneousDeleteFailure());
    }
  };
};
