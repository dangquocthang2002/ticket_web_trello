import { apiTicketTask } from "api";
import { toastError } from "utils/toastHelper";
import Types from "./tasks.constant";

const getTasksByTicketIdSuccess = (ticketId, tasks) => ({
  type: Types.GET_TASKS_BY_TICKET_SUCCESS,
  payload: { tasks: tasks, ticketId: ticketId },
});
const fetchTasksByTicketId = (ticketId) => async (dispatch) => {
  try {
    const res = await apiTicketTask.getTasksByTicketId(ticketId).then((res) => {
      dispatch(getTasksByTicketIdSuccess(ticketId, res.data));
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const addTaskToTicketPending = (ticketId, newTask) => ({
  type: Types.ADD_TASK_PENDING,
  payload: {
    ticketId: ticketId,
    task: newTask,
  },
});
const addTaskToTicketSuccess = (ticketId, task) => ({
  type: Types.ADD_TASK_SUCCESS,
  payload: { task: task, ticketId: ticketId },
});
const addTaskToTicket = (ticketId, taskName) => async (dispatch) => {
  try {
    const newTask = {
      id: Date.now(),
      content: {
        name: taskName,
        status: "active",
        ticket: ticketId,
      },
    };
    dispatch(addTaskToTicketPending(ticketId, newTask));
    const res = await apiTicketTask
      .addTaskToTicket(newTask.content)
      .then((res) => {
        dispatch(addTaskToTicketSuccess(ticketId, { ...newTask, ...res.data }));
      });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);

    return Promise.reject(error);
  }
};
const deleteTaskSuccess = (ticketId, taskId) => ({
  type: Types.DELETE_TASK_SUCCESS,
  payload: { taskId: taskId, ticketId: ticketId },
});
const deleteTask = (ticketId, taskId) => async (dispatch) => {
  try {
    dispatch(deleteTaskSuccess(ticketId, taskId));
    const res = await apiTicketTask.deleteTaskFromTicket(taskId);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const updateTaskPending = (ticketId, task) => ({
  type: Types.UPDATE_TASK_PENDING,
  payload: { task: task, ticketId: ticketId },
});
const updateTicketTask = (ticketId, task) => async (dispatch) => {
  try {
    dispatch(updateTaskPending(ticketId, task));
    const { name, status } = task;
    const response = await apiTicketTask.updateTask(task._id, { name, status });
    return Promise.resolve(response);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const getAllTasksByTicketSuccess = (data) => {
  return {
    type: Types.GET_ALL_TASKS_BY_TICKET_SUCCESS,
    payload: data,
  };
};
export {
  getTasksByTicketIdSuccess,
  fetchTasksByTicketId,
  addTaskToTicket,
  deleteTask,
  updateTicketTask,
  getAllTasksByTicketSuccess,
  addTaskToTicketSuccess,
  updateTaskPending,
  deleteTaskSuccess,
};
