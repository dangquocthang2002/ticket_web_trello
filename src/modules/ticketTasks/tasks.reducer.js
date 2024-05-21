import Types from "./tasks.constant";

const initialState = {
  ticketTasks: {},
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_TASKS_BY_TICKET_SUCCESS:
      return {
        ...state,
        ticketTasks: {
          ...state.ticketTasks,
          [action.payload.ticketId]: action.payload.tasks,
        },
      };
    case Types.ADD_TASK_PENDING:
      return {
        ...state,
        ticketTasks: {
          ...state.ticketTasks,
          [action.payload.ticketId]: [
            ...(state.ticketTasks[action.payload.ticketId] || []),
            action.payload.task,
          ],
        },
      };
    case Types.ADD_TASK_SUCCESS:
      return {
        ...state,
        ticketTasks: {
          ...state.ticketTasks,
          [action.payload.ticketId]: action.payload.task.id
            ? state.ticketTasks[action.payload.ticketId].map((task) => {
                if (task.id === action.payload.task.id) {
                  return action.payload.task;
                }
                return task;
              })
            : [
                ...(state.ticketTasks[action.payload.ticketId] || []),
                action.payload.task,
              ],
        },
      };
    case Types.DELETE_TASK_SUCCESS:
      return {
        ...state,
        ticketTasks: {
          ...state.ticketTasks,
          [action.payload.ticketId]: state.ticketTasks[
            action.payload.ticketId
          ].filter((task) => task._id !== action.payload.taskId),
        },
      };
    case Types.UPDATE_TASK_PENDING:
      return {
        ...state,
        ticketTasks: {
          ...state.ticketTasks,
          [action.payload.ticketId]: state.ticketTasks[
            action.payload.ticketId
          ]?.map((task) => {
            if (task._id === action.payload.task._id) {
              return action.payload.task;
            }
            return task;
          }),
        },
      };
    case Types.GET_ALL_TASKS_BY_TICKET_SUCCESS:
      return {
        ...state,
        ticketTasks: action.payload,
      };
    default:
      return state;
  }
};

export default taskReducer;
