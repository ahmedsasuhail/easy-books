import {
  // USER_REGISTRATION_REQUEST,
  // USER_REGISTRATION_SUCCESS,
  // USER_REGISTRATION_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGOUT,
  USER_AUTH_FAILURE,
} from "../actions/actionTypes";
import { mergeObjects } from "../../utils/helpers";

let data_store = localStorage.getItem("easyBooksAuth")
  ? JSON.parse(localStorage.getItem("easyBooksAuth"))
  : "";

const initialState = {
  isAuthenticated: data_store && data_store.token ? true : false,
  token: data_store && data_store.token ? data_store.token : null,
  name: data_store && data_store.name ? data_store.name : null,
  email: data_store && data_store.email ? data_store.email : null,
  loading: false,
  message: null,
  messageType: null,
  modelOpen: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // case USER_REGISTRATION_SUCCESS:
    //   return mergeObjects(state, {
    //     message: action.payload.message,
    //     messageType: false,
    //     loading: false,
    //   });
    // case USER_REGISTRATION_FAILURE:
    //   return mergeObjects(state, {
    //     message: action.payload.message,
    //     messageType: false,
    //     loading: false,
    //   });

    case USER_LOGIN_REQUEST:
      return mergeObjects(state, {
        loading: true,
        message: null,
        messageType: null,
      });
    case USER_LOGIN_SUCCESS:
      return mergeObjects(state, {
        isAuthenticated: true,
        token: action.payload.token,
        name: action.payload.name,
        email: action.payload.email,
        loading: false,
      });
    case USER_LOGIN_FAILURE:
      return mergeObjects(state, {
        message: "Something is wrong with your email or password :(",
        messageType: "LOGIN",
        loading: false,
      });

    case USER_LOGOUT:
      return mergeObjects(state, {
        isAuthenticated: false,
        token: null,
        name: null,
        email: null,
        message: null,
        messageType: null,
        modelOpen: false,
      });

    case USER_AUTH_FAILURE:
      let errorMessage;
      if (action.payload === "auth token expired") {
        errorMessage =
          "Your session has expired. Please login again to continue.";
      } else {
        errorMessage = "Something went wrong. Please login to continue.";
      }
      return mergeObjects(state, {
        message: errorMessage,
        messageType: "AUTH",
        modelOpen: true,
      });

    default:
      return state;
  }
};

export default userReducer;
