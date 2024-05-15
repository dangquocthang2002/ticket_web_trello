const { apiNotification } = require("api");
const { default: Types } = require("./notifications.constant");
const { toastError } = require("utils/toastHelper");

const getNotificationsPending = () => {
  return {
    type: Types.GET_LIST_NOTIFICATIONS_PENDING,
  };
};
const getNotificationsSuccess = (list) => {
  return {
    type: Types.GET_LIST_NOTIFICATIONS_SUCCESS,
    payload: list,
  };
};
const getListNotifications = () => async (dispatch) => {
  try {
    dispatch(getNotificationsPending());
    const res = await apiNotification.getListNotification();
    dispatch(getNotificationsSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const getListNotificationsUnSeen =
  (setZero = false) =>
  async (dispatch) => {
    if (setZero) {
      dispatch({
        type: Types.GET_LIST_NOTIFICATIONS_UNSEEN,
        payload: 0,
      });
    } else {
      try {
        const res = await apiNotification.getNotificationUnSeen();
        dispatch({
          type: Types.GET_LIST_NOTIFICATIONS_UNSEEN,
          payload: res.data,
        });
      } catch (error) {
        toastError(error.response.data);
        return Promise.reject(error);
      }
    }
  };

const addNotificationUnSeen = () => (dispatch) => {
  dispatch({
    type: Types.ADD_UNSEEN,
  });
};
const offNotification = () => (dispatch) => {
  dispatch({
    type: Types.OFF_NOTIFICATION,
  });
};
export {
  addNotificationUnSeen,
  getListNotifications,
  getListNotificationsUnSeen,
  offNotification,
};
