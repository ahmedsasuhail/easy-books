import { userActions } from './userAction';
import { usePost, useGet } from '../utilities/webServices';

// Action Creators
// Register
export const userRegisteration = (values) => {
  return async (dispatch) => {
    dispatch(userActions.loading());
    try {
      const response = await usePost('/register', values);
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
export const userLogin = (values) => {
  return async (dispatch) => {
    dispatch(userActions.loading());
    try {
      const response = await usePost('/authenticate', values);
      if (response.data && response.data.token) {
        let authData = {
          username: values.username,
          token: response.data.token,
          user: response.data.user,
        };
        localStorage.setItem('tmsAuth', JSON.stringify(authData));
        dispatch(userActions.loginSuccess(response.data));
      } else {
        dispatch(userActions.loginFailure(response));
      }
    } catch (error) {
      dispatch(userActions.loginFailure(error));
    }
  };
};

// Logout
export const userLogout = () => {
  return (dispatch) => {
    localStorage.removeItem('tmsAuth');
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
