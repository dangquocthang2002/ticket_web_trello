import Types from "./boards.constant";

const initialState = {
  boardActive: {},
  invitedUserBoards: [],
  guestUserDepartments: [],
  guestDepartmentsPositions: [],
  boardActiveInvitedMembers: [],
  boards: [],
  filter: {},
};

const boardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_DATA_BOARD: {
      return {
        ...state,
        boards: action.payload.data,
      };
    }

    case Types.GET_DETAIL_BOARD_SUCCESS:
      return {
        ...state,
        boardActive: action.payload,
      };
    case Types.GET_BOARDS_BY_INVITED_USER_SUCCESS:
      return {
        ...state,
        invitedUserBoards: [...action.payload.invitedUserBoards],
        guestUserDepartments: [...action.payload.guestUserDepartments],
        guestDepartmentsPositions: action.payload.guestDepartmentsPositions,
      };
    case Types.GET_INVITED_MEMBERS_BOARD_ACTIVE_SUCCESS:
      return {
        ...state,
        boardActiveInvitedMembers: [...action.payload],
      };
    case Types.ADD_INVITED_MEMBERS_BOARD_ACTIVE_PENDING:
      return {
        ...state,
        boardActiveInvitedMembers: [
          ...state.boardActiveInvitedMembers,
          action.payload,
        ],
      };
    case Types.ADD_INVITED_MEMBERS_BOARD_ACTIVE_SUCCESS:
      return {
        ...state,
      };
    case Types.DELETE_INVITED_MEMBERS_BOARD_ACTIVE_SUCCESS:
      return {
        ...state,
        boardActiveInvitedMembers: state.boardActiveInvitedMembers.filter(
          (user) => user._id !== action.payload
        ),
      };
    case Types.FILTER_MEMBER_IN_BOARD_SUCCESS:
      if (state.filter[action.payload.boardId]?.members) {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              members: {
                selectedMember: [
                  ...state.filter[action.payload.boardId]?.members
                    .selectedMember,
                  action.payload.user,
                ],
              },
            },
          },
        };
      } else {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              members: {
                selectedMember: [action.payload.user],
              },
            },
          },
        };
      }
    case Types.FILTER_ALL_MEMBER_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            members: {
              selectedMember: action.payload.user,
            },
          },
        },
      };
    case Types.REMOVE_FILTER_ALL_MEMBER_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            members: {
              selectedMember: [],
            },
          },
        },
      };
    case Types.REMOVE_FILTER_MEMBER_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            members: {
              selectedMember: state.filter[
                action.payload.boardId
              ]?.members?.selectedMember.filter(
                (member) => member._id !== action.payload.user._id
              ),
            },
          },
        },
      };
    case Types.FILTER_LABEL_IN_BOARD_SUCCESS:
      if (state.filter[action.payload.boardId]?.labels) {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              labels: {
                selectedLabel: [
                  ...state.filter[action.payload.boardId]?.labels.selectedLabel,
                  action.payload.label,
                ],
              },
            },
          },
        };
      } else {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              labels: {
                selectedLabel: [action.payload.label],
              },
            },
          },
        };
      }
    case Types.REMOVE_FILTER_LABEL_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            labels: {
              selectedLabel: state.filter[
                action.payload.boardId
              ]?.labels?.selectedLabel.filter(
                (label) => label._id !== action.payload.label._id
              ),
            },
          },
        },
      };

    case Types.FILTER_EPIC_IN_BOARD_SUCCESS:
      if (state.filter[action.payload.boardId]?.epics) {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              epics: {
                selectedEpic: [
                  ...state.filter[action.payload.boardId]?.epics.selectedEpic,
                  action.payload.epic,
                ],
              },
            },
          },
        };
      } else {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              epics: {
                selectedEpic: [action.payload.epic],
              },
            },
          },
        };
      }
    case Types.REMOVE_FILTER_EPIC_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            epics: {
              selectedEpic: state.filter[
                action.payload.boardId
              ]?.epics?.selectedEpic.filter(
                (epic) => epic._id !== action.payload.epic._id
              ),
            },
          },
        },
      };
    case Types.FILTER_TICKET_IN_BOARD_BY_TITLE_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            ticketTitle: action.payload.name,
          },
        },
      };
    case Types.FILTER_NO_MEMBER_IN_TICKET_SUCCESS:
      if (state.filter[action.payload.boardId]?.members) {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              members: {
                isNoMember: action.payload.check,
                selectedMember: [],
              },
            },
          },
        };
      } else {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              members: {
                isNoMember: action.payload.check,
                selectedMember: [],
              },
            },
          },
        };
      }
    case Types.FILTER_NO_LABEL_IN_TICKET_SUCCESS:
      if (state.filter[action.payload.boardId]?.labels) {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              labels: {
                isNoLabel: action.payload.check,
                selectedLabel: [],
              },
            },
          },
        };
      } else {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              labels: {
                isNoLabel: action.payload.check,
                selectedLabel: [],
              },
            },
          },
        };
      }
    case Types.FILTER_NO_EPIC_IN_TICKET_SUCCESS:
      if (state.filter[action.payload.boardId]?.epics) {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              epics: {
                isNoEpic: action.payload.check,
                selectedEpic: [],
              },
            },
          },
        };
      } else {
        return {
          ...state,
          filter: {
            ...state.filter,
            [action.payload.boardId]: {
              ...state.filter[action.payload.boardId],
              epics: {
                isNoEpic: action.payload.check,
                selectedEpic: [],
              },
            },
          },
        };
      }
    case Types.FILTER_ALL_LABEL_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            labels: {
              selectedLabel: action.payload.labels,
            },
          },
        },
      };
    case Types.REMOVE_FILTER_ALL_LABEL_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            labels: {
              selectedLabel: [],
            },
          },
        },
      };
    case Types.FILTER_ALL_EPIC_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            epics: {
              selectedEpic: action.payload.epics,
            },
          },
        },
      };
    case Types.REMOVE_FILTER_ALL_EPIC_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {
            ...state.filter[action.payload.boardId],
            epics: {
              selectedEpic: [],
            },
          },
        },
      };
    case Types.CLEAR_FILTER_IN_BOARD_SUCCESS:
      return {
        ...state,
        filter: {
          ...state.filter,
          [action.payload.boardId]: {},
        },
      };

    case Types.UPDATE_GUEST_DEPARTMENT_POSITION:
      return {
        ...state,
        guestDepartmentsPositions: state.guestDepartmentsPositions.map((dpt) =>
          dpt.departmentId === action.payload.departmentId
            ? { ...dpt, ...action.payload }
            : dpt
        ),
      };
    case Types.UPDATE_GUEST_BOARD_POSITION:
      return {
        ...state,
        guestDepartmentsPositions: action.payload.newGuestDepartmentsPositions,
      };
    default:
      return state;
  }
};

export default boardsReducer;
