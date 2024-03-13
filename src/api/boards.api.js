import request from "./axiosClient";
export const getDetailBoardById = (_id) => request().get(`/boards/${_id}`);

export const getInvitedMembersOfBoard = (boardId) =>
  request().get(`/boards/${boardId}/invited-members`);

export const addInvitedMembersToBoard = (boardId, invitedMembers) =>
  request().post(`/boards/${boardId}/invited-members`, invitedMembers);

export const deleteInvitedMembersFromBoard = (boardId, invitedMembers) =>
  request().delete(`/boards/${boardId}/invited-members`, {
    data: invitedMembers,
  });
export const getTicketsOfBoard = (boardId) =>
  request().get(`/boards/${boardId}/tickets`);
