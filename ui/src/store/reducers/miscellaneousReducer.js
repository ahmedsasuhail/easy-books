import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  miscellaneous: [],
  pageNo: null,
  loading: false,
};

// Reducer
const miscellaneousReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create or Update
    case actionTypes.MISCELLANEOUS_CREATE_UPDATE_SUCCESS:
      let modifyMiscellaneousForCreateOrUpdate = [...state.miscellaneous];
      const miscellaneousIndex = modifyMiscellaneousForCreateOrUpdate.findIndex(
        (miscellaneous) =>
          parseInt(action.payload.miscellaneous.ID) ===
          parseInt(miscellaneous.ID),
      );

      if (miscellaneousIndex >= 0) {
        modifyMiscellaneousForCreateOrUpdate.splice(
          miscellaneousIndex,
          1,
          action.payload.miscellaneous,
        );
      } else {
        modifyMiscellaneousForCreateOrUpdate = [
          ...state.miscellaneous,
          action.payload.miscellaneous,
        ];
      }
      return mergeObjects(state, {
        miscellaneous: modifyMiscellaneousForCreateOrUpdate,
        loading: false,
      });

    case actionTypes.MISCELLANEOUS_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        loading: false,
      });

    // Read
    case actionTypes.MISCELLANEOUS_READ_SUCCESS:
      return mergeObjects(state, {
        miscellaneous: action.payload.miscellaneous,
        pageNo: action.payload.pageNo,
        loading: false,
      });

    case actionTypes.MISCELLANEOUS_READ_FAILURE:
      return mergeObjects(state, {
        loading: false,
      });

    // Delete
    case actionTypes.MISCELLANEOUS_DELETE_SUCCESS:
      let modifyMiscellaneousForDelete = [...state.miscellaneous];
      const modifiedMiscellaneousAfterDeleted =
        modifyMiscellaneousForDelete.filter(
          (miscellaneous) =>
            parseInt(action.payload.miscellaneousId) !==
            parseInt(miscellaneous.ID),
        );
      return mergeObjects(state, {
        miscellaneous: modifiedMiscellaneousAfterDeleted,
        loading: false,
      });

    case actionTypes.MISCELLANEOUS_DELETE_FAILURE:
      return mergeObjects(state, {
        loading: false,
      });

    // Loading API Request
    case actionTypes.LOADING_REQUEST:
      return mergeObjects(state, {
        loading: true,
      });

    default:
      return state;
  }
};

export default miscellaneousReducer;
