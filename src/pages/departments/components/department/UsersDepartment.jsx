import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { fetchUsers } from "modules/users/users.action";
import {
  addUsersToDepartment,
  deleteUsersFromDepartment,
} from "modules/departments/departments.action";
function UsersDepartment(props) {
  const {
    department_Id,
    setOpenPopup,
    departmentsUsers,
    fetchUsers,
    users,
    addUsersToDepartment,
    deleteUsersFromDepartment,
    isAdmin,
  } = props;
  const [count, setCount] = useState(0);
  const ref = useRef();

  const usersIsAddAll =
    departmentsUsers[department_Id]?.length === users?.length;

  const handleCheck = (user) => {
    const isChecked = departmentsUsers[department_Id]
      ?.map((user) => user._id)
      .includes(user._id);
    setCount((prev) => prev + 1);
    if (!isChecked) {
      addUsersToDepartment(department_Id, [user]).then(() => {
        setCount((prev) => prev - 1);
      });
    } else {
      deleteUsersFromDepartment(department_Id, [user]).then(() => {
        setCount((prev) => prev - 1);
      });
    }
  };

  const addAllUsersToDepartment = async () => {
    setCount((prev) => prev + 1);
    if (usersIsAddAll) {
      // remove all
      await deleteUsersFromDepartment(department_Id, users);
    } else {
      // select all
      await addUsersToDepartment(department_Id, users)
    }
    setCount((prev) => prev - 1);
  };

  useOnClickOutside(ref, () => setOpenPopup(false));

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, []);

  return (
    <>
      <div ref={ref} className="popup-over">
        {count > 0 && (
          <div
            id="popup-over-spinner-border"
            className="spinner-border"
            role="status"
          ></div>
        )}
        {isAdmin ? (
          <div className="select-all-users">
            <input
              type="checkbox"
              checked={usersIsAddAll}
              onChange={addAllUsersToDepartment}
            />
            <span>Select all</span>
          </div>
        ) : (
          <></>
        )}
        <ul>
          {users?.map((user) => (
            <li key={user._id}>
              <input
                type="checkbox"
                checked={
                  departmentsUsers[department_Id]
                    ? departmentsUsers[department_Id]
                        .map((user) => user._id)
                        .includes(user._id)
                    : false
                }
                onChange={() => (isAdmin ? handleCheck(user) : false)}
              />{" "}
              <span>{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  users: state.users.listUsers,
  isAdmin: state.users.isAdmin,

  departmentsUsers: state.departments.departmentsUsers,
});

const mapDispatchToProps = {
  fetchUsers,
  addUsersToDepartment,
  deleteUsersFromDepartment,
};
export default connect(mapStateToProps, mapDispatchToProps)(UsersDepartment);
