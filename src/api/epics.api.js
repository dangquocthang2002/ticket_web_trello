import request from "./axiosClient";

export const addEpicToBoard = (newEpic) => request().post(`/epics`, newEpic);
export const getEpicsByBoardId = (boardId) =>
  request().get(`/boards/${boardId}/epics`);
export const deleteEpic = (epicId) => request().delete(`/epics/${epicId}`);
export const updateEpic = (epicId, updateEpic) =>
  request().put(`/epics/${epicId}`, updateEpic);
