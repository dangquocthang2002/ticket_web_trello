const { default: Types } = require("./notifications.constant");

const initialState = {
  notifications: [],
  unSeen: 0,
  isNotification: false,
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_LIST_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        notifications: action.payload,
      };
    case Types.GET_LIST_NOTIFICATIONS_PENDING:
      return {
        ...state,
      };
    case Types.GET_LIST_NOTIFICATIONS_UNSEEN:
      return {
        ...state,
        unSeen: action.payload,
      };
    case Types.ADD_UNSEEN: {
      return {
        ...state,
        unSeen: state.unSeen + 1,
        isNotification: true,
      };
    }
    case Types.OFF_NOTIFICATION: {
      return {
        ...state,
        isNotification: false,
      };
    }
    default:
      return state;
  }
};
export default notificationsReducer;
