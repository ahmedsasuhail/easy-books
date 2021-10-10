import * as actionTypes from '../actionTypes';

// User Actions
export const userActions = {
  // Registration
  // registrationRequest: () => {
  //   return {
  //     type: actionTypes.USER_REGISTRATION_REQUEST,
  //   };
  // },

  // registrationSuccess: (values) => {
  //   return {
  //     type: actionTypes.USER_REGISTRATION_SUCCESS,
  //     payload: {
  //       message: values.message,
  //     },
  //   };
  // },

  // registrationFailure: (values) => {
  //   return {
  //     type: actionTypes.USER_REGISTRATION_FAILURE,
  //     payload: { message: values.message },
  //   };
  // },

  // Login
  loginRequest: () => {
    return {
      type: actionTypes.USER_LOGIN_REQUEST,
    };
  },

  loginSuccess: (values) => {
    return {
      type: actionTypes.USER_LOGIN_SUCCESS,
      payload: {
        token: values.auth.token,
        name: values.user.name,
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
};
