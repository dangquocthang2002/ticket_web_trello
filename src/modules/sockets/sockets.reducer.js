import Types from "./sockets.constant";

const initialState = {
  socketId: null,
};

export default function socketsReducer(state = initialState, action) {
  switch (action.type) {
    case Types.CONNECT_SOCKET: {
      return { ...state, socketId: action.payload.socketId };
    }
    case Types.DISCONNECT_SOCKET: {
      return { ...state, socketId: null };
    }
    case Types.CONNECT_SOCKET_NOTIFICATION: {
      return { ...state };
    }
    case Types.DISCONNECT_CONNECT_SOCKET_NOTIFICATION: {
      return { ...state };
    }
    default:
      return state;
  }
}
