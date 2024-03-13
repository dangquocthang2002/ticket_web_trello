import Types from "./tickets.constant";

const initialState = {
  isLoading: false,
  ticketsByState: {},
  error: null,
  ticketsUsers: {},
  ticket: {},
  ticketArchived: null,
};

const ticketReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_TICKET_PENDING:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case Types.GET_TICKET_SUCCESS:
      const { ticketsByState, stateId } = action.payload;
      return {
        ...state,
        isLoading: false,
        ticketsByState: {
          ...state.ticketsByState,
          [stateId]: [...ticketsByState],
        },
      };

    case Types.GET_TICKET_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };

    case Types.ADD_TICKET_SUCCESS:
      const { newTicketToAdd } = action.payload;

      return {
        ...state,
        ticketsByState: {
          ...state.ticketsByState,
          [newTicketToAdd.state]: [
            ...(state.ticketsByState[newTicketToAdd.state] || []),
            newTicketToAdd,
          ],
        },
      };

    case Types.UPDATE_TICKET_SUCCESS:
      const ticket = action.payload;
      const ticketUpdate = ticket.content ? ticket.content : ticket;
      return {
        ...state,
        ticket: {
          ...state.ticket,
          ...(ticket?._id === state.ticket._id ? ticketUpdate : {}),
        },
        ticketsByState: {
          ...state.ticketsByState,
          [ticket.state]: [
            ...(state.ticketsByState[ticket.state]?.map((t) =>
              t._id === ticket._id ? { ...t, ...ticketUpdate } : t
            ) || []),
          ],
        },
      };
    case Types.UPDATE_TICKET_MOVED_SUCCESS: {
      const { ticket: currentTicket, fromStateId, toStateId } = action.payload;

      const currentTicketsByState = { ...state.ticketsByState };

      if (fromStateId !== toStateId) {
        currentTicketsByState[fromStateId] = currentTicketsByState[
          fromStateId
        ].filter((t) => t._id !== currentTicket._id);

        currentTicketsByState[toStateId] = (
          currentTicketsByState[toStateId] || []
        ).concat(currentTicket);
      } else {
        currentTicketsByState[toStateId] = (
          currentTicketsByState[fromStateId] || []
        ).map((t) => (t._id === currentTicket._id ? currentTicket : t));
      }

      return {
        ...state,
        ticketsByState: currentTicketsByState,
        ticket:
          state.ticket?._id === currentTicket._id
            ? {
                ...state.ticket,
                ...currentTicket,
              }
            : state.ticket,
      };
    }

    case Types.GET_TICKET_DETAIL_SUCCESS:
      return {
        ...state,
        ticket: { ...action.payload },
      };

    case Types.GET_USER_IN_TICKET_SUCCESS:
      return {
        ...state,
        ticketsUsers: {
          ...state.ticketsUsers,
          [action.payload.ticketId]: action.payload.user,
        },
      };

    case Types.ADD_USERS_TO_TICKET_SUCCESS:
      return {
        ...state,
        ticketsUsers: {
          ...state.ticketsUsers,
          [action.payload.ticketId]: [
            ...(state.ticketsUsers[action.payload.ticketId] || []),
            action.payload.user,
          ],
        },
      };

    case Types.DELETE_USERS_FROM_TICKET_SUCCESS:
      return {
        ...state,
        ticketsUsers: {
          ...state.ticketsUsers,
          [action.payload.ticketId]: state.ticketsUsers[
            action.payload.ticketId
          ].filter((user) => user._id !== action.payload.user._id),
        },
      };
    case Types.ARCHIVE_TICKET_SUCCESS:
      return {
        ...state,
        ticketsByState: {
          ...state.ticketsByState,
          [action.payload.ticket.state]: state.ticketsByState[
            action.payload.ticket.state
          ].filter((ticket) => ticket._id !== action.payload.ticket._id),
        },
      };
    case Types.ARCHIVE_TICKET_EVENT_SUCCESS:
      return {
        ...state,
        ticketsByState: {
          ...state.ticketsByState,
          [action.payload.ticket.state]: state.ticketsByState[
            action.payload.ticket.state
          ].filter((ticket) => ticket._id !== action.payload.ticket._id),
        },
        ticketArchived: action.payload.ticket._id,
      };
    case Types.GET_ALL_TICKETS_BY_BOARD:
      return {
        ...state,
        isLoading: false,
        ticketsByState: action.payload,
        ticketArchived: null,
        ticket: state.ticket?._id
          ? action.payload[state.ticket.state]?.find(
              (t) => t?._id === state.ticket?._id
            )
          : {},
      };
    case Types.GET_ALL_USERS_BY_TICKET_SUCCESS:
      return {
        ...state,
        ticketsUsers: action.payload,
      };
    case Types.CLEAR_TICKET_CURRENT:
      return {
        ...state,
        ticket: {},
      };
    default:
      return state;
  }
};

export default ticketReducer;
