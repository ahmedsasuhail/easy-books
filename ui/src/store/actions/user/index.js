import { userActions } from './userActions';
import axios from '../../../utils/axiosInstance';

// Action Creators
// Register
// export const userRegisteration = (values) => {
//   return async (dispatch) => {
//     dispatch(userActions.loading());
//     try {
//       const response = await axios.post(
//         'auth/register',
//         JSON.stringify({ ...values }),
//       );
//       if (response.data && response.data.userName) {
//         dispatch(userActions.registrationSuccess(response));
//       } else {
//         dispatch(userActions.registrationFailure(response));
//       }
//     } catch (error) {
//       dispatch(userActions.registrationFailure(error));
//     }
//   };
// };

// Login
export const userLogin = (login, password) => {
  return async (dispatch) => {
    dispatch(userActions.loginRequest());
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
        dispatch(userActions.loginSuccess(response.data.data));
      } else {
        console.log(response);
        dispatch(userActions.loginFailure(response));
      }
    } catch (error) {
      console.log(error);
      dispatch(userActions.loginFailure(error));
    }
  };
};

// Logout
export const userLogout = () => {
  return (dispatch) => {
    localStorage.removeItem('easyBooksAuth');
    dispatch(userActions.logoutUser());
  };
};
