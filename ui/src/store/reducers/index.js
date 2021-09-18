import { combineReducers } from 'redux';

// Child Reducers
import userReducer from './userReducer';

// Parent Reducer
const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
