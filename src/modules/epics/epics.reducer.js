import Types from "./epics.constant";

const initialState = {
  epicsBoard: {},
};

const epicsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_EPICS_BY_BOARD:
      return {
        ...state,
        epicsBoard: {
          ...state.epicsBoard,
          [action.payload.boardId]: action.payload.epicsBoard,
        },
      };
    case Types.ADD_EPIC_PENDING:
      return {
        ...state,
        epicsBoard: {
          ...state.epicsBoard,
          [action.payload.board]: [
            ...state.epicsBoard[action.payload.board],
            action.payload,
          ],
        },
      };
    case Types.ADD_EPIC_SUCCESS:
      return {
        ...state,
        epicsBoard: {
          ...state.epicsBoard,
          [action.payload.board]: state.epicsBoard[action.payload.board].map(
            (epic) => {
              if (epic.id === action.payload.id) {
                return action.payload;
              }
              return epic;
            }
          ),
        },
      };
    case Types.UPDATE_EPIC_PENDING:
      return {
        ...state,
        epicsBoard: {
          ...state.epicsBoard,
          [action.payload.board]: state.epicsBoard[action.payload.board].map(
            (epic) => {
              if (epic._id === action.payload._id) {
                return { ...epic, ...action.payload };
              }
              return epic;
            }
          ),
        },
      };
    case Types.UPDATE_EPIC_SUCCESS:
      return {
        ...state,
        epicsBoard: {
          ...state.epicsBoard,
          [action.payload.board]: state.epicsBoard[action.payload.board].map(
            (epic) => {
              if (epic._id === action.payload._id) {
                return { ...epic, ...action.payload };
              }
              return epic;
            }
          ),
        },
      };
    case Types.DELETE_EPIC_SUCCESS:
      return {
        ...state,
        epicsBoard: {
          ...state.epicsBoard,
          [action.payload.board]: state.epicsBoard[action.payload.board].filter(
            (epic) => epic._id !== action.payload._id
          ),
        },
      };
    default:
      return state;
  }
};
export default epicsReducer;
