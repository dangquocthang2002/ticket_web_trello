import statesAPI from "api/states.api";
import { toastError } from "utils/toastHelper";
import Types from "./columns.constant";
import { getStates } from "./columns.selectors";

// SYNC actions
const getColumnPending = () => {
  return {
    type: Types.GET_COLUMN_PENDING,
  };
};

const getColumnSuccess = (states) => {
  return {
    type: Types.GET_COLUMN_SUCCESS,
    payload: { states },
  };
};

const getColumnError = (error) => {
  return {
    type: Types.GET_COLUMN_ERROR,
    payload: error,
  };
};

const addColumnSuccess = (newColumnToAdd) => {
  return {
    type: Types.ADD_COLUMNS_SUCCESS,
    payload: { newColumnToAdd },
  };
};
const editTitleSuccess = (newTitle) => {
  return {
    type: Types.EDIT_TITLE_COLUMN,
    payload: { newTitle },
  };
};

const updateColumnSuccess = (state) => ({
  type: Types.UPDATE_COLUMN_SUCCESS,
  payload: { state },
});

// ASYNC actions

const fetchStatesByBoard = (boardId) => async (dispatch) => {
  try {
    dispatch(getColumnPending());
    const res = await statesAPI.getStatesByBoard(boardId);
    dispatch(getColumnSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (err) {
    dispatch(getColumnError(err.message));
  }
};

const addColumn = (data) => async (dispatch) => {
  try {
    const res = await statesAPI.addState(data);

    dispatch(
      addColumnSuccess({
        ...res.data,
      })
    );
    return Promise.resolve(res.data);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const editTitle = (data) => async (dispatch) => {
  try {
    const res = await statesAPI.updateState(data._id, {
      name: data.name,
    });

    dispatch(editTitleSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (error) {
    toastError(error.response.data);

    return Promise.reject(error);
  }
};

// update move Column

const moveColumnAction = (dropResult) => {
  return async (dispatch, getState) => {
    try {
      const states = getStates(getState());

      const isMoveForward =
        dropResult.addedIndex - dropResult.removedIndex >= 0;

      const leftState = isMoveForward
        ? states[dropResult.addedIndex]
        : states[dropResult.addedIndex - 1];
      const rightState = isMoveForward
        ? states[dropResult.addedIndex + 1]
        : states[dropResult.addedIndex];

      let newPossition = dropResult.column.positionIndex || 0;

      if (leftState && rightState) {
        newPossition = (leftState.positionIndex + rightState.positionIndex) / 2;
      } else {
        if (isMoveForward) {
          if (!rightState) {
            newPossition = leftState.positionIndex + 10;
          }
        } else {
          if (!leftState) {
            newPossition = rightState.positionIndex / 2;
          }
        }
      }

      const newColumn = {
        ...dropResult.column,
        positionIndex: newPossition,
      };

      dispatch(updateColumnSuccess(newColumn));

      await statesAPI.updateState(newColumn._id, {
        positionIndex: newPossition,
      });
    } catch (error) {
      toastError(error.response.data);
      return Promise.reject(error);
    }
  };
};
const archiveStateSuccess = (state) => {
  return {
    type: Types.ARCHIVE_STATE_SUCCESS,
    payload: { state: state },
  };
};

const archiveStateEvent = (state) => {
  return {
    type: Types.ARCHIVE_STATE_EVENT_SUCCESS,
    payload: { state: state },
  };
};
const archiveState = (state) => async (dispatch) => {
  try {
    dispatch(archiveStateSuccess(state));
    const res = await statesAPI.updateState(state._id, {
      isArchived: true,
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const doneStateSuccess = (state) => {
  return {
    type: Types.DONE_STATE_SUCCESS,
    payload: {state},
  };
};

const doneState = (state) => async (dispatch) => {
  try {
    dispatch(doneStateSuccess(state));
    const res = await statesAPI.updateState(
      state._id,
      state.body
      )  
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};


export {
  doneState,
  updateColumnSuccess,
  moveColumnAction,
  fetchStatesByBoard,
  getColumnPending,
  getColumnSuccess,
  getColumnError,
  addColumn,
  editTitle,
  editTitleSuccess,
  archiveStateSuccess,
  archiveState,
  addColumnSuccess,
  archiveStateEvent,
};
