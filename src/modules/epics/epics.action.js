import { toastError } from "utils/toastHelper";

const { apiEpic } = require("api");
const { default: Types } = require("./epics.constant");
const getEpicsByBoardSuccess = (boardId, epicsBoard) => ({
  type: Types.GET_EPICS_BY_BOARD,
  payload: {
    boardId: boardId,
    epicsBoard: epicsBoard,
  },
});
const addEpicToBoardSuccess = (newEpic) => ({
  type: Types.ADD_EPIC_SUCCESS,
  payload: newEpic,
});
const addEpicToBoardPending = (newEpic) => ({
  type: Types.ADD_EPIC_PENDING,
  payload: newEpic,
});
const deleteEpicSuccess = (epic) => ({
  type: Types.DELETE_EPIC_SUCCESS,
  payload: epic,
});

const deleteEpic = (epic) => async (dispatch) => {
  try {
    dispatch(deleteEpicSuccess(epic));
    const res = await apiEpic.deleteEpic(epic._id);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const updateEpicPending = (epic) => ({
  type: Types.UPDATE_EPIC_PENDING,
  payload: epic,
});
const updateEpicSuccess = (epic) => ({
  type: Types.UPDATE_EPIC_PENDING,
  payload: epic,
});
const updateEpic = (epic) => async (dispatch) => {
  try {
    dispatch(updateEpicPending(epic));
    const { name, startedDate, endedDate, color } = epic;
    const res = await apiEpic
      .updateEpic(epic._id, {
        name,
        startedDate,
        endedDate,
        color,
      })
      .then((res) => {
        dispatch(updateEpicSuccess(res.data));
      });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);

    return Promise.reject(error);
  }
};
const addEpicToBoard = (newEpic) => async (dispatch) => {
  try {
    const newIdEpic = {
      ...newEpic,
      id: Date.now(),
      tickets: [],
    };
    dispatch(addEpicToBoardPending(newIdEpic));
    const res = await apiEpic.addEpicToBoard(newEpic).then((res) => {
      dispatch(addEpicToBoardSuccess({ ...newIdEpic, ...res.data }));
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const fetchEpicsByBoard = (boardId) => async (dispatch) => {
  try {
    const res = await apiEpic.getEpicsByBoardId(boardId);
    dispatch(getEpicsByBoardSuccess(boardId, res.data.epicsBoard));

    return Promise.resolve(res.data.epicsBoard);
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  addEpicToBoardPending,
  addEpicToBoard,
  updateEpic,
  updateEpicPending,
  deleteEpic,
  deleteEpicSuccess,
  fetchEpicsByBoard,
};
