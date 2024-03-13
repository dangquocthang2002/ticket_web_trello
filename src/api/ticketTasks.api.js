import request from "./axiosClient";

export const addTaskToTicket = (newTask) => request().post(`/tasks`, newTask);

export const deleteTaskFromTicket = (taskId) =>
  request().delete(`/tasks/${taskId}`);
export const getTasksByTicketId = (ticketId) =>
  request().get(`/tickets/${ticketId}/tasks`);
export const updateTask = (taskId, task) =>
  request().put(`/tasks/${taskId}`, task);
