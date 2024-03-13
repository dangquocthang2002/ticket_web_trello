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
    default:
      return state;
  }
}
