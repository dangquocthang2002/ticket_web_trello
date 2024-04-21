import { getMe as getMeAPI, postLogin, updateMe } from "api/auth.api";
import { getUsers } from "api/users.api";
import Types from "./users.constant";

const loginPending = () => {
  return {
    type: Types.LOGIN_PENDING,
  };
};

const loginSuccess = (token) => {
  return {
    type: Types.LOGIN_SUCCESS,
    payload: token,
  };
};

const loginError = (error) => {
  return {
    type: Types.LOGIN_ERROR,
    payload: { error },
  };
};
const getUsersSuccess = (users = []) => {
  return {
    type: Types.GET_USERS_SUCCESS,
    payload: users,
  };
};

const getUsersError = (error) => {
  return {
    type: Types.GET_USERS_SUCCESS,
    payload: { error },
  };
};

const getMeSuccess = (user) => {
  return {
    type: Types.GET_ME_SUCCESS,
    payload: user,
  };
};
const login = (username, password) => {
  return (dispatch) => {
    dispatch(loginPending(username, password));
    return postLogin({
      username: username,
      password: password,
    })
      .then((res) => {
        const token = res.data;
        dispatch(loginSuccess(token));
        return token;
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || error.message || error.statusText;
        dispatch(loginError(errorMessage));
      });
  };
};

const fetchUsers = () => async (dispatch) => {
  return await getUsers()
    .then((res) => {
      dispatch(getUsersSuccess(res.data));
    })
    .catch((error) => {
      dispatch(getUsersError(error));
    });
};
const getMe = () => async (dispatch) => {
  try {
    const res = await getMeAPI().then((res) => {
      dispatch(getMeSuccess(res.data));
    });
    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

const updateProfileSuccess = (files) => {
  return {
    type: Types.UPDATE_PROFILE_SUCCESS,
    payload: {
      files,
    },
  };
};

const updateProfile = (files) => async (dispatch) => {
  try {
    var formData = new FormData();
    formData.append("filesUpload", files);

    const res = await updateMe(formData).then((res) => {
      dispatch(updateProfileSuccess(res.data.files));
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};
const logOut = () => (dispatch) => {
  dispatch({
    type: Types.USER_LOGOUT_SUCCESS,
  });
};

const addNewUser = (user) => (dispatch) => {
  dispatch({
    type: Types.ADD_NEW_USER,
    payload: user,
  });
};
export {
  addNewUser,
  fetchUsers,
  getMe,
  logOut,
  login,
  loginError,
  loginPending,
  loginSuccess,
  updateProfile,
};
