import request from "./axiosClient";

export const getGithubDataByBoardId = (boardId) =>
  request().get(`/boards/${boardId}/github`);
export const createGithubDataByBoardId = (boardId) =>
  request().post(`/boards/${boardId}/github`);
export const updateGithubData = (boardId, data) =>
  request().put(`/boards/${boardId}/github`, data);
export const getPullRequestsByTicket = (ticketId) =>
  request().get(`/tickets/${ticketId}/pull-requests`);
