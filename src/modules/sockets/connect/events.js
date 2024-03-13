import { BoardAction } from "modules/boards";
import { ColumnAction } from "modules/columns";
import {
  addEpicToBoardPending,
  deleteEpicSuccess,
  updateEpicPending,
} from "modules/epics/epics.action";
import { FileAction } from "modules/files";
import { LabelActions } from "modules/labels";
import { TicketAction } from "modules/tickets";
import { TaskAction } from "modules/ticketTasks";

const checkUserAccessTicket = (ticketActive, state) => {
  const { user, isAdmin } = state.users;
  const { ticketsUsers } = state.tickets;
  if (isAdmin) {
    return true;
  }

  if (!ticketActive.private) {
    return true;
  }
  return ticketsUsers[ticketActive._id]
    ? ticketsUsers[ticketActive._id]?.map((user) => user._id).includes(user._id)
    : false;
};

// board events --------------------------------------------
export const addInvitedMembersToBoardEvent = (data) => (dispatch) => {
  data.newUsers.forEach((user) => {
    dispatch(BoardAction.addInvitedMembersToBoardActivePending(user));
  });
};
export const deleteInvitedMembersFromBoardEvent = (data) => (dispatch) => {
  data.usersDelete.forEach((user) => {
    dispatch(BoardAction.deleteInvitedMembersFromBoardSuccess(user));
  });
};

export const addEpicToBoardEvent = (data) => (dispatch) => {
  dispatch(addEpicToBoardPending(data.newEpic));
};
export const updateEpicInBoardEvent = (data) => (dispatch) => {
  dispatch(updateEpicPending(data.epicUpdate));
};
export const deleteEpicFromBoardEvent = (data) => (dispatch) => {
  dispatch(deleteEpicSuccess(data.epicDelete));
};

// ticket events --------------------------------------------------------
export const addTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.newTicket, getState())) {
    dispatch(TicketAction.addTicketSuccess(data.newTicket));
  }
};
export const updateTicketEvent = (data) => (dispatch, getState) => {
  const isAdmin = getState().users.isAdmin;
  if (!isAdmin) {
    return dispatch(BoardAction.fetchTicketsByBoard(data.boardIdActive));
  }
  dispatch(TicketAction.updateTicketSuccess(data.ticketUpdate));
};
export const archivedTicketEvent = (data) => {
  return (dispatch, getState) => {
    if (checkUserAccessTicket(data.ticketArchive, getState())) {
      dispatch(TicketAction.archiveTicketEvent(data.ticketArchive));
    }
  };
};
export const restoreTicketEvent = (data) => {
  return (dispatch, getState) => {
    dispatch(BoardAction.fetchTicketsByBoard(data.boardIdActive));
  };
};
export const updateMoveTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketMove, getState())) {
    dispatch(
      TicketAction.updateMoveTicketSuccess({
        ticket: data.ticketMove,
        fromStateId: data.fromStateId,
        toStateId: data.toStateId,
      })
    );
  }
};
export const addUsersToTicketEvent = (data) => (dispatch, getState) => {
  const isAdmin = getState().users.isAdmin;
  if (!isAdmin) {
    return dispatch(BoardAction.fetchTicketsByBoard(data.boardIdActive));
  }
  const { users, ticketId } = data.newUsersTicket;
  users.forEach((user) => {
    dispatch(TicketAction.addUsersToTicketSuccess(ticketId, user));
  });
};
export const deleteUsersFromTicketEvent = (data) => (dispatch, getState) => {
  const isAdmin = getState().users.isAdmin;
  if (!isAdmin) {
    return dispatch(BoardAction.fetchTicketsByBoard(data.boardIdActive));
  }
  const { users, ticketId } = data.deleteUsersTicket;
  users.forEach((user) => {
    dispatch(TicketAction.deleteUsersFromTicketSuccess(ticketId, user));
  });
};
// state events ------------------------------------------------------------------------
export const addStateEvent = (data) => (dispatch) => {
  dispatch(ColumnAction.addColumnSuccess(data.newState));
};
export const updateStateEvent = (data) => (dispatch) => {
  dispatch(ColumnAction.updateColumnSuccess(data.stateUpdate));
};

export const archivedStateEvent = (data) => {
  return (dispatch) => {
    dispatch(ColumnAction.archiveStateEvent(data.stateArchive));
  };
};
export const restoreStateEvent = (data) => {
  return async (dispatch) => {
    dispatch(ColumnAction.addColumnSuccess(data.stateRestore));
    dispatch(BoardAction.fetchTicketsByBoard(data.boardIdActive));
  };
};

// label actions --------------------------------------------

export const addLabelEvent = (data) => (dispatch) => {
  dispatch(LabelActions.addLabelsSuccess(data.newLabel));
};
export const updateLabelEvent = (data) => (dispatch) => {
  dispatch(LabelActions.updateLabelsSuccess(data.labelUpdate));
};
export const deleteLabelEvent = (data) => (dispatch) => {
  dispatch(
    LabelActions.deleteLabelSuccess(data.labelDelete, data.ticketIdDeleteLabel)
  );
};
export const addLabelToTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(
      LabelActions.addLabelToTicketSuccess(data.ticketId, data.newTicketLabel)
    );
  }
};
export const removeLabelOfTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(
      LabelActions.deleteTicketLabelSuccess(data.ticketId, data.ticketLabelId)
    );
  }
};

// ticketFiles events -------------------------------------

export const addFilesToTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(FileAction.addFilesToTicketSuccess(data.ticketId, data.newFiles));
  }
};
export const updateFileEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(FileAction.updateFilePending(data.ticketId, data.fileUpdate));
  }
};
export const deleteFileEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(
      FileAction.deleteFileFromTicketSuccess(data.ticketId, data.fileId)
    );
  }
};

// ticket tasks events ------------------------------------

export const addTaskToTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(TaskAction.addTaskToTicketSuccess(data.ticketId, data.newTask));
  }
};
export const updateTaskInTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(TaskAction.updateTaskPending(data.ticketId, data.taskUpdate));
  }
};
export const deleteTaskInTicketEvent = (data) => (dispatch, getState) => {
  if (checkUserAccessTicket(data.ticketActive, getState())) {
    dispatch(TaskAction.deleteTaskSuccess(data.ticketId, data.taskId));
  }
};
