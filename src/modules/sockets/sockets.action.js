const { default: Types } = require("./sockets.constant");

const connectSocket = (id) => ({
  type: Types.CONNECT_SOCKET,
  payload: {
    socketId: id,
  },
});
const connectSocketNotification = (id) => ({
  type: Types.CONNECT_SOCKET_NOTIFICATION,
  payload: {
    socketId: id,
  },
});
const disConnectSocketNotification = () => ({
  type: Types.DISCONNECT_CONNECT_SOCKET_NOTIFICATION,
});
const disConnectSocket = () => ({
  type: Types.DISCONNECT_SOCKET,
});
export {
  connectSocket,
  connectSocketNotification,
  disConnectSocket,
  disConnectSocketNotification,
};
