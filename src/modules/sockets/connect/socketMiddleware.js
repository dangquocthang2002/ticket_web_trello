import io from "socket.io-client";
import { getToken } from "utils/LocalStorageHandle";
import { socketConstants } from "modules/sockets";
import Types from "./event.constants";
import { SocketEvents } from "./index";

const socketBoardMiddleware = ({ getState, dispatch }) => {
  const socketIO = io(process.env.REACT_APP_SOCKET_URL + "/boards", {
    autoConnect: false,
    query: {
      token: getToken("ticket.token"), // TODO: add token from auth
    },
  });
  socketIO.on("connect", () => {
    const boardActive = getState().boards.boardActive;
    socketIO.emit("boardActive", boardActive, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("The board connect automaticaly!");
      }
    });
  });
  socketIO.on(Types.ADD_USER_TO_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addInvitedMembersToBoardEvent(data));
    }
  });
  socketIO.on(Types.REMOVE_USER_OUT_OF_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.deleteInvitedMembersFromBoardEvent(data));
    }
  });

  socketIO.on(Types.ADD_EPIC_TO_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addEpicToBoardEvent(data));
    }
  });

  socketIO.on(Types.UPDATE_EPIC_IN_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateEpicInBoardEvent(data));
    }
  });

  socketIO.on(Types.DELETE_EPIC_FROM_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.deleteEpicFromBoardEvent(data));
    }
  });

  socketIO.on(Types.CREATE_NEW_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addTicketEvent(data));
    }
  });
  socketIO.on(Types.UPDATE_TICKET_DETAILS, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateTicketEvent(data));
    }
  });
  socketIO.on(Types.ARCHIVE_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.archivedTicketEvent(data));
    }
  });
  socketIO.on(Types.RESTORE_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.restoreTicketEvent(data));
    }
  });
  socketIO.on(Types.MOVE_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateMoveTicketEvent(data));
    }
  });
  socketIO.on(Types.ADD_USER_TO_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addUsersToTicketEvent(data));
    }
  });
  socketIO.on(Types.REMOVE_USER_OUT_OF_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.deleteUsersFromTicketEvent(data));
    }
  });
  socketIO.on(Types.ADD_STATE, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addStateEvent(data));
    }
  });
  socketIO.on(Types.UPDATE_STATE_TITLE, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateStateEvent(data));
    }
  });
  socketIO.on(Types.MAKE_DONE_STATE, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateStateEvent(data));
    }
  });
  socketIO.on(Types.MOVE_STATE_POSITION, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateStateEvent(data));
    }
  });
  socketIO.on(Types.ARCHIVE_STATE, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.archivedStateEvent(data));
    }
  });
  socketIO.on(Types.RESTORE_STATE, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.restoreStateEvent(data));
    }
  });

  // label actions --------------------------------
  socketIO.on(Types.USER_CREATE_LABEL_TO_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addLabelEvent(data));
    }
  });
  socketIO.on(Types.USER_UPDATE_LABEL_INFO, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateLabelEvent(data));
    }
  });
  socketIO.on(Types.USER_DELETE_LABEL_OF_BOARD, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.deleteLabelEvent(data));
    }
  });
  socketIO.on(Types.USER_ADD_LABEL_TO_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addLabelToTicketEvent(data));
    }
  });
  socketIO.on(Types.USER_REMOVE_LABEL_OF_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.removeLabelOfTicketEvent(data));
    }
  });
  // ticketFiles events --------------------------------------------------

  socketIO.on(Types.USER_ADD_FILE_TO_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addFilesToTicketEvent(data));
    }
  });
  socketIO.on(Types.USER_UPDATE_FILE_IN_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateFileEvent(data));
    }
  });
  socketIO.on(Types.USER_DELETE_FILE_FROM_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.deleteFileEvent(data));
    }
  });

  // ticket tasks event -----------------------------------------
  socketIO.on(Types.USER_ADD_TASK_TO_TICKET, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.addTaskToTicketEvent(data));
    }
  });
  socketIO.on(Types.USER_UPDATE_TASK, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.updateTaskInTicketEvent(data));
    }
  });
  socketIO.on(Types.USER_DELETE_TASK, (data) => {
    if (data.clientId !== sessionStorage.getItem("client_id")) {
      return dispatch(SocketEvents.deleteTaskInTicketEvent(data));
    }
  });

  return (next) => (action) => {
    switch (action.type) {
      case socketConstants.CONNECT_SOCKET: {
        const returnVal = next(action);
        socketIO.connect();
        return returnVal;
      }
      case socketConstants.DISCONNECT_SOCKET: {
        const returnVal = next(action);
        socketIO.disconnect();
        return returnVal;
      }
      default: {
        const returnVal = next(action);
        return returnVal;
      }
    }
  };
};
export default socketBoardMiddleware;
