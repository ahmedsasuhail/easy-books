import { combineReducers } from 'redux';

// Child Reducers
import userReducer from './userReducer';
import miscellaneousReducer from './miscellaneousReducer';

// Parent Reducer
const rootReducer = combineReducers({
  user: userReducer,
  miscellaneous: miscellaneousReducer,
});

export default rootReducer;
