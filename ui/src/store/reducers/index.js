import { combineReducers } from 'redux';

// Child Reducers
import userReducer from './userReducer';
import miscellaneousReducer from './miscellaneousReducer';
import relationshipReducer from './/relationshipReducer';

// Parent Reducer
const rootReducer = combineReducers({
  user: userReducer,
  miscellaneous: miscellaneousReducer,
  relationship: relationshipReducer,
});

export default rootReducer;
