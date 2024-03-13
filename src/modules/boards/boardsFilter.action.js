import Types from "./boards.constant";

const filterMemberInBoardSuccess = (boardId, user) => {
  return {
    type: Types.FILTER_MEMBER_IN_BOARD_SUCCESS,
    payload: { boardId, user },
  };
};
const filterMemberInBoard = (boardId, user) => async (dispatch) => {
  try {
    const res = dispatch(filterMemberInBoardSuccess(boardId, user));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterAllMemberInBoardSuccess = (boardId, user) => {
  return {
    type: Types.FILTER_ALL_MEMBER_IN_BOARD_SUCCESS,
    payload: { boardId, user },
  };
};
const filterAllMemberInBoard = (boardId, user) => async (dispatch) => {
  try {
    const res = dispatch(filterAllMemberInBoardSuccess(boardId, user));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const removeFilterAllMemberInBoardSuccess = (boardId, user) => {
  return {
    type: Types.REMOVE_FILTER_ALL_MEMBER_IN_BOARD_SUCCESS,
    payload: { boardId, user },
  };
};
const removeFilterAllMemberInBoard = (boardId, user) => async (dispatch) => {
  try {
    const res = dispatch(removeFilterAllMemberInBoardSuccess(boardId, user));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterAllLabelInBoardSuccess = (boardId, labels) => {
  return {
    type: Types.FILTER_ALL_LABEL_IN_BOARD_SUCCESS,
    payload: { boardId, labels },
  };
};
const filterAllLabelInBoard = (boardId, labels) => async (dispatch) => {
  try {
    const res = dispatch(filterAllLabelInBoardSuccess(boardId, labels));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const removeFilterAllLabelInBoardSuccess = (boardId, labels) => {
  return {
    type: Types.REMOVE_FILTER_ALL_LABEL_IN_BOARD_SUCCESS,
    payload: { boardId, labels },
  };
};
const removeFilterAllLabelInBoard = (boardId, labels) => async (dispatch) => {
  try {
    const res = dispatch(removeFilterAllLabelInBoardSuccess(boardId, labels));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterAllEpicInBoardSuccess = (boardId, epics) => {
  return {
    type: Types.FILTER_ALL_EPIC_IN_BOARD_SUCCESS,
    payload: { boardId, epics },
  };
};
const filterAllEpicInBoard = (boardId, epics) => async (dispatch) => {
  try {
    const res = dispatch(filterAllEpicInBoardSuccess(boardId, epics));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const removeFilterAllEpicInBoardSuccess = (boardId, epics) => {
  return {
    type: Types.REMOVE_FILTER_ALL_EPIC_IN_BOARD_SUCCESS,
    payload: { boardId, epics },
  };
};
const removeFilterAllEpicInBoard = (boardId, epics) => async (dispatch) => {
  try {
    const res = dispatch(removeFilterAllEpicInBoardSuccess(boardId, epics));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const removeFilterMemberInBoardSuccess = (boardId, user) => {
  return {
    type: Types.REMOVE_FILTER_MEMBER_IN_BOARD_SUCCESS,
    payload: { boardId, user },
  };
};
const removeFilterMemberInBoard = (boardId, user) => async (dispatch) => {
  try {
    const res = dispatch(removeFilterMemberInBoardSuccess(boardId, user));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterLabelInBoardSuccess = (boardId, label) => {
  return {
    type: Types.FILTER_LABEL_IN_BOARD_SUCCESS,
    payload: { boardId, label },
  };
};
const filterLabelInBoard = (boardId, label) => async (dispatch) => {
  try {
    const res = dispatch(filterLabelInBoardSuccess(boardId, label));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const removeFilterLabelInBoardSuccess = (boardId, label) => {
  return {
    type: Types.REMOVE_FILTER_LABEL_IN_BOARD_SUCCESS,
    payload: { boardId, label },
  };
};
const removeFilterLabelInBoard = (boardId, label) => async (dispatch) => {
  try {
    const res = dispatch(removeFilterLabelInBoardSuccess(boardId, label));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const filterEpicInBoardSuccess = (boardId, epic) => {
  return {
    type: Types.FILTER_EPIC_IN_BOARD_SUCCESS,
    payload: { boardId, epic },
  };
};
const filterEpicInBoard = (boardId, epic) => async (dispatch) => {
  try {
    const res = dispatch(filterEpicInBoardSuccess(boardId, epic));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const removeFilterEpicInBoardSuccess = (boardId, epic) => {
  return {
    type: Types.REMOVE_FILTER_EPIC_IN_BOARD_SUCCESS,
    payload: { boardId, epic },
  };
};
const removeFilterEpicInBoard = (boardId, epic) => async (dispatch) => {
  try {
    const res = dispatch(removeFilterEpicInBoardSuccess(boardId, epic));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterTicketInBoardByTitleSuccess = (boardId, name) => {
  return {
    type: Types.FILTER_TICKET_IN_BOARD_BY_TITLE_SUCCESS,
    payload: { boardId, name },
  };
};
const filterTicketInBoardByTitle = (boardId, name) => async (dispatch) => {
  try {
    const res = dispatch(filterTicketInBoardByTitleSuccess(boardId, name));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterNoMemberInTicketSuccess = (boardId, check) => {
  return {
    type: Types.FILTER_NO_MEMBER_IN_TICKET_SUCCESS,
    payload: { boardId, check },
  };
};
const filterNoMemberInTicket = (boardId, check) => async (dispatch) => {
  try {
    const res = dispatch(filterNoMemberInTicketSuccess(boardId, check));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterNoLabelInTicketSuccess = (boardId, check) => {
  return {
    type: Types.FILTER_NO_LABEL_IN_TICKET_SUCCESS,
    payload: { boardId, check },
  };
};
const filterNoLabelInTicket = (boardId, check) => async (dispatch) => {
  try {
    const res = dispatch(filterNoLabelInTicketSuccess(boardId, check));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const filterNoEpicInTicketSuccess = (boardId, check) => {
  return {
    type: Types.FILTER_NO_EPIC_IN_TICKET_SUCCESS,
    payload: { boardId, check },
  };
};
const filterNoEpicInTicket = (boardId, check) => async (dispatch) => {
  try {
    const res = dispatch(filterNoEpicInTicketSuccess(boardId, check));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const clearFilterInBoardSuccess = (boardId) => {
  return {
    type: Types.CLEAR_FILTER_IN_BOARD_SUCCESS,
    payload: { boardId },
  };
};
const clearFilterInBoard = (boardId) => async (dispatch) => {
  try {
    const res = dispatch(clearFilterInBoardSuccess(boardId));
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
  filterMemberInBoard,
  removeFilterMemberInBoard,
  filterLabelInBoard,
  removeFilterLabelInBoard,
  filterEpicInBoard,
  removeFilterEpicInBoard,
  filterTicketInBoardByTitle,
  filterAllMemberInBoard,
  removeFilterAllMemberInBoard,
  filterNoMemberInTicket,
  filterNoLabelInTicket,
  filterNoEpicInTicket,
  filterAllLabelInBoard,
  removeFilterAllLabelInBoard,
  filterAllEpicInBoard,
  removeFilterAllEpicInBoard,
  clearFilterInBoard,
};
