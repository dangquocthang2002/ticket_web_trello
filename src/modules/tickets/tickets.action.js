import ticketsAPI from "api/tickets.api";
import Types from "./tickets.constant";
import { getSortTicket } from "./ticket.selectors";
import { toastError } from "utils/toastHelper";

// SYNC actions

const addTicketSuccess = (newTicketToAdd) => {
  return {
    type: Types.ADD_TICKET_SUCCESS,
    payload: { newTicketToAdd },
  };
};

const getTicketPending = () => {
  return {
    type: Types.GET_TICKET_PENDING,
  };
};
const getTicketSuccess = (ticketsByState, stateId) => {
  return {
    type: Types.GET_TICKET_SUCCESS,
    payload: { ticketsByState, stateId },
  };
};

const getTicketError = (error) => {
  return {
    type: Types.GET_TICKET_ERROR,
    payload: error,
  };
};

const updateMoveTicketSuccess = (data) => {
  return {
    type: Types.UPDATE_TICKET_MOVED_SUCCESS,
    payload: data,
  };
};

const getTicketByIdSuccess = (ticket) => {
  return {
    type: Types.GET_TICKET_DETAIL_SUCCESS,
    payload: ticket,
  };
};

// ASYNC actions

const fetchTicketByState = (stateId) => {
  return (dispatch) => {
    dispatch(getTicketPending());
    return ticketsAPI
      .getTicketsByState(stateId)
      .then((res) => {
        const data = res.data;
        dispatch(getTicketSuccess(data, stateId));

        return data;
      })
      .catch((err) => {
        dispatch(getTicketError(err.message));
      });
  };
};

const addTicket = (data) => async (dispatch) => {
  try {
    const res = await ticketsAPI.addTicket(data);
    dispatch(addTicketSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

//
const getUserInTicketSuccess = (ticketId, user) => ({
  type: Types.GET_USER_IN_TICKET_SUCCESS,
  payload: {
    ticketId: ticketId,
    user: user,
  },
});
const fetchUsersTicket = (ticketId) => async (dispatch) => {
  await ticketsAPI
    .getUserTicket(ticketId)
    .then((res) => {
      dispatch(
        getUserInTicketSuccess(ticketId, [
          ...res.data.users.map((user) => user.user),
        ])
      );
    })
    .catch(() => {
      dispatch(getUserInTicketSuccess(ticketId, []));
    });
};
const addUsersToTicketSuccess = (ticketId, user) => ({
  type: Types.ADD_USERS_TO_TICKET_SUCCESS,
  payload: {
    ticketId: ticketId,
    user: user,
  },
});
const addUserToTicket = (ticketId, user) => async (dispatch) => {
  try {
    const newUser = {
      users: [user._id],
    };
    dispatch(addUsersToTicketSuccess(ticketId, user));
    const res = await ticketsAPI.addUserTicket(ticketId, newUser);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const deleteUsersFromTicketSuccess = (ticketId, user) => ({
  type: Types.DELETE_USERS_FROM_TICKET_SUCCESS,
  payload: {
    ticketId: ticketId,
    user: user,
  },
});
const deleteUsersFromTicket = (departmentId, user) => async (dispatch) => {
  try {
    const delelteUsers = {
      users: [user._id],
    };
    dispatch(deleteUsersFromTicketSuccess(departmentId, user));
    const res = await ticketsAPI.deleteUserTicket(departmentId, delelteUsers);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const moveTicketAction = (dropResult) => {
  return async (dispatch, getState) => {
    try {
      const { addedIndex, ticket, fromStateId, toStateId } = dropResult;
      const globalState = getState();
      if (fromStateId === toStateId) {
        const stateId = dropResult.ticket.state;
        const tickets = getSortTicket(globalState, stateId);

        const isMoveForward =
          dropResult.addedIndex - dropResult.removedIndex >= 0;

        let newPossition = dropResult.ticket.positionIndex || 0;
        const aboveTicket = isMoveForward
          ? tickets[dropResult.addedIndex]
          : tickets[dropResult.addedIndex - 1];

        const belowTicket = isMoveForward
          ? tickets[dropResult.addedIndex + 1]
          : tickets[dropResult.addedIndex];

        if (aboveTicket && belowTicket) {
          newPossition =
            (aboveTicket.positionIndex + belowTicket.positionIndex) / 2;
        } else {
          if (isMoveForward) {
            if (!belowTicket) {
              newPossition = aboveTicket.positionIndex + 10;
            }
          } else {
            if (!aboveTicket) {
              newPossition = belowTicket.positionIndex / 2;
            }
          }
        }

        const newTicket = {
          ...dropResult.ticket,
          state: toStateId,
          positionIndex: newPossition,
        };
        dispatch(
          updateMoveTicketSuccess({
            ticket: newTicket,
            fromStateId,
            toStateId,
          })
        );
        await ticketsAPI.updateTicket(newTicket._id, {
          state: toStateId,
          positionIndex: newPossition,
        });
      } else {
        // move ticket to different column
        const listTicketsInNewState = getSortTicket(globalState, toStateId);

        const aboveTicket = listTicketsInNewState[addedIndex - 1];
        const belowTicket = listTicketsInNewState[addedIndex];

        let newPossitionIndex = ticket.positionIndex;
        if (aboveTicket && belowTicket) {
          newPossitionIndex =
            (aboveTicket.positionIndex + belowTicket.positionIndex) / 2;
        } else {
          if (aboveTicket) {
            newPossitionIndex = aboveTicket.positionIndex + 1000;
          } else {
            newPossitionIndex = belowTicket
              ? belowTicket.positionIndex / 2
              : 1000;
          }
        }

        const newTicket = {
          ...ticket,
          movedAt: new Date(),
          state: toStateId,
          positionIndex: newPossitionIndex,
        };

        dispatch(
          updateMoveTicketSuccess({
            ticket: newTicket,
            fromStateId,
            toStateId,
          })
        );

        await ticketsAPI.updateTicket(newTicket._id, {
          state: toStateId,
          positionIndex: newPossitionIndex,
        });
      }
    } catch (error) {
      toastError(error.response.data);
      return Promise.reject(error);
    }
  };
};

const updateTicketSuccess = (ticket) => ({
  type: Types.UPDATE_TICKET_SUCCESS,
  payload: ticket,
});

const updateTicket = (currentTicket) => async (dispatch) => {
  try {
    dispatch(updateTicketSuccess(currentTicket));
    const res = await ticketsAPI.updateTicket(
      currentTicket._id,
      currentTicket.content
    );
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const archiveTicketSuccess = (ticket) => {
  return {
    type: Types.ARCHIVE_TICKET_SUCCESS,
    payload: { ticket: ticket },
  };
};
const archiveTicketEvent = (ticket) => {
  return {
    type: Types.ARCHIVE_TICKET_EVENT_SUCCESS,
    payload: { ticket: ticket },
  };
};
const archiveTicket = (ticket) => async (dispatch) => {
  try {
    dispatch(archiveTicketSuccess(ticket));
    const res = await ticketsAPI.updateTicket(ticket._id, {
      isArchived: true,
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const getTicketsByStateSucess = (data) => {
  return {
    type: Types.GET_ALL_TICKETS_BY_BOARD,
    payload: data,
  };
};
const getAllUsersByTicketSuccess = (data) => {
  return {
    type: Types.GET_ALL_USERS_BY_TICKET_SUCCESS,
    payload: data,
  };
};
const clearTicketCurrent = () => {
  return {
    type: Types.CLEAR_TICKET_CURRENT,
  };
};
export {
  addTicket,
  getTicketSuccess,
  fetchTicketByState,
  getTicketError,
  getTicketPending,
  getUserInTicketSuccess,
  fetchUsersTicket,
  addUsersToTicketSuccess,
  addUserToTicket,
  deleteUsersFromTicketSuccess,
  deleteUsersFromTicket,
  getTicketByIdSuccess,
  updateMoveTicketSuccess,
  moveTicketAction,
  updateTicketSuccess,
  updateTicket,
  archiveTicketSuccess,
  archiveTicket,
  getTicketsByStateSucess,
  getAllUsersByTicketSuccess,
  addTicketSuccess,
  archiveTicketEvent,
  clearTicketCurrent,
};
