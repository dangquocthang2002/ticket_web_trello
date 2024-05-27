import { apiBoard, apiUser } from "api";
import { getAllFilesByTicketSuccess } from "modules/files/files.action";
import { getAllLabelsByTicketSuccess } from "modules/labels/labels.action";
import {
  getAllUsersByTicketSuccess,
  getTicketsByStateSucess,
} from "modules/tickets/tickets.action";

import { getAllTasksByTicketSuccess } from "modules/ticketTasks/tasks.action";
import { toastError } from "utils/toastHelper";
import Types from "./boards.constant";
import {
  getSortGuestBoardPositions,
  getSortGuestDepartmentsPositions,
} from "./boards.selectors";

const getDetailBoardSuccess = (board) => ({
  type: Types.GET_DETAIL_BOARD_SUCCESS,
  payload: board,
});

const getDetailBoardById = (id) => async (dispatch) => {
  try {
    const res = await apiBoard.getDetailBoardById(id);
    const data = res.data;
    dispatch(getDetailBoardSuccess(data));
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
};
const getBoardsByInvitedUserSuccess = (
  invitedUserBoards,
  guestUserDepartments,
  guestDepartmentsPositions
) => ({
  type: Types.GET_BOARDS_BY_INVITED_USER_SUCCESS,
  payload: {
    invitedUserBoards: invitedUserBoards,
    guestUserDepartments: guestUserDepartments,
    guestDepartmentsPositions: guestDepartmentsPositions,
  },
});

const getInvitedMembersOfBoardActiveSuccess = (users) => ({
  type: Types.GET_INVITED_MEMBERS_BOARD_ACTIVE_SUCCESS,
  payload: users,
});
const fetchBoardsByInvitedUser = (userId) => async (dispatch) => {
  try {
    const guestDepartmentsPositions = localStorage.getItem(
      "guestDepartmentsPositions"
    );
    const res = await apiUser.getBoardsByInvitedMember(userId).then((res) => {
      const boards = res.data.boards.map((board) => board.board);
      dispatch(
        getBoardsByInvitedUserSuccess(
          boards,
          res.data.guestDepartments,
          res.data.guestDepartments.map((dpt) => {
            const dptPst = (JSON.parse(guestDepartmentsPositions) || [])?.find(
              (dptPst) => dptPst.departmentId === dpt?._id
            );
            const boardFilter = boards.filter(
              (board) => board.department?._id === dpt?._id
            );
            if (dptPst) {
              return {
                ...dptPst,
                boards: boardFilter.map((board) => {
                  const boardPst = dptPst.boards.find(
                    (b) => b.boardId === board?._id
                  );
                  if (boardPst) {
                    return boardPst;
                  } else {
                    return {
                      boardId: board?._id,
                      posIndex:
                        board?.positionIndex ||
                        Date.parse(board?.createdAt) ||
                        0,

                      // posIndex: new Date(board?.createdAt).getTime() || 0,
                    };
                  }
                }),
              };
            } else {
              return {
                departmentId: dpt?._id,
                posIndex:
                  dpt?._positionIndex || Date.parse(dpt?.createdAt) || 0,
                boards: boardFilter.map((board) => ({
                  boardId: board?._id,
                  posIndex:
                    board?.positionIndex || Date.parse(board?.createdAt) || 0,

                  // posIndex: new Date(board?.createdAt).getTime() || 0,
                })),
              };
            }
          })
        )
      );
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const fetchInvitedMembersOfBoardActive = (boardId) => async (dispatch) => {
  try {
    const res = await apiBoard.getInvitedMembersOfBoard(boardId);
    dispatch(
      getInvitedMembersOfBoardActiveSuccess(
        res.data.invitedMembers.map((user) => user.user)
      )
    );
    return Promise.resolve(res.data.invitedMembers);
  } catch (error) {
    return Promise.reject(error);
  }
};
//
const addInvitedMembersToBoardActivePending = (member) => {
  return {
    type: Types.ADD_INVITED_MEMBERS_BOARD_ACTIVE_PENDING,
    payload: member,
  };
};
const addInvitedMembersToBoardActiveSuccess = () => {
  return {
    type: Types.ADD_INVITED_MEMBERS_BOARD_ACTIVE_SUCCESS,
  };
};
const addInvitedMembersToBoardActive = (boardId, user) => async (dispatch) => {
  try {
    dispatch(addInvitedMembersToBoardActivePending(user));
    const member = {
      users: [user._id],
    };
    const res = await apiBoard
      .addInvitedMembersToBoard(boardId, member)
      .then(() => dispatch(addInvitedMembersToBoardActiveSuccess()));

    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);

    return Promise.reject(error);
  }
};
const deleteInvitedMembersFromBoardSuccess = (userId) => ({
  type: Types.DELETE_INVITED_MEMBERS_BOARD_ACTIVE_SUCCESS,
  payload: userId,
});
const deleteInvitedMembersFromBoard = (boardId, user) => async (dispatch) => {
  try {
    dispatch(deleteInvitedMembersFromBoardSuccess(user._id));
    const member = {
      users: [user._id],
    };
    const res = await apiBoard.deleteInvitedMembersFromBoard(boardId, member);
    return Promise.resolve(res);
  } catch (error) {
    toastError(error.response.data);
    return Promise.reject(error);
  }
};

const fetchTicketsByBoard = (boardId) => async (dispatch, getState) => {
  try {
    const state = getState();
    const res = await apiBoard.getTicketsOfBoard(boardId).then((res) => {
      console.log(
        res.data.filter((ticket) =>
          ticket.members
            .map((member) => member._id)
            ?.includes(state.users.user?._id)
        )
      );
      const states = state.states.states.reduce((obj, item) => {
        return {
          ...obj,
          [item["_id"]]: [],
        };
      }, {});
      const ticketTasks = {};
      const ticketUsers = {};
      const ticketAttachments = {};
      const ticketLabels = [];

      res.data.forEach((ticket) => {
        states[ticket.state].push(ticket);
        ticketTasks[ticket._id] = ticket.tasks;
        ticketUsers[ticket._id] = ticket.members;
        ticketAttachments[ticket._id] = ticket.attachments
          .map((file) => ({
            ...file?._doc,
            isCovered: file?.isCovered,
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        ticketLabels.push({
          ticketId: ticket._id,
          labelsActive: ticket.labels,
        });
      });
      dispatch({
        type: Types.GET_TICKETS_OF_BOARD,
        payload: res.data,
      });
      dispatch(getTicketsByStateSucess(states));
      dispatch(getAllLabelsByTicketSuccess(ticketLabels));
      dispatch(getAllUsersByTicketSuccess(ticketUsers));
      dispatch(getAllFilesByTicketSuccess(ticketAttachments));
      dispatch(getAllTasksByTicketSuccess(ticketTasks));
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const moveGuestDepartmentAction = (dropResult) => (dispatch, getState) => {
  try {
    const guestDepartmentsPositions = getSortGuestDepartmentsPositions(
      getState()
    );
    const isMoveForward = dropResult.addedIndex - dropResult.removedIndex >= 0;
    const aboveDepartment = isMoveForward
      ? guestDepartmentsPositions[dropResult.addedIndex]
      : guestDepartmentsPositions[dropResult.addedIndex - 1];
    const belowDepartment = isMoveForward
      ? guestDepartmentsPositions[dropResult.addedIndex + 1]
      : guestDepartmentsPositions[dropResult.addedIndex];
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
    const newPositionGuestDepartment = {
      ...guestDepartmentsPositions[dropResult.removedIndex],
      posIndex: newPosition,
    };
    localStorage.setItem(
      "guestDepartmentsPositions",
      JSON.stringify(
        guestDepartmentsPositions.map((dpt) =>
          dpt.departmentId === newPositionGuestDepartment.departmentId
            ? { ...dpt, ...newPositionGuestDepartment }
            : dpt
        )
      )
    );
    dispatch(updateNewPositionGuestDepartment(newPositionGuestDepartment));
  } catch (error) {}
};
const updateNewPositionGuestDepartment = (newPositionGuestDepartment) => ({
  type: Types.UPDATE_GUEST_DEPARTMENT_POSITION,
  payload: newPositionGuestDepartment,
});
const moveGuestBoardAction = (dropResult) => (dispatch, getState) => {
  try {
    const { newIndex, oldIndex, boardId, fromDepartmentId } = dropResult;
    const isMoveForward = newIndex - oldIndex >= 0;
    const guestBoardsPositions = getSortGuestBoardPositions(
      getState(),
      fromDepartmentId
    );
    let newPosition =
      guestBoardsPositions.find((board) => board.boardId === boardId)
        .posIndex || 0;
    const leftBoard = isMoveForward
      ? guestBoardsPositions[newIndex]
      : guestBoardsPositions[newIndex - 1];
    const rightBoard = isMoveForward
      ? guestBoardsPositions[newIndex + 1]
      : guestBoardsPositions[newIndex];

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
    const guestDepartmentsPositions = getSortGuestDepartmentsPositions(
      getState()
    );
    const newGuestDepartmentsPositions = guestDepartmentsPositions.map((dpt) =>
      dpt.departmentId === fromDepartmentId
        ? {
            ...dpt,
            boards: dpt.boards.map((board) =>
              board.boardId === boardId
                ? { ...board, posIndex: newPosition }
                : board
            ),
          }
        : dpt
    );
    localStorage.setItem(
      "guestDepartmentsPositions",
      JSON.stringify(newGuestDepartmentsPositions)
    );
    dispatch(updatePositionGuestBoard(newGuestDepartmentsPositions));
  } catch (error) {
    console.log(error);
  }
};

const updatePositionGuestBoard = (newGuestDepartmentsPositions) => ({
  type: Types.UPDATE_GUEST_BOARD_POSITION,
  payload: {
    newGuestDepartmentsPositions: newGuestDepartmentsPositions,
  },
});

const getTicketsUserAssigned = () => {};

export {
  addInvitedMembersToBoardActive,
  addInvitedMembersToBoardActivePending,
  deleteInvitedMembersFromBoard,
  deleteInvitedMembersFromBoardSuccess,
  fetchBoardsByInvitedUser,
  fetchInvitedMembersOfBoardActive,
  fetchTicketsByBoard,
  getDetailBoardById,
  moveGuestBoardAction,
  moveGuestDepartmentAction,
};

export * from "./boardsFilter.action";
