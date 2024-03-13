import request from "./axiosClient";

export const addDepartment = (newDepartment) =>
  request().post("/departments", newDepartment);

export const deleteDepartment = (_id) =>
  request().delete(`/departments/${_id}`);

export const updateDepartment = (_id, currentDepartment) =>
  request().put(`/departments/${_id}`, currentDepartment);

export const getDepartments = () => request().get("/departments/");
export const getDetailDepartmentById = (id) =>
  request().get(`/departments/${id}`);
export const addBoard = (newBoard) => request().post("/boards/", newBoard);

export const deleteBoard = (_id) => request().delete(`/boards/${_id}`);

export const updateBoard = (_id, currentBoard) =>
  request().put(`/boards/${_id}`, currentBoard);

export const getBoards = () => request().get("/boards/");


export const getBoardsDepartment = (_id) =>
  request().get(`/departments/${_id}/boards`);

export const getUsersDepartment = (_id) =>
  request().get(`/departments/${_id}/users`);

export const addUsersToDepartment = (_id, users) =>
  request().post(`/departments/${_id}/users`, users);

export const deleteUsersFromDepartment = (_id, users) =>
  request().delete(`/departments/${_id}/users`, { data: users });
