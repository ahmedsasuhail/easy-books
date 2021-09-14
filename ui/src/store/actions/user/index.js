import { userActions } from './userAction';
import { usePost, useGet } from '../../../utils/webServices';

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
export const userLogin = (login, password, history) => {
  return async (dispatch) => {
    dispatch(userActions.loading());
    try {
      const response = await usePost('/eb/auth/login', {
        email: login,
        password: password,
      });
      if (response.data && response.data.token) {
        let authData = {
          email: response.data.email,
          token: response.data.token,
          name: response.data.name,
        };
        localStorage.setItem('quickBookAuth', JSON.stringify(authData));
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
    localStorage.removeItem('quickBookAuth');
    dispatch(userActions.logoutUser());
    history.push('/login');
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
