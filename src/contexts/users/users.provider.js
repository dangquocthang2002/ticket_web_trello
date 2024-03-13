import { apiDepartment, apiUser } from "../../api";
import { useContext, useState } from "react";
import { createContext } from "react";

export const UsersContext = createContext();

export const useUsers = () => {
  const state = useContext(UsersContext);
  return state;
};

function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [usersDepartment, setUsersDepartment] = useState({});
  const getAllUsersAPI = () => {
    apiUser.getUsers().then((res) => {
      setUsers(res.data);
    });
  };

  const deleteUsersFromDepartmentAPI = (departmentId, userId) => {
    const oldUsers = {
      users: [userId],
    };
    setUsersDepartment((prev) => ({
      ...prev,
      [departmentId]: prev[departmentId].filter((user) => user !== userId),
    }));
    return apiDepartment.deleteUsersFromDepartment(departmentId, oldUsers);
  };

  const getUsersInDepartmentAPI = (departmentId) => {
    apiDepartment
      .getUsersDepartment(departmentId)
      .then((res) => {
        setUsersDepartment((prev) => ({
          ...prev,
          [departmentId]: [...res.data.users.map((user) => user.userId._id)],
        }));
      })
      .catch((err) =>
        setUsersDepartment((prev) => ({ ...prev, [departmentId]: [] }))
      );
  };

  const contextValue = {
    users,
    usersDepartment,
    getAllUsersAPI,
    deleteUsersFromDepartmentAPI,
    getUsersInDepartmentAPI,
  };

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;
