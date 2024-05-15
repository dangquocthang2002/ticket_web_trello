const { default: Types } = require("./notifications.constant");

const initialState = {
  notifications: [],
  unSeen: null,
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

    default:
      return state;
  }
};
export default notificationsReducer;
