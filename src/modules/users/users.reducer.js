import jwt_decode from "jwt-decode";
import { getToken, saveToken } from "utils/LocalStorageHandle";
import Types from "./users.constant";

const checkRoleUser = () => {
  const token = getToken("ticket.token");
  if (!token) {
    return false;
  }
  return jwt_decode(token).data.role === "ADMIN" ? true : false;
};

const initialState = {
  isLoggedIn: getToken("ticket.token") ? true : false,
  isloading: false,
  error: null,
  user: getToken("ticket.token")
    ? jwt_decode(getToken("ticket.token")).data
    : {},
  isAdmin: checkRoleUser(),
  listUsers: [],
  me: {},
};

// Reducers
const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN_PENDING:
      return {
        ...state,
        isLoggedIn: false,
        isloading: true,
      };

    case Types.LOGIN_SUCCESS:
      const { data } = action.payload;
      const token = data.token;
      const users = jwt_decode(token);
      saveToken(token);

      return {
        ...state,
        isloading: false,
        error: null,
        user: users.data,
        isLoggedIn: true,
      };

    case Types.LOGIN_ERROR:
      const { error } = action.payload;
      return {
        ...state,
        isloading: false,
        error: error,
        isLoggedIn: false,
        user: {},
      };
    case Types.GET_USERS_SUCCESS:
      const allUsers = action.payload;
      return {
        ...state,
        listUsers: allUsers,
      };
    case Types.GET_USERS_ERROR:
      const { errorGetAllUsers } = action.payload;
      return {
        ...state,
        error: errorGetAllUsers,
      };

    case Types.GET_ME_SUCCESS:
      return {
        ...state,
        me: action.payload,
      };

    case Types.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        me: {
          ...state.me,
          avatar: action.payload.files,
        },
      };
    case Types.USER_LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case Types.ADD_NEW_USER:
      return {
        ...state,
        listUsers: [...state.listUsers, action.payload],
      };
    default:
      return state;
  }
};

export default usersReducer;
