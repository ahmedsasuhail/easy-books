import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Check localStorage For Data
let data_store = localStorage.getItem('easyBooksAuth')
  ? JSON.parse(localStorage.getItem('easyBooksAuth'))
  : '';

// Set Initial State
const initialState = {
  isAuthenticated: data_store && data_store.token ? true : false,
  token: data_store && data_store.token ? data_store.token : null,
  name: data_store && data_store.name ? data_store.name : null,
  loading: false,
  message: null,
  messageType: null,
};

// Reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Registration
    // case actionTypes.USER_REGISTRATION_SUCCESS:
    //   return mergeObjects(state, {
    //     message: action.payload.message,
    //     messageType: false,
    //     loading: false,
    //   });
    // case actionTypes.USER_REGISTRATION_FAILURE:
    //   return mergeObjects(state, {
    //     message: action.payload.message,
    //     messageType: false,
    //     loading: false,
    //   });

    // Login
    case actionTypes.USER_LOGIN_REQUEST:
      return mergeObjects(state, {
        loading: true,
        message: null,
        messageType: null,
      });
    case actionTypes.USER_LOGIN_SUCCESS:
      return mergeObjects(state, {
        isAuthenticated: true,
        token: action.payload.token,
        name: action.payload.name,
        loading: false,
      });
    case actionTypes.USER_LOGIN_FAILURE:
      return mergeObjects(state, {
        message: action.payload.message,
        messageType: true,
        loading: false,
      });

    // Logout
    case actionTypes.USER_LOGOUT:
      return mergeObjects(state, {
        isAuthenticated: false,
        token: null,
        name: null,
        message: 'You have been logged out. Please login to continue.',
        loading: false,
      });

    default:
      return state;
  }
};

export default userReducer;
