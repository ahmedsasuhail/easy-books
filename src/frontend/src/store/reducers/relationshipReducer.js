import {
  RELATIONSHIP_CREATE_REQUEST,
  RELATIONSHIP_CREATE_SUCCESS,
  RELATIONSHIP_CREATE_FAILURE,
  RELATIONSHIP_UPDATE_REQUEST,
  RELATIONSHIP_UPDATE_SUCCESS,
  RELATIONSHIP_UPDATE_FAILURE,
  RELATIONSHIP_READ_REQUEST,
  RELATIONSHIP_READ_SUCCESS,
  RELATIONSHIP_READ_FAILURE,
  RELATIONSHIP_READ_CLEAR,
  RELATIONSHIP_DELETE_REQUEST,
  RELATIONSHIP_DELETE_SUCCESS,
  RELATIONSHIP_DELETE_FAILURE,
  RELATIONSHIP_SEARCH_REQUEST,
  RELATIONSHIP_SEARCH_SUCCESS,
  RELATIONSHIP_SEARCH_FAILURE,
} from "../actions/actionTypes";
import { mergeObjects } from "../../utils/helpers";

const initialState = {
  relationships: [],
  orderBy: "id",
  order: "asc",
  pageNo: 0,
  rowsPerPage: 5,
  count: 0,
  query: "",
  formLoading: false,
  pageLoading: false,
};

const relationshipReducer = (state = initialState, action) => {
  switch (action.type) {
    case RELATIONSHIP_CREATE_REQUEST:
      return mergeObjects(state, {
        query: "",
        formLoading: true,
        pageLoading: true,
      });

    case RELATIONSHIP_CREATE_SUCCESS:
      let modifyRelationshipsForCreate;
      let nextPageNo = state.pageNo;

      modifyRelationshipsForCreate =
        state.relationships.length === 0
          ? [action.payload.relationship]
          : state.relationships.length === 5
          ? []
          : [...state.relationships, action.payload.relationship];

      if (
        state.relationships.length !== 0 &&
        state.relationships.length % state.rowsPerPage === 0
      ) {
        nextPageNo = Math.floor(state.count / state.rowsPerPage);
      }

      return mergeObjects(state, {
        relationships: modifyRelationshipsForCreate,
        formLoading: false,
        pageLoading: false,
        pageNo: nextPageNo,
        count: state.count + 1,
      });

    case RELATIONSHIP_CREATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case RELATIONSHIP_UPDATE_REQUEST:
      return mergeObjects(state, {
        formLoading: true,
        pageLoading: true,
      });

    case RELATIONSHIP_UPDATE_SUCCESS:
      let modifyRelationshipsForUpdate = [...state.relationships];

      const relationshipIndex = modifyRelationshipsForUpdate.findIndex(
        (relationship) => +action.payload.relationship.id === +relationship.id
      );

      modifyRelationshipsForUpdate.splice(
        relationshipIndex,
        1,
        action.payload.relationship
      );

      return mergeObjects(state, {
        relationships: modifyRelationshipsForUpdate,
        formLoading: false,
        pageLoading: false,
        pageNo: state.pageNo,
        count: state.count,
      });

    case RELATIONSHIP_UPDATE_FAILURE:
      return mergeObjects(state, {
        formLoading: false,
        pageLoading: false,
      });

    case RELATIONSHIP_READ_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case RELATIONSHIP_READ_SUCCESS:
      return mergeObjects(state, {
        relationships: action.payload.relationships || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        query: action.payload.query,
        pageLoading: false,
      });

    case RELATIONSHIP_READ_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case RELATIONSHIP_READ_CLEAR:
      return mergeObjects(state, {
        pageLoading: false,
        orderBy: "id",
        order: "asc",
        pageNo: 0,
        rowsPerPage: 5,
        query: "",
      });

    case RELATIONSHIP_DELETE_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case RELATIONSHIP_DELETE_SUCCESS:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case RELATIONSHIP_DELETE_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    case RELATIONSHIP_SEARCH_REQUEST:
      return mergeObjects(state, {
        pageLoading: true,
      });

    case RELATIONSHIP_SEARCH_SUCCESS:
      return mergeObjects(state, {
        relationships: action.payload.relationships || [],
        pageNo: action.payload.pageNo,
        rowsPerPage: action.payload.rowsPerPage,
        orderBy: action.payload.orderBy,
        order: action.payload.order,
        count: action.payload.count,
        pageLoading: false,
      });

    case RELATIONSHIP_SEARCH_FAILURE:
      return mergeObjects(state, {
        pageLoading: false,
      });

    default:
      return state;
  }
};

export default relationshipReducer;
