import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  relationships: [],
  pageNo: null,
  loading: false,
};

// Reducer
const relationshipReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create or Update
    case actionTypes.RELATIONSHIP_CREATE_UPDATE_SUCCESS:
      let modifyRelationshipForCreateOrUpdate = [...state.relationships];
      const relationshipIndex = modifyRelationshipForCreateOrUpdate.findIndex(
        (relationship) =>
          parseInt(action.payload.relationship.ID) ===
          parseInt(relationship.ID),
      );

      if (relationshipIndex >= 0) {
        modifyRelationshipForCreateOrUpdate.splice(
          relationshipIndex,
          1,
          action.payload.relationship,
        );
      } else {
        modifyRelationshipForCreateOrUpdate = [
          ...state.relationships,
          action.payload.relationship,
        ];
      }
      return mergeObjects(state, {
        relationships: modifyRelationshipForCreateOrUpdate,
        loading: false,
      });

    case actionTypes.RELATIONSHIP_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        loading: false,
      });

    // Read
    case actionTypes.RELATIONSHIP_READ_SUCCESS:
      return mergeObjects(state, {
        relationships: action.payload.relationship,
        pageNo: action.payload.pageNo,
        loading: false,
      });

    case actionTypes.RELATIONSHIP_READ_FAILURE:
      return mergeObjects(state, {
        loading: false,
      });

    // Delete
    case actionTypes.RELATIONSHIP_DELETE_SUCCESS:
      let modifyRelationshipForDelete = [...state.relationships];
      const modifiedRelationshipAfterDeleted =
        modifyRelationshipForDelete.filter(
          (relationship) =>
            parseInt(action.payload.relationshipId) !==
            parseInt(relationship.ID),
        );
      return mergeObjects(state, {
        relationships: modifiedRelationshipAfterDeleted,
        loading: false,
      });

    case actionTypes.RELATIONSHIP_DELETE_FAILURE:
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

export default relationshipReducer;
