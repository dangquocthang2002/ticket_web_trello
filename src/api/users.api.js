import request from "./axiosClient";

export const getUsers = () => request().get("/users/");
export const getDepartmentsByCurrentUser = (userId) =>
  request().get(`/users/${userId}/departments`);

export const getBoardsByInvitedMember = (userId) =>
  request().get(`/users/${userId}/invited-boards`);

export const getUserByEmail = async (emailObj) =>
  request().get("/users/email-user", { data: emailObj });

export const getTicketsByCurrentUser = (userId) =>
  request().get(`/users/${userId}/tickets`);

export const addNewUserAPI = (user) =>
  request().post(`/users/create-user`, user);
