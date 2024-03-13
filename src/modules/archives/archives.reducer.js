import Types from "./archives.constant";

const initialState = {
  archivedItems: {},
};
const archivesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_ARCHIVED_ITEMS_SUCCESS:
      return {
        ...state,
        archivedItems: {
          ...state.archivedItems,
          [action.payload.object]: action.payload.data,
        },
      };

    case Types.RESTORE_ARCHIVED_ITEMS_SUCCESS:
      return {
        ...state,
        archivedItems: {
          ...state.archivedItems,
          [action.payload.object]: state.archivedItems[
            action.payload.object
          ].filter((item) => item._id !== action.payload.data._id),
        },
      };
    case Types.DELETE_ARCHIVED_ITEMS_SUCCESS:
      return {
        ...state,
        archivedItems: {
          ...state.archivedItems,
          [action.payload.object]: state.archivedItems[
            action.payload.object
          ].filter((item) => item._id !== action.payload.data._id),
        },
      };
    default:
      return state;
  }
};

export default archivesReducer;
