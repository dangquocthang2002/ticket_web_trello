import Types from "./slackConnection.constant";

const initialState = {
  slackData: {},
};
const slackConnectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_SLACK_DATA_BY_BOARD:
      return {
        ...state,
        slackData: {
          ...state.slackData,
          [action.payload.boardId]: action.payload.slackData,
        },
      };
    case Types.UPDATE_SLACK_DATA_PENDING:
      return {
        ...state,
        slackData: {
          ...state.slackData,
          [action.payload.board]: action.payload,
        },
      };
    case Types.UPDATE_SLACK_DATA_SUCCESS:
      return {
        ...state,
        slackData: {
          ...state.slackData,
          [action.payload.board]: action.payload,
        },
      };
    default:
      return state;
  }
};
export default slackConnectionReducer;
