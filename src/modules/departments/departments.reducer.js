import Types from "./departments.constant";

const initialState = {
  isLoading: false,
  listDepartments: [],
  departmentsUsers: {},
  departmentsBoards: {},
  selectedDepartment: {},
  departmentsPositions: [],
};

const departmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_SELECTED_DEPARTMENT_PENDING:
      return {
        ...state,
        isLoading: true,
      };
    case Types.GET_SELECTED_DEPARTMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedDepartment: action.payload.department,
      };

    case Types.GET_DEPARTMENT_SUCCESS:
      return {
        ...state,
        listDepartments: action.payload.departments,
        departmentsPositions: action.payload.departmentsPositions,
      };
    // case Types.SET_INIT_DEPARTMENT_POSITION:
    //   return {
    //     ...state,
    //     departmentsPositions: action.payload,
    //   };

    case Types.ADD_DEPARTMENT_SUCCESS:
      return {
        ...state,
        listDepartments: state.listDepartments.map((department) =>
          action.payload.id === department.id ? action.payload : department
        ),
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload._id]: [],
        },
        departmentsPositions: state.departmentsPositions.map((dpt) =>
          dpt.departmentId === action.payload.id
            ? { ...dpt, departmentId: action.payload._id }
            : dpt
        ),
      };
    case Types.ADD_DEPARTMENT_PENDING:
      return {
        ...state,
        listDepartments: [
          ...state.listDepartments,
          action.payload.newDepartment,
        ],
        departmentsPositions: action.payload.newDepartmentPositions,
      };
    case Types.DELETE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        listDepartments: state.listDepartments.filter(
          (department) => department._id !== action.payload
        ),
      };
    case Types.UPDATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        listDepartments: state.listDepartments.map((department) =>
          department._id === action.payload._id
            ? { ...department, ...action.payload }
            : department
        ),
      };
    case Types.GET_USERS_IN_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departmentsUsers: {
          ...state.departmentsUsers,
          [action.payload.departmentId]: action.payload.users,
        },
      };
    case Types.ADD_USERS_TO_DEPARTMENT_SUCCESS:
      const existUsers = state.departmentsUsers[action.payload.departmentId];
      return {
        ...state,
        departmentsUsers: {
          ...state.departmentsUsers,
          [action.payload.departmentId]: existUsers.find(
            (item) => item._id === action.payload.user._id
          )
            ? existUsers
            : [...existUsers, action.payload.user],
        },
      };
    case Types.DELETE_USERS_FROM_DEPARTMENT_SUCCESS:
      return {
        ...state,
        departmentsUsers: {
          ...state.departmentsUsers,
          [action.payload.departmentId]: state.departmentsUsers[
            action.payload.departmentId
          ].filter((user) => user._id !== action.payload.user._id),
        },
      };
    case Types.GET_BOARD_BY_DEPARTMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload.departmentId]: action.payload.boards,
        },
        departmentsPositions: state.departmentsPositions.map((dpt) => {
          if (dpt.departmentId === action.payload.departmentId) {
            return { ...dpt, boards: action.payload.boardPositions };
          }
          return dpt;
        }),
      };

    case Types.ADD_BOARD_TO_DEPARTMENT_PENDING:
      return {
        ...state,
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload.departmentId]: [
            ...state.departmentsBoards[action.payload.departmentId],
            action.payload.newBoard,
          ],
        },
        departmentsPositions: state.departmentsPositions.map((dpt) => {
          if (dpt.departmentId === action.payload.departmentId) {
            return {
              ...dpt,
              boards: [
                ...dpt.boards,
                {
                  boardId: action.payload.newBoard.id,
                  posIndex:
                    (dpt.boards.sort((a, b) => a.posIndex - b.posIndex)[
                      dpt.boards.length - 1
                    ]?.posIndex || 0) + 1,
                },
              ],
            };
          }
          return dpt;
        }),
      };

    case Types.ADD_BOARD_TO_DEPARTMENT_SUCCESS:
      const newDepartmentsPositions = state.departmentsPositions.map((dpt) => {
        if (dpt.departmentId === action.payload.departmentId) {
          return {
            ...dpt,
            boards: dpt.boards.map((board) =>
              board.boardId === action.payload.newBoardAPI.id
                ? {
                    ...board,
                    boardId: action.payload.newBoardAPI?._id,
                  }
                : board
            ),
          };
        }
        return dpt;
      });
      return {
        ...state,
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload.departmentId]: state.departmentsBoards[
            action.payload.departmentId
          ].map((board) =>
            board.id === action.payload.newBoardAPI.id
              ? action.payload.newBoardAPI
              : board
          ),
        },
        departmentsPositions: newDepartmentsPositions,
      };
    case Types.UPDATE_BOARD_PENDING:
      return {
        ...state,
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload.departmentId]: state.departmentsBoards[
            action.payload.departmentId
          ].map((board) => {
            if (board._id !== action.payload.currentBoard._id) {
              return board;
            }
            return { ...board, ...action.payload.currentBoard.content };
          }),
        },
      };

    case Types.UPDATE_BOARD_SUCCESS:
      return {
        ...state,
      };
    case Types.GET_DEPARTMENTS_BY_CURRENT_USER_SUCCESS:
      return {
        ...state,
        listDepartments: action.payload.listDepartments,
        departmentsPositions: action.payload.departmentsPositions,
      };
    case Types.ARCHIVE_BOARD_SUCCESS:
      return {
        ...state,
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload.board.department]: state.departmentsBoards[
            action.payload.board.department
          ].filter((board) => board._id !== action.payload.board._id),
        },
        departmentsPositions: state.departmentsPositions.map((dpt) => {
          if (dpt.departmentId === action.payload.board.department) {
            return {
              ...dpt,
              boards: dpt.boards.filter(
                (board) => board.boardId !== action.payload.board._id
              ),
            };
          }
          return dpt;
        }),
      };
    case Types.ARCHIVE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        listDepartments: state.listDepartments.filter(
          (department) => department._id !== action.payload.department._id
        ),
        departmentsPositions: state.departmentsPositions.filter(
          (dpt) => dpt.departmentId !== action.payload.department._id
        ),
      };

    case Types.UPDATE_DEPARTMENT_POSITION:
      return {
        ...state,
        departmentsPositions: state.departmentsPositions.map((dpt) =>
          dpt.departmentId === action.payload.departmentId
            ? { ...dpt, ...action.payload }
            : dpt
        ),
      };
    case Types.UPDATE_BOARDS_POSITION_OF_DEPARTMENT:
      return {
        ...state,
        departmentsPositions: action.payload.newDepartmentsPosition,
      };
    case Types.UPDATE_DEPARTMENT_ID_OF_BOARD:
      return {
        ...state,
        departmentsBoards: {
          ...state.departmentsBoards,
          [action.payload.fromDepartmentId]: state.departmentsBoards[
            action.payload.fromDepartmentId
          ].filter((board) => board._id !== action.payload.newBoard._id),
          [action.payload.toDepartmentId]: [
            ...state.departmentsBoards[action.payload.toDepartmentId],
            action.payload.newBoard,
          ],
        },
      };
    default:
      return state;
  }
};

export default departmentsReducer;
