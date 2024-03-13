const { default: Types } = require("./sockets.constant");

const connectSocket = (id) => ({
  type: Types.CONNECT_SOCKET,
  payload: {
    socketId: id,
  },
});
const disConnectSocket = () => ({
  type: Types.DISCONNECT_SOCKET,
});
export { connectSocket, disConnectSocket };
