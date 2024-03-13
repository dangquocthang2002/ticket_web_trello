import Types from "./slackConnection.constant";
const { apiSlack } = require("api");

const getSlackDataByBoardSuccess = (boardId, slackData) => ({
  type: Types.GET_SLACK_DATA_BY_BOARD,
  payload: {
    boardId: boardId,
    slackData: slackData,
  },
});
const fetchSlackDataByBoard = (boardId) => async (dispatch) => {
  try {
    const res = await apiSlack.getSlackDataByBoardId(boardId).then((res) => {
      dispatch(getSlackDataByBoardSuccess(boardId, res.data[0]));
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const updateSlackDataPending = (data) => ({
  type: Types.UPDATE_SLACK_DATA_PENDING,
  payload: data,
});
const changeSlackData = (slackData) => async (dispatch) => {
  try {
    dispatch(updateSlackDataPending(slackData));
  } catch (error) {
    return Promise.reject(error);
  }
};
const updateSlackDataSuccess = (data) => ({
  type: Types.UPDATE_SLACK_DATA_SUCCESS,
  payload: data,
});
const updateSlackData = (slackData) => async (dispatch) => {
  try {
    const res = await apiSlack
      .updateSlackData(slackData.board, slackData)
      .then((res) => {
        dispatch(updateSlackDataSuccess(res.data));
      });

    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
export { fetchSlackDataByBoard, updateSlackData, changeSlackData };
