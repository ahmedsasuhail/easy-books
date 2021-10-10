import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  miscellaneous: [],
  pageNo: null,
  formLoading: false,
  pageLoading: false,
};

// Reducer
const miscellaneousReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create or Update
    case actionTypes.MISCELLANEOUS_CREATE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
      });

    case actionTypes.MISCELLANEOUS_CREATE_UPDATE_SUCCESS:
      let modifyMiscellaneousForCreateOrUpdate = [...state.miscellaneous];
      const miscellaneousIndex = modifyMiscellaneousForCreateOrUpdate.findIndex(
        (miscellaneous) =>
          parseInt(action.payload.miscellaneous.id) ===
          parseInt(miscellaneous.id),
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
        formLoading: false,
      });

    case actionTypes.MISCELLANEOUS_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
      });

    // Read
    case actionTypes.MISCELLANEOUS_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.MISCELLANEOUS_READ_SUCCESS:
      return mergeObjects(state, {
        miscellaneous: action.payload.miscellaneous,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case actionTypes.MISCELLANEOUS_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case actionTypes.MISCELLANEOUS_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.MISCELLANEOUS_DELETE_SUCCESS:
      let modifyMiscellaneousForDelete = [...state.miscellaneous];
      const modifiedMiscellaneousAfterDeleted =
        modifyMiscellaneousForDelete.filter(
          (miscellaneous) =>
            parseInt(action.payload.miscellaneousId) !==
            parseInt(miscellaneous.id),
        );
      return mergeObjects(state, {
        miscellaneous: modifiedMiscellaneousAfterDeleted,
        pageLoading: false,
      });

    case actionTypes.MISCELLANEOUS_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default miscellaneousReducer;
