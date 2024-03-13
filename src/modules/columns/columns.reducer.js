import Types from "./columns.constant";

const initialState = {
  isLoading: false,
  states: [],
  error: null,
  count: 1,
  stateArchived: null,
};

const statesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_COLUMN_PENDING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case Types.GET_COLUMN_SUCCESS:
      return {
        ...state,
        states: [...action.payload.states],
        isLoading: false,
      };

    case Types.GET_COLUMN_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
        states: [],
      };

    case Types.ADD_COLUMNS_SUCCESS: {
      const { newColumnToAdd } = action.payload;

      return {
        ...state,
        states: [...state.states, newColumnToAdd],
        stateArchived: null,
      };
    }

    case Types.EDIT_TITLE_COLUMN:
      const { newTitle } = action.payload;
      const newEditTitle = state.states.map((state) =>
        state._id === newTitle._id
          ? {
            ...state,
            name: newTitle.name,
          }
          : state
      );
      return {
        ...state,
        states: newEditTitle,
      };

    case Types.UPDATE_COLUMN_SUCCESS:
      const { state: stateUpdate } = action.payload;
      return {
        ...state,
        states: state.states.map((s) =>
          s._id === stateUpdate._id ? stateUpdate : s
        ),
      };
    case Types.ARCHIVE_STATE_SUCCESS:
      return {
        ...state,
        states: state.states.filter(
          (state) => state._id !== action.payload.state._id
        ),
      };
    case Types.DONE_STATE_SUCCESS:
      const { state: stateDone } = action.payload
      return {
        ...state,
        states: state.states.map((s) =>
          s._id === stateDone._id ? { ...s, ...stateDone.body } : s
        )
      }



    case Types.ARCHIVE_STATE_EVENT_SUCCESS:
      return {
        ...state,
        states: state.states.filter(
          (state) => state._id !== action.payload.state._id
        ),
        stateArchived: action.payload.state._id,
      };
    default:
      return state;
  }
};

export default statesReducer;
