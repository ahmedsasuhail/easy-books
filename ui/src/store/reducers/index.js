import { combineReducers } from 'redux';

// Child Reducers
import userReducer from './userReducer';
import miscellaneousReducer from './miscellaneousReducer';
import relationshipReducer from './relationshipReducer';
import purchaseReducer from './purchaseReducer';
import inventoryReducer from './inventoryReducer';
import salesReducer from './salesReducer';

// Parent Reducer
const rootReducer = combineReducers({
  user: userReducer,
  miscellaneous: miscellaneousReducer,
  relationship: relationshipReducer,
  purchase: purchaseReducer,
  inventory: inventoryReducer,
  sales: salesReducer,
});

export default rootReducer;
