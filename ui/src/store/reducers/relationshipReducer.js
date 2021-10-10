import * as actionTypes from '../actions/actionTypes';
import { mergeObjects } from '../../utils/helpers';

// Set Initial State
const initialState = {
  relationships: [],
  pageNo: null,
  formLoading: false,
  pageLoading: false,
};

// Reducer
const relationshipReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create or Update
    case actionTypes.RELATIONSHIP_CREATE_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
      });

    case actionTypes.RELATIONSHIP_CREATE_UPDATE_SUCCESS:
      let modifyRelationshipForCreateOrUpdate = [...state.relationships];
      const relationshipIndex = modifyRelationshipForCreateOrUpdate.findIndex(
        (relationship) =>
          parseInt(action.payload.relationship.id) ===
          parseInt(relationship.id),
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
        formLoading: false,
      });

    case actionTypes.RELATIONSHIP_CREATE_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
      });

    // Read
    case actionTypes.RELATIONSHIP_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.RELATIONSHIP_READ_SUCCESS:
      return mergeObjects(state, {
        relationships: action.payload.relationships,
        pageNo: action.payload.pageNo,
        pageLoading: false,
      });

    case actionTypes.RELATIONSHIP_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    // Delete
    case actionTypes.RELATIONSHIP_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case actionTypes.RELATIONSHIP_DELETE_SUCCESS:
      let modifyRelationshipForDelete = [...state.relationships];
      const modifiedRelationshipAfterDeleted =
        modifyRelationshipForDelete.filter(
          (relationship) =>
            parseInt(action.payload.relationshipId) !==
            parseInt(relationship.id),
        );
      return mergeObjects(state, {
        relationships: modifiedRelationshipAfterDeleted,
        pageLoading: false,
      });

    case actionTypes.RELATIONSHIP_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default relationshipReducer;
