import { apiArchive, apiDepartment } from "api";
import statesAPI from "api/states.api";
import ticketsAPI from "api/tickets.api";

import Types from "./archives.constant";

const getArchivedItemsSuccess = (data, object) => {
  return {
    type: Types.GET_ARCHIVED_ITEMS_SUCCESS,
    payload: { data: data, object: object },
  };
};
const fetchArchivedItems = (object) => async (dispatch) => {
  switch (object) {
    case "boards":
      try {
        const res = await apiArchive.getArchivedBoards().then((res) => {
          dispatch(
            getArchivedItemsSuccess(
              res.data.map((board) => {
                return {
                  ...board,
                  id: board._id,
                  name: board.name,
                  parent: {
                    department: board.department,
                  },
                  archivedAt: board.updatedAt.slice(0, 10),
                };
              }),
              object
            )
          );
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "states":
      try {
        const res = await apiArchive.getArchivedStates().then((res) => {
          dispatch(
            getArchivedItemsSuccess(
              res.data.map((state) => {
                return {
                  ...state,
                  id: state._id,
                  name: state.name,
                  parent: {
                    board: state.board,
                    department: state.board.department,
                  },
                  archivedAt: state.updatedAt.slice(0, 10),
                };
              }),
              object
            )
          );
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "tickets":
      try {
        const res = await apiArchive.getArchivedTickets().then((res) => {
          dispatch(
            getArchivedItemsSuccess(
              res.data.map((ticket) => {
                return {
                  ...ticket,
                  id: ticket._id,
                  name: ticket.name,
                  parent: {
                    state: ticket.state,
                    board: ticket.state.board,
                    department: ticket.state.board.department,
                  },
                  archivedAt: ticket.updatedAt.slice(0, 10),
                };
              }),
              object
            )
          );
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "departments":
      try {
        const res = await apiArchive.getArchivedDepartments().then((res) => {
          dispatch(
            getArchivedItemsSuccess(
              res.data.map((dapartment) => {
                return {
                  ...dapartment,
                  id: dapartment._id,
                  name: dapartment.name,
                  archivedAt: dapartment.updatedAt.slice(0, 10),
                };
              }),
              object
            )
          );
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    default:
      break;
  }
};

const restoreArchivedItemsSuccess = (data, object) => {
  return {
    type: Types.RESTORE_ARCHIVED_ITEMS_SUCCESS,
    payload: { data: data, object: object },
  };
};
const restoreArchivedItems = (data, object) => async (dispatch) => {
  switch (object) {
    case "boards":
      try {
        dispatch(restoreArchivedItemsSuccess(data, object));
        const res = await apiDepartment.updateBoard(data._id, {
          isArchived: false,
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "states":
      try {
        dispatch(restoreArchivedItemsSuccess(data, object));
        const res = await statesAPI.updateState(data._id, {
          isArchived: false,
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "tickets":
      try {
        dispatch(restoreArchivedItemsSuccess(data, object));
        const res = await ticketsAPI.updateTicket(data._id, {
          isArchived: false,
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "departments":
      try {
        dispatch(restoreArchivedItemsSuccess(data, object));
        const res = await apiDepartment.updateDepartment(data._id, {
          isArchived: false,
        });
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    default:
      break;
  }
};

const deleteArchivedItemsSuccess = (data, object) => {
  return {
    type: Types.DELETE_ARCHIVED_ITEMS_SUCCESS,
    payload: { data: data, object: object },
  };
};
const deleteArchivedItems = (data, object) => async (dispatch) => {
  switch (object) {
    case "boards":
      try {
        dispatch(deleteArchivedItemsSuccess(data, object));
        const res = await apiDepartment.deleteBoard(data._id);
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "states":
      try {
        dispatch(deleteArchivedItemsSuccess(data, object));
        const res = await statesAPI.deleteState(data._id);
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "tickets":
      try {
        dispatch(deleteArchivedItemsSuccess(data, object));
        const res = await ticketsAPI.deleteTicket(data._id);
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    case "departments":
      try {
        dispatch(deleteArchivedItemsSuccess(data, object));
        const res = await apiDepartment.deleteDepartment(data._id);
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    default:
      break;
  }
};
export {
  getArchivedItemsSuccess,
  fetchArchivedItems,
  restoreArchivedItemsSuccess,
  restoreArchivedItems,
  deleteArchivedItems,
  deleteArchivedItemsSuccess,
};
