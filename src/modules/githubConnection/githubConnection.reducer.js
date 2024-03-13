import Types from "./githubConnection.constant";

const initialState = {
  githubByBoard: {},
  ticketPullRequests: {},
  isLoadingGit: false,
};
const githubConnectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.CREATE_GITHUB_DATA_BY_BOARD:
      return {
        ...state,
        githubByBoard: {
          ...state.githubByBoard,
          [action.payload.boardId]: action.payload.githubData,
        },
      };
    case Types.GET_GITHUB_DATA_BY_BOARD:
      return {
        ...state,
        githubByBoard: {
          ...state.githubByBoard,
          [action.payload.boardId]: action.payload.githubData,
        },
      };
    case Types.UPDATE_GITHUB_DATA_PENDING:
      return {
        ...state,
        githubByBoard: {
          ...state.githubByBoard,
          [action.payload.board]: action.payload,
        },
      };
    case Types.UPDATE_GITHUB_DATA_SUCCESS:
      return {
        ...state,
        githubByBoard: {
          ...state.githubByBoard,
          [action.payload.board]: action.payload,
        },
      };
    case Types.FETCH_PULL_REQUESTS_BY_TICKET_PENDING:
      return {
        ...state,
        isLoadingGit: true,
      };

    case Types.FETCH_PULL_REQUESTS_BY_TICKET_FAILED:
      return {
        ...state,
        isLoadingGit: false,
      };
    case Types.GET_PULL_REQUESTS_BY_TICKET:
      return {
        ...state,
        isLoadingGit: false,
        ticketPullRequests: {
          ...state.ticketPullRequests,
          [action.payload.ticketId]: action.payload.data,
        },
      };
    default:
      return state;
  }
};
export default githubConnectionReducer;
