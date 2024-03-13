import request from "./axiosClient";

export const getArchivedBoards = () => request().get("archived/boards/");
export const getArchivedStates = () => request().get("archived/states/");
export const getArchivedTickets = () => request().get("archived/tickets/");
export const getArchivedDepartments = () =>
  request().get("archived/departments/");
