import * as actionTypes from '../actionTypes';

// User Actions
export const userActions = {
  // Loading User Request
  loading: () => {
    return {
      type: actionTypes.LOADING_REQUEST,
    };
  },

  // Registration
  registrationSuccess: (values) => {
    return {
      type: actionTypes.USER_REGISTRATION_SUCCESS,
      payload: {
        message: values.message,
      },
    };
  },

  registrationFailure: (values) => {
    return {
      type: actionTypes.USER_REGISTRATION_FAILURE,
      payload: { message: values.message },
    };
  },

  // Login
  loginSuccess: (values) => {
    return {
      type: actionTypes.USER_LOGIN_SUCCESS,
      payload: {
        token: values.token,
        name: values.name,
      },
    };
  },

  loginFailure: (values) => {
    return {
      type: actionTypes.USER_LOGIN_FAILURE,
      payload: {
        message: values.message,
      },
    };
  },

  // Logout
  logoutUser: () => {
    return {
      type: actionTypes.USER_LOGOUT,
    };
  },

  // Verify Token
  verifyUserTokenRequest: () => {
    return {
      type: actionTypes.USER_LOGIN_TOKEN_VERIFICATION_REQUEST,
    };
  },

  verifyUserTokenSuccess: (values) => {
    return {
      type: actionTypes.USER_LOGIN_TOKEN_VERIFICATION_SUCCESS,
      payload: {
        data: values.data,
        message: values.message,
      },
    };
  },

  verifyUserTokenFailure: (values) => {
    return {
      type: actionTypes.USER_LOGIN_TOKEN_VERIFICATION_FAILURE,
      payload: {
        data: values.data ? true : false,
        message: values.message,
      },
    };
  },
};
