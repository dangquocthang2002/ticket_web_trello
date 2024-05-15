import request from "./axiosClient";

export const getListNotification = (page, perPage) =>
  request().get(`/notification/list?page=${page}&perPage=${perPage}`);

export const getNotificationUnSeen = () =>
  request().get(`/notification/numberUnseen`);
