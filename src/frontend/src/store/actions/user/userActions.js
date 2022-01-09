import {
  // USER_REGISTRATION_REQUEST,
  // USER_REGISTRATION_SUCCESS,
  // USER_REGISTRATION_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_AUTH_FAILURE,
} from "../actionTypes";

export const userActions = {
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

  logoutUser: () => {
    return {
      type: USER_LOGOUT,
    };
  },

  userAuthFailure: (message) => {
    return {
      type: USER_AUTH_FAILURE,
      payload: message,
    };
  },
};
