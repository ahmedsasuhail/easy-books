import {
  // USER_REGISTRATION_REQUEST,
  // USER_REGISTRATION_SUCCESS,
  // USER_REGISTRATION_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
} from '../actionTypes';

// User Actions
export const userActions = {
  // Registration
  // registrationRequest: () => {
  //   return {
  //     type: USER_REGISTRATION_REQUEST,
  //   };
  // },

  // registrationSuccess: (values) => {
  //   return {
  //     type: USER_REGISTRATION_SUCCESS,
  //     payload: {
  //       message: values.message,
  //     },
  //   };
  // },

  // registrationFailure: (values) => {
  //   return {
  //     type: USER_REGISTRATION_FAILURE,
  //     payload: { message: values.message },
  //   };
  // },

  // Login
  loginRequest: () => {
    return {
      type: USER_LOGIN_REQUEST,
    };
  },

  loginSuccess: (values) => {
    return {
      type: USER_LOGIN_SUCCESS,
      payload: {
        token: values.token,
        name: values.name,
        email: values.email,
      },
    };
  },

  loginFailure: () => {
    return {
      type: USER_LOGIN_FAILURE,
    };
  },

  // Logout
  logoutUser: () => {
    return {
      type: USER_LOGOUT,
    };
  },
};
