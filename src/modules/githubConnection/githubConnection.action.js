import Types from "./githubConnection.constant";
const { apiGithub } = require("api");

const createGithubDataByBoardSuccess = (boardId, githubData) => ({
  type: Types.CREATE_GITHUB_DATA_BY_BOARD,
  payload: {
    boardId: boardId,
    githubData: githubData,
  },
});
const createGithubDataByBoard = (boardId) => async (dispatch) => {
  try {
    const res = await apiGithub
      .createGithubDataByBoardId(boardId)
      .then((res) => {
        dispatch(createGithubDataByBoardSuccess(res.data.board, res.data));
      });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const getGithubDataByBoardSuccess = (boardId, githubData) => ({
  type: Types.GET_GITHUB_DATA_BY_BOARD,
  payload: {
    boardId: boardId,
    githubData: githubData,
  },
});
const fetchGithubDataByBoard = (boardId) => async (dispatch) => {
  try {
    const res = await apiGithub.getGithubDataByBoardId(boardId);
    dispatch(getGithubDataByBoardSuccess(boardId, res.data));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const updateGithubDataPending = (data) => ({
  type: Types.UPDATE_GITHUB_DATA_PENDING,
  payload: data,
});
const changeGithubData = (githubData) => async (dispatch) => {
  try {
    console.log(githubData.board);
    dispatch(updateGithubDataPending(githubData));
  } catch (error) {
    return Promise.reject(error);
  }
};
const updateGithubDataSuccess = (data) => ({
  type: Types.UPDATE_GITHUB_DATA_SUCCESS,
  payload: data,
});
const updateGithubData = (githubData) => async (dispatch) => {
  try {
    if (!githubData) {
      return Promise.reject(new Error('No data'));
    };

    const res = await apiGithub
      .updateGithubData(githubData.board, githubData)
      .then((res) => {
        dispatch(updateGithubDataSuccess(res.data));
      });

    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const getPullRequestsByTicketSuccess = (ticketId, data) => ({
  type: Types.GET_PULL_REQUESTS_BY_TICKET,
  payload: { ticketId: ticketId, data: data },
});

const fetchPullRequestsByTicketPending = () => ({
  type: Types.FETCH_PULL_REQUESTS_BY_TICKET_PENDING,
});
const fetchPullRequestsByTicketFailed = () => ({
  type: Types.FETCH_PULL_REQUESTS_BY_TICKET_FAILED,
});

const fetchPullRequestsByTicket = (ticketId) => async (dispatch) => {
  try {
    dispatch(fetchPullRequestsByTicketPending());
    const res = await apiGithub
      .getPullRequestsByTicket(ticketId)
      .then((res) => {
        dispatch(getPullRequestsByTicketSuccess(ticketId, res.data));
      })
      .catch((err) => {
        dispatch(fetchPullRequestsByTicketFailed());
      });

    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  fetchGithubDataByBoard,
  updateGithubData,
  changeGithubData,
  fetchPullRequestsByTicket,
  createGithubDataByBoard,
};
