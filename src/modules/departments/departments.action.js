import { apiDepartment, apiUser } from "api";
import { boardColors } from "utils/colors";
import { toastError } from "utils/toastHelper";
import Types from "./departments.constant";
import {
  getSortBoardsPositionOfDepartment,
  getSortDepartmentsPositions,
} from "./departments.selectors";
//SYNC

const getDepartmentSuccess = (departments, departmentsPositions) => {
  return {
    type: Types.GET_DEPARTMENT_SUCCESS,
    payload: {
      departments: departments,
      departmentsPositions: departmentsPositions,
    },
  };
};

const getSelectedDepartmentSuccess = (department) => {
  return {
    type: Types.GET_SELECTED_DEPARTMENT_SUCCESS,
    payload: { department },
  };
};

const getSelectedDepartmenPending = () => {
  return {
    type: Types.GET_SELECTED_DEPARTMENT_PENDING,
  };
};

const getDepartmentPending = () => {
  return {
    type: Types.GET_DEPARTMENT_PENDING,
  };
};

const getDepartmentError = (error) => {
  return {
    type: Types.GET_DEPARTMENT_ERROR,
    payload: error,
  };
};

const addDepartmentSuccess = (data) => {
  return {
    type: Types.ADD_DEPARTMENT_SUCCESS,
    payload: data,
  };
};

const addDepartmentPending = (newDepartment, newDepartmentPositions) => {
  return {
    type: Types.ADD_DEPARTMENT_PENDING,
    payload: {
      newDepartment: newDepartment,
      newDepartmentPositions: newDepartmentPositions,
    },
  };
};

const updateDepartmentSuccess = (currentDepartment) => {
  return {
    type: Types.UPDATE_DEPARTMENT_SUCCESS,
    payload: currentDepartment,
  };
};

const getUserInDepartmentSuccess = (departmentId, users) => ({
  type: Types.GET_USERS_IN_DEPARTMENT_SUCCESS,
  payload: {
    departmentId: departmentId,
    users: users,
  },
});

const addUsersToDepartmentSuccess = (departmentId, user) => ({
  type: Types.ADD_USERS_TO_DEPARTMENT_SUCCESS,
  payload: {
    departmentId: departmentId,
    user: user,
  },
});

const deleteUsersFromDepartmentSuccess = (departmentId, user) => ({
  type: Types.DELETE_USERS_FROM_DEPARTMENT_SUCCESS,
  payload: {
    departmentId: departmentId,
    user: user,
  },
});

const getBoardByDepartmentSuccess = (departmentId, boards, boardPositions) => ({
  type: Types.GET_BOARD_BY_DEPARTMENT_SUCCESS,
  payload: {
    departmentId: departmentId,
    boards: boards,
    boardPositions: boardPositions,
  },
});

const addBoardToDepartmentPending = (departmentId, newBoard) => ({
  type: Types.ADD_BOARD_TO_DEPARTMENT_PENDING,
  payload: { departmentId: departmentId, newBoard: newBoard },
});

const addBoardToDepartmentSuccess = (departmentId, newBoardAPI) => ({
  type: Types.ADD_BOARD_TO_DEPARTMENT_SUCCESS,
  payload: { departmentId: departmentId, newBoardAPI: newBoardAPI },
});

const updateBoardPending = (departmentId, currentBoard) => ({
  type: Types.UPDATE_BOARD_PENDING,
  payload: { departmentId: departmentId, currentBoard: currentBoard },
});

const updateBoardSuccess = () => ({
  type: Types.UPDATE_BOARD_SUCCESS,
});

//ASYNC

const addDepartment = () => async (dispatch, getState) => {
  try {
    const departmentsPositions = getSortDepartmentsPositions(getState());
    const positionIndex =
      (departmentsPositions[departmentsPositions.length - 1]?.posIndex || 0) +
      1000;
    const newDepartment = {
      id: Date.now(),
      name: "New Department " + Date.now(),
      description: "New Department",
      positionIndex: positionIndex,
    };
    const newDepartmentPositions = [
      ...departmentsPositions,
      {
        departmentId: newDepartment.id,
        posIndex:
          (departmentsPositions[departmentsPositions.length - 1]?.posIndex ||
            0) + 1,
        boards: [],
      },
    ];
    dispatch(addDepartmentPending(newDepartment, newDepartmentPositions));

    const res = await apiDepartment.addDepartment(newDepartment).then((res) => {
      dispatch(addDepartmentSuccess({ ...newDepartment, ...res.data }));
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const updateDepartment = (currentDepartment) => async (dispatch) => {
  try {
    dispatch(updateDepartmentSuccess(currentDepartment));
    const res = await apiDepartment.updateDepartment(
      currentDepartment._id,
      currentDepartment
    );
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
// const initDepartmentPosition = (departments) => ({
//   type: Types.SET_INIT_DEPARTMENT_POSITION,
//   payload: departments,
// });
const updateNewPositionDepartment = (newPositionDepartment) => ({
  type: Types.UPDATE_DEPARTMENT_POSITION,
  payload: newPositionDepartment,
});
const moveDepartmentAction = (dropResult) => (dispatch, getState) => {
  try {
    const departmentsPositions = getSortDepartmentsPositions(getState());

    const isMoveForward = dropResult.addedIndex - dropResult.removedIndex >= 0;
    const aboveDepartment = isMoveForward
      ? departmentsPositions[dropResult.addedIndex]
      : departmentsPositions[dropResult.addedIndex - 1];
    const belowDepartment = isMoveForward
      ? departmentsPositions[dropResult.addedIndex + 1]
      : departmentsPositions[dropResult.addedIndex];
    let newPosition = 0;
    if (aboveDepartment && belowDepartment) {
      newPosition = (aboveDepartment.posIndex + belowDepartment.posIndex) / 2;
    } else {
      if (isMoveForward) {
        if (!belowDepartment) {
          newPosition = aboveDepartment.posIndex + 1;
        }
      } else {
        if (!aboveDepartment) {
          newPosition = belowDepartment.posIndex - 1;
        }
      }
    }
    const newPositionDepartment = {
      ...departmentsPositions[dropResult.removedIndex],
      posIndex: newPosition,
    };
    localStorage.setItem(
      "departmentsPositions",
      JSON.stringify(
        departmentsPositions.map((dpt) =>
          dpt.departmentId === newPositionDepartment.departmentId
            ? { ...dpt, ...newPositionDepartment }
            : dpt
        )
      )
    );
    dispatch(updateNewPositionDepartment(newPositionDepartment));
  } catch (error) {
    console.log(error);
  }
};

const fetchDepartments = () => async (dispatch) => {
  const departmentsPositions = localStorage.getItem("departmentsPositions");
  return await apiDepartment
    .getDepartments()
    .then((res) => {
      dispatch(
        getDepartmentSuccess(
          res.data,
          res.data.map((dpt) => {
            const dptPst = (JSON.parse(departmentsPositions) || [])?.find(
              (dptPst) => dptPst.departmentId === dpt?._id
            );
            if (dptPst) {
              return dptPst;
            } else {
              return {
                departmentId: dpt?._id,
                posIndex: dpt?.positionIndex || Date.parse(dpt?.createdAt) || 0,
                // posIndex: new Date(dpt?.createdAt).getTime() || 0,
                boards: [],
              };
            }
          })
        )
      );
    })
    .catch((err) => {
      console.log(err);
      dispatch(getDepartmentError(err));
    });
};

const fetchUsersDepartment = (departmentId) => async (dispatch) => {
  try {
    const res = await apiDepartment.getUsersDepartment(departmentId);
    dispatch(
      getUserInDepartmentSuccess(departmentId, [
        ...res.data.users.map((user) => user.userId),
      ])
    );
    return Promise.resolve(res.data.users);
  } catch (error) {
    return Promise.reject(error);
  }
};

const addUsersToDepartment =
  (departmentId, users = []) =>
  async (dispatch) => {
    try {
      users.forEach((u) => {
        dispatch(addUsersToDepartmentSuccess(departmentId, u));
      });

      const res = await apiDepartment.addUsersToDepartment(departmentId, {
        users: users.map((u) => u._id),
      });

      return Promise.resolve(res);
    } catch (error) {
      toastError(error.response.data);
      return Promise.reject(error);
    }
  };

const deleteUsersFromDepartment =
  (departmentId, users = []) =>
  async (dispatch) => {
    try {
      users.forEach((user) => {
        dispatch(deleteUsersFromDepartmentSuccess(departmentId, user));
      });

      const res = await apiDepartment.deleteUsersFromDepartment(departmentId, {
        users: users.map((user) => user._id),
      });

      return Promise.resolve(res);
    } catch (error) {
      toastError(error.response.data);
      return Promise.reject(error);
    }
  };

const fetchBoardsByDepartment =
  (departmentId) => async (dispatch, getState) => {
    // const departmentsPositions = localStorage.getItem("departmentsPositions");
    dispatch(getSelectedDepartmenPending());
    await apiDepartment
      .getBoardsDepartment(departmentId)
      .then((res) => {
        // const dptPst = (JSON.parse(departmentsPositions) || [])?.find(
        //   (dptPst) => dptPst.departmentId === departmentId
        // );
        dispatch(
          getBoardByDepartmentSuccess(
            departmentId,
            res.data.boards,
            res.data.boards.map((board) => {
              // const boardPst = (dptPst ? dptPst.boards : []).find(
              //   (b) => b.boardId === board?._id
              // );
              // if (boardPst) {
              //   return boardPst;
              // } else {
              return {
                boardId: board?._id,
                posIndex:
                  board?.positionIndex || Date.parse(board?.createdAt) || 0,
                // posIndex: new Date(board?.createdAt).getTime() || 0,
              };
              // }
            })
          )
        );

        dispatch(getSelectedDepartmentSuccess(res.data.department));
      })
      .catch((err) => {
        console.log(err);
        dispatch(getBoardByDepartmentSuccess(departmentId, []));
      });
  };

const addBoardToDepartment = (departmentId) => async (dispatch, getState) => {
  try {
    const boardsPositionsOfDepartment = getSortBoardsPositionOfDepartment(
      getState(),
      departmentId
    );
    const newPositionIndex =
      boardsPositionsOfDepartment[boardsPositionsOfDepartment.length - 1]
        ?.posIndex || 0 + 1000;
    const newBoard = {
      id: Date.now(),
      content: {
        name: "New Board" + Date.now(),
        description:
          boardColors[Math.floor(Math.random() * boardColors.length)],
        department: departmentId,
        positionIndex: newPositionIndex,
      },
    };
    dispatch(addBoardToDepartmentPending(departmentId, newBoard));
    const res = await apiDepartment.addBoard(newBoard.content).then((res) => {
      dispatch(
        addBoardToDepartmentSuccess(departmentId, { ...newBoard, ...res.data })
      );
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error);
    return Promise.reject(error);
  }
};

const updateBoard = (departmentId, currentBoard) => async (dispatch) => {
  try {
    dispatch(updateBoardPending(departmentId, currentBoard));
    const res = await apiDepartment
      .updateBoard(currentBoard._id, currentBoard.content)
      .then(() => {
        dispatch(updateBoardSuccess());
      });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);

    return Promise.reject(error);
  }
};

const getDepartmentsByCurrentUserSuccess = (
  departments,
  departmentsPositions
) => ({
  type: Types.GET_DEPARTMENTS_BY_CURRENT_USER_SUCCESS,
  payload: {
    listDepartments: departments,
    departmentsPositions: departmentsPositions,
  },
});
const fetchDepartmentsByCurrentUser = (userId) => async (dispatch) => {
  try {
    const departmentsPositions = localStorage.getItem("departmentsPositions");

    const res = await apiUser
      .getDepartmentsByCurrentUser(userId)
      .then((res) => {
        const data = res.data.departments.map(
          (department) => department.departmentId
        );
        if (!departmentsPositions) {
          dispatch(
            getDepartmentsByCurrentUserSuccess(
              data,
              data.map((dpt) => ({
                departmentId: dpt?._id,
                // posIndex: dpt?.positionIndex || 0,
                posIndex: new Date(dpt?.createdAt).getTime() || 0,
                boards: [],
              }))
            )
          );
        } else {
          dispatch(
            getDepartmentsByCurrentUserSuccess(
              data,
              data.map((dpt) => {
                const dptPst = JSON.parse(departmentsPositions)?.find(
                  (dptPst) => dptPst.departmentId === dpt?._id
                );
                if (dptPst) {
                  return dptPst;
                } else {
                  return {
                    departmentId: dpt?._id,
                    // posIndex: dpt?.positionIndex || 0,
                    posIndex: new Date(dpt?.createdAt).getTime() || 0,
                    boards: [],
                  };
                }
              })
            )
          );
        }
      });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
//
const archiveBoardSuccess = (board) => {
  return {
    type: Types.ARCHIVE_BOARD_SUCCESS,
    payload: { board: board },
  };
};
const archiveBoard = (board) => async (dispatch) => {
  try {
    dispatch(archiveBoardSuccess(board));
    const res = await apiDepartment.updateBoard(board._id, {
      isArchived: true,
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const archiveDepartmentSuccess = (department) => {
  return {
    type: Types.ARCHIVE_DEPARTMENT_SUCCESS,
    payload: { department: department },
  };
};
const archiveDepartment = (department) => async (dispatch, getState) => {
  try {
    const departmentsPositions = getSortDepartmentsPositions(getState());

    dispatch(archiveDepartmentSuccess(department));
    localStorage.setItem(
      "departmentsPositions",
      JSON.stringify(
        departmentsPositions.filter(
          (dpt) => dpt.departmentId !== department._id
        )
      )
    );
    const res = await apiDepartment.updateDepartment(department._id, {
      isArchived: true,
    });
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};
const moveBoardAction = (dropResult) => async (dispatch, getState) => {
  try {
    const { newIndex, oldIndex, boardId, fromDepartmentId, toDepartmentId } =
      dropResult;
    const departmentsPositions = getSortDepartmentsPositions(getState());

    const isMoveForward = newIndex - oldIndex >= 0;
    if (toDepartmentId === fromDepartmentId) {
      const boardsPositionsOfDepartment = getSortBoardsPositionOfDepartment(
        getState(),
        fromDepartmentId
      );
      let newPosition =
        boardsPositionsOfDepartment.find((board) => board.boardId === boardId)
          .posIndex || 0;
      const leftBoard = isMoveForward
        ? boardsPositionsOfDepartment[newIndex]
        : boardsPositionsOfDepartment[newIndex - 1];
      const rightBoard = isMoveForward
        ? boardsPositionsOfDepartment[newIndex + 1]
        : boardsPositionsOfDepartment[newIndex];

      if (leftBoard && rightBoard) {
        newPosition = (leftBoard.posIndex + rightBoard.posIndex) / 2;
      } else {
        if (isMoveForward) {
          if (!rightBoard) {
            newPosition = leftBoard.posIndex + 1;
          }
        } else {
          if (!leftBoard) {
            newPosition = rightBoard.posIndex - 1;
          }
        }
      }
      const newPositionBoardsOfDepartment = boardsPositionsOfDepartment.map(
        (board) =>
          board.boardId === boardId
            ? {
                ...board,
                posIndex: newPosition,
              }
            : board
      );
      const newDepartmentsPosition = departmentsPositions.map((dpt) =>
        dpt.departmentId === toDepartmentId
          ? { ...dpt, boards: newPositionBoardsOfDepartment }
          : dpt
      );

      localStorage.setItem(
        "departmentsPositions",
        JSON.stringify(newDepartmentsPosition)
      );
      dispatch(updateNewPositionBoardsOfDepartment(newDepartmentsPosition));
    } else {
      if (getState().users.user.role !== "ADMIN") {
        return;
      }
      const boardsPositionsOfDepartment = getSortBoardsPositionOfDepartment(
        getState(),
        toDepartmentId
      );
      let newPosition = 0;
      const leftBoard = boardsPositionsOfDepartment[newIndex - 1];
      const rightBoard = boardsPositionsOfDepartment[newIndex];
      if (leftBoard && rightBoard) {
        newPosition = (leftBoard.posIndex + rightBoard.posIndex) / 2;
      } else {
        if (!rightBoard) {
          newPosition = leftBoard ? leftBoard.posIndex + 1 : 1000;
        } else {
          if (!leftBoard) {
            newPosition = (rightBoard?.posIndex || 0) - 1;
          }
        }
      }
      const newDepartmentsPosition = departmentsPositions.map((department) => {
        if (department.departmentId === fromDepartmentId) {
          return {
            ...department,
            boards: department.boards.filter(
              (board) => board.boardId !== boardId
            ),
          };
        } else if (department.departmentId === toDepartmentId) {
          return {
            ...department,
            boards: [
              ...department.boards,
              { boardId: boardId, posIndex: newPosition },
            ],
          };
        }
        return department;
      });
      localStorage.setItem(
        "departmentsPositions",
        JSON.stringify(newDepartmentsPosition)
      );
      dispatch(updateNewPositionBoardsOfDepartment(newDepartmentsPosition));
      const board = getState().departments.departmentsBoards[
        fromDepartmentId
      ]?.find((board) => (board?._id || board?.id) === boardId);
      dispatch(
        updateDepartmentIdOfBoard(
          { ...board, department: toDepartmentId },
          fromDepartmentId,
          toDepartmentId
        )
      );
      await apiDepartment.updateBoard(board._id, {
        department: toDepartmentId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const updateDepartmentIdOfBoard = (
  newBoard,
  fromDepartmentId,
  toDepartmentId
) => ({
  type: Types.UPDATE_DEPARTMENT_ID_OF_BOARD,
  payload: {
    newBoard: newBoard,
    fromDepartmentId: fromDepartmentId,
    toDepartmentId: toDepartmentId,
  },
});
const updateNewPositionBoardsOfDepartment = (newDepartmentsPosition) => ({
  type: Types.UPDATE_BOARDS_POSITION_OF_DEPARTMENT,
  payload: {
    newDepartmentsPosition: newDepartmentsPosition,
  },
});
export {
  addBoardToDepartment,
  addDepartment,
  addDepartmentPending,
  addDepartmentSuccess,
  addUsersToDepartment,
  archiveBoard,
  archiveBoardSuccess,
  archiveDepartment,
  deleteUsersFromDepartment,
  fetchBoardsByDepartment,
  fetchDepartments,
  fetchDepartmentsByCurrentUser,
  fetchUsersDepartment,
  getDepartmentError,
  getDepartmentPending,
  getDepartmentSuccess,
  getSelectedDepartmenPending,
  moveBoardAction,
  moveDepartmentAction,
  updateBoard,
  updateDepartment,
  updateDepartmentSuccess,
};
