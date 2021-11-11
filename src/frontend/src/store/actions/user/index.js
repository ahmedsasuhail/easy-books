import { userActions } from './userActions';
import axios from '../../../utils/axiosInstance';

// Action Creators
// export const userRegisteration = (values) => {
//   return async (dispatch) => {
//     dispatch(userActions.loading());
//     try {
//       const response = await axios.post(
//         'auth/register',
//         { ...values },
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

export const userLogin = (login, password) => {
  return async (dispatch) => {
    dispatch(userActions.loginRequest());
    try {
      const response = await axios.post('auth/login', {
        email: login,
        password: password,
      });
      if (response.data.data) {
        let authData = {
          token: response.data.data.auth.token,
          name: response.data.data.user.name,
          email: response.data.data.user.email,
        };
        localStorage.setItem('easyBooksAuth', JSON.stringify(authData));
        dispatch(userActions.loginSuccess(authData));
      } else {
        console.log('Error: ', response);
        dispatch(userActions.loginFailure());
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch(userActions.loginFailure());
    }
  };
};

export const userLogout = () => {
  return (dispatch) => {
    localStorage.removeItem('easyBooksAuth');
    dispatch(userActions.logoutUser());
  };
};
