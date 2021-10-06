import { userActions } from './userActions';
import { usePost, useGet } from '../../../utils/webServices';
import axios from '../../../utils/axiosInstance';

// Action Creators
// Register
export const userRegisteration = (values) => {
  return async (dispatch) => {
    dispatch(userActions.loading());
    try {
      const response = await axios.post(
        'auth/register',
        JSON.stringify({ ...values }),
      );
      if (response.data && response.data.userName) {
        dispatch(userActions.registrationSuccess(response));
      } else {
        dispatch(userActions.registrationFailure(response));
      }
    } catch (error) {
      dispatch(userActions.registrationFailure(error));
    }
  };
};

// Login
export const userLogin = (login, password, history) => {
  return async (dispatch) => {
    dispatch(userActions.loading());
    try {
      const response = await axios.post(
        'auth/login',
        JSON.stringify({
          email: login,
          password: password,
        }),
      );

      if (response.data && response.data.data.auth.token) {
        let authData = {
          email: response.data.data.user.email,
          token: response.data.data.auth.token,
          name: response.data.data.user.name,
        };
        localStorage.setItem('easyBooksAuth', JSON.stringify(authData));
        dispatch(userActions.loginSuccess(response.data));
        history.push('/app/purchases');
      } else {
        dispatch(userActions.loginFailure(response));
      }
    } catch (error) {
      dispatch(userActions.loginFailure(error));
    }
  };
};

// Logout
export const userLogout = (history) => {
  return (dispatch) => {
    localStorage.removeItem('easyBooksAuth');
    dispatch(userActions.logoutUser());
  };
};

// Validate Token
export const userTokenValidation = (values) => {
  return async (dispatch) => {
    const response = await usePost('/validate', {
      token: values.token,
      formData: {},
    });
    if (response.status === 401 && response.error === 'Unauthorized') {
      dispatch(userLogout());
    }
  };
};

// Verify Token
export const userTokenVerification = (values) => {
  return async (dispatch) => {
    dispatch(userActions.verifyUserTokenRequest());
    try {
      const response = await useGet(values.url);
      if (response.data) {
        dispatch(userActions.verifyUserTokenSuccess(response));
      } else {
        dispatch(userActions.verifyUserTokenFailure(response));
      }
    } catch (error) {
      dispatch(userActions.verifyUserTokenFailure(error));
    }
  };
};
