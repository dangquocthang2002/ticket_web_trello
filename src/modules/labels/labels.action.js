import Types from "./labels.constant";
import { apiLabel } from "api";
import ticketsAPI from "api/tickets.api";
import { toastError } from "utils/toastHelper";

const getLabelsPending = () => {
  return {
    type: Types.GET_LABELS_PENDING,
  };
};

const getLabelsSuccess = (boardId, labels) => {
  return {
    type: Types.GET_LABELS_SUCCESS,
    payload: { boardId, labels },
  };
};
const getTicketLabelsPending = () => {
  return {
    type: Types.GET_TICKETLABELS_PENDING,
  };
};

const getTicketLabelsSuccess = (ticketId, ticketLabel) => {
  return {
    type: Types.GET_TICKETLABELS_SUCCESS,
    payload: { ticketId, ticketLabel },
  };
};

const addLabelToTicketSuccess = (ticketId, ticketLabel) => {
  return {
    type: Types.ADD_LABEL_TO_TICKET_SUCCESS,
    payload: { ticketId, ticketLabel },
  };
};

const deleteTicketLabelSuccess = (ticketId, ticketLabelId) => {
  return {
    type: Types.DELETE_TICKETLABEL_SUCCESS,
    payload: { ticketId, ticketLabelId },
  };
};

const selectColorSuccess = (item) => {
  return {
    type: Types.SELECT_COLOR_SUCCESS,
    payload: item,
  };
};

const addLabelsSuccess = (newLabel) => {
  return {
    type: Types.ADD_LABELS_SUCCESS,
    payload: newLabel,
  };
};
const getLabelToUpdateSuccess = (label) => {
  return {
    type: Types.GET_LABEL_TO_UPDATE_SUCCESS,
    payload: { label },
  };
};

const updateLabelsSuccess = (currentLabel) => {
  return {
    type: Types.UPDATE_LABELS_SUCCESS,
    payload: currentLabel,
  };
};

const deleteLabelSuccess = (currentLabel, ticketId) => {
  return {
    type: Types.DELETE_LABELS_SUCCESS,
    payload: { currentLabel, ticketId },
  };
};

// ASYNC
const fetchLabelsByBoard = (boardId) => async (dispatch) => {
  try {
    dispatch(getLabelsPending());
    const res = await apiLabel.getLabelsByBoard(boardId);
    dispatch(getLabelsSuccess(boardId, res.data));
    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

const addLabels = (data) => async (dispatch) => {
  try {
    const res = await apiLabel.addLabelToBoard(data);
    dispatch(addLabelsSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const updateLabel = (currentLabel) => async (dispatch) => {
  try {
    dispatch(updateLabelsSuccess(currentLabel));
    const res = await apiLabel.updateLabel(currentLabel._id, {
      color: currentLabel.color,
      name: currentLabel.name,
      board: currentLabel.board,
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);

    return Promise.reject(error);
  }
};
const deleteLabel = (currentLabel, ticketId) => async (dispatch) => {
  try {
    dispatch(deleteLabelSuccess(currentLabel, ticketId));
    console.log(ticketId);
    const res = await apiLabel.deleteLabel(currentLabel._id, ticketId);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const addLabelToTicket = (ticketId, labelId) => async (dispatch) => {
  try {
    const res = await ticketsAPI
      .addTicketLabel(ticketId, labelId)
      .then((res) => {
        dispatch(addLabelToTicketSuccess(ticketId, res.data));
      });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const deleteLabelFromTicket = (ticketId, ticketLabelId) => async (dispatch) => {
  try {
    dispatch(deleteTicketLabelSuccess(ticketId, ticketLabelId));
    const res = await ticketsAPI.deleteTicketLabel(ticketId, ticketLabelId);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const getTicketLabels = (ticketId) => async (dispatch) => {
  try {
    dispatch(getTicketLabelsPending());
    const res = await ticketsAPI.getTicketLabels(ticketId).then((res) => {
      dispatch(getTicketLabelsSuccess(ticketId, res.data.labels));
    });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
const getAllLabelsByTicketSuccess = (data) => {
  return {
    type: Types.GET_ALL_LABELS_BY_TICKET_SUCCESS,
    payload: data,
  };
};

export {
  addLabelToTicket,
  deleteLabelFromTicket,
  addLabels,
  getLabelToUpdateSuccess,
  updateLabel,
  deleteLabel,
  selectColorSuccess,
  fetchLabelsByBoard,
  getTicketLabels,
  getTicketLabelsSuccess,
  getAllLabelsByTicketSuccess,
  addLabelsSuccess,
  deleteLabelSuccess,
  addLabelToTicketSuccess,
  deleteTicketLabelSuccess,
  updateLabelsSuccess,
};
