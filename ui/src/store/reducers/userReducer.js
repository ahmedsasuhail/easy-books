import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Check localStorage For Data
let data_store = localStorage.getItem('quickBookAuth')
  ? JSON.parse(localStorage.getItem('quickBookAuth'))
  : '';

// Set Initial State
const initialState = {
  isAuthenticated: data_store && data_store.token ? true : false,
  token: data_store && data_store.token ? data_store.token : null,
  user: data_store && data_store.user ? data_store.user : null,
  message: null,
  messageType: null, // 0 is Success, 1 is Error
  loading: false,
};

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Registration
    case actionTypes.USER_REGISTRATION_SUCCESS:
      return mergeObjects(state, {
        message: action.payload.message,
        messageType: 0,
        loading: false,
      });
    case actionTypes.USER_REGISTRATION_FAILURE:
      return mergeObjects(state, {
        message: action.payload.message,
        messageType: 1,
        loading: false,
      });
    // Login
    case actionTypes.USER_LOGIN_SUCCESS:
      return mergeObjects(state, {
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
      });
    case actionTypes.USER_LOGIN_FAILURE:
      return mergeObjects(state, {
        message: action.payload.message,
        messageType: 1,
        loading: false,
      });
    // Logout
    case actionTypes.USER_LOGOUT:
      return mergeObjects(state, {
        isAuthenticated: false,
        token: null,
        user: null,
        message: 'You have been logged out. Please login to continue.',
      });
    // Verify Token
    case actionTypes.USER_LOGIN_TOKEN_VERIFICATION_REQUEST:
      return mergeObjects(state, {
        message: null,
        messageType: null,
        loading: true,
      });
    case actionTypes.USER_LOGIN_TOKEN_VERIFICATION_SUCCESS:
      return mergeObjects(state, {
        message: action.payload.message,
        messageType: 0,
        loading: false,
      });
    case actionTypes.USER_LOGIN_TOKEN_VERIFICATION_FAILURE:
      return mergeObjects(state, {
        message: action.payload.message,
        messageType: 1,
        loading: false,
      });
    // Loading User Request
    case actionTypes.LOADING_REQUEST:
      return mergeObjects(state, {
        message: null,
        messageType: null,
        loading: true,
      });
    default:
      return state;
  }
};

export default userReducer;
