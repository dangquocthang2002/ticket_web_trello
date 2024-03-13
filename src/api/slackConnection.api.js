import request from "./axiosClient";

export const getSlackDataByBoardId = (boardId) =>
  request().get(`/boards/${boardId}/slack`);
export const updateSlackData = (boardId, data) =>
  request().put(`/boards/${boardId}/slack`, data);
