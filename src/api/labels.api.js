import request from "./axiosClient";

export const addLabelToBoard = (newLabel) =>
  request().post(`/labels`, newLabel);

export const deleteLabel = (_id, ticketId) =>
  request().delete(`/labels/${_id}?ticketIdDeleteLabel=${ticketId}`);

export const updateLabel = (_id, currentLabel) =>
  request().put(`/labels/${_id}`, currentLabel);

export const getLabelsByBoard = (_id) => request().get(`/boards/${_id}/labels`);
