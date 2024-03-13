import withRouter from "hocs/withRouter";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import {
  getDetailBoardById,
  deleteInvitedMembersFromBoard,
} from "modules/boards/boards.action";
import { fetchUsersDepartment } from "modules/departments/departments.action";
import { fetchUsers } from "modules/users/users.action";
import { deleteUsersFromDepartment } from "modules/departments/departments.action";
import {
  fetchInvitedMembersOfBoardActive,
  addInvitedMembersToBoardActive,
} from "modules/boards/boards.action";
import { GrClose } from "react-icons/gr";

function UsersBoard(props) {
  const {
    isAdmin,
    boardActive,
    currentUser,
    departmentsUsers,
    navigate,
    params,
    boardActiveInvitedMembers,
    fetchInvitedMembersOfBoardActive,
    addInvitedMembersToBoardActive,
    fetchUsers,
    listUsers,
    deleteUsersFromDepartment,
    deleteInvitedMembersFromBoard,
  } = props;

  const { id } = params;
  const ref = useRef();
  const [selectedValue, setSelectedValue] = useState(null);
  const [error, setError] = useState(null);
  const onSelectionChange = (selectedOption) => {
    setSelectedValue(
      listUsers.filter((user) => user._id === selectedOption.value)[0]
    );
  };
  const handleOnClickAddInvitedMembers = () => {
    if (!selectedValue) {
      setError("User invalid");
      return;
    }
    if (
      departmentsUsers[boardActive.department]
        ?.map((user) => user._id)
        .includes(selectedValue._id)
    ) {
      setError("User has been members of department");
      return;
    }
    if (
      boardActiveInvitedMembers
        ?.map((user) => user._id)
        .includes(selectedValue._id)
    ) {
      setError("User has been invited to Board");
      return;
    }
    addInvitedMembersToBoardActive(id, selectedValue);
    setError(null);
  };
  const handleOnclickDeleteMember = (check, user) => {
    if (check === "member") {
      deleteUsersFromDepartment(boardActive.department, [user]);
    } else {
      deleteInvitedMembersFromBoard(id, user);
    }
  };
  useOnClickOutside(ref, () => navigate(`/boards/${id}`));
  useEffect(() => {
    if (boardActiveInvitedMembers.length === 0)
      fetchInvitedMembersOfBoardActive(id);
    if (isAdmin) {
      fetchUsers();
    }
  }, []);
  return (
    <div className="users-board">
      <div ref={ref} className="users-board_wrapper">
        <div className="users-board_header">
          <h5>Assign Member</h5>
          <button
            className="header-close-btn"
            onClick={() => navigate(`/boards/${id}`)}
          >
            <GrClose size={18} />
          </button>
        </div>
        {isAdmin && (
          <div className="users-board_invite">
            <div className="users-board_invite_wrapper">
              <div className="input-container">
                <Select
                  className={"selectBox"}
                  options={listUsers.map((user) => ({
                    value: user._id,
                    label: user.name,
                  }))}
                  onChange={onSelectionChange}
                  defaultValue={selectedValue}
                />
              </div>
              <button
                className="p-btn btn-add-member"
                onClick={handleOnClickAddInvitedMembers}
              >
                Share
              </button>
            </div>
          </div>
        )}
        <div className="users-board_error">
          <span>{error}</span>
        </div>
        <div className="users-board_content">
          <div className="users-board_content_member">
            <ul>
              <h6>TonyTech Members</h6>
              {departmentsUsers[boardActive.department]?.map((user) => (
                <li key={user._id}>
                  <div>
                    <img src="/assets/tonytech-single.png" alt="" />
                    <span className="member">
                      {user.name}
                      {"   "}
                      {user._id === currentUser._id ? "  (active)" : ""}
                    </span>
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      className="btn btn-setting"
                      onClick={() => handleOnclickDeleteMember("member", user)}
                    >
                      <svg
                        stroke="white"
                        fill="white"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="18"
                        width="18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                        <path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </li>
              ))}
              <h6>TonyTech Guests</h6>
              {boardActiveInvitedMembers
                ?.filter(
                  (user) =>
                    !departmentsUsers[boardActive.department]
                      ?.map((user) => user._id)
                      .includes(user._id)
                )
                .map((user) => (
                  <li key={user._id}>
                    <div>
                      <img src="/assets/tonytech-single.png" alt="" />
                      <span className="invitedMember">
                        {user.name} {"   "}
                        {user._id === currentUser._id ? "  (active)" : ""}
                      </span>
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn-setting"
                        onClick={() =>
                          handleOnclickDeleteMember("invitedMember", user)
                        }
                      >
                        <svg
                          stroke="white"
                          fill="white"
                          strokeWidth="0"
                          viewBox="0 0 24 24"
                          height="18"
                          width="18"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0V0z"></path>
                          <path d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path>
                        </svg>
                        <span>Delete</span>
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,
  listUsers: state.users.listUsers,
  currentUser: state.users.user,
  departmentsUsers: state.departments.departmentsUsers,
  boardActive: state.boards.boardActive,
  boardActiveInvitedMembers: state.boards.boardActiveInvitedMembers,
});
const mapDispatchToProps = {
  getDetailBoardById,
  fetchUsers,
  fetchUsersDepartment,
  fetchInvitedMembersOfBoardActive,
  addInvitedMembersToBoardActive,
  deleteUsersFromDepartment,
  deleteInvitedMembersFromBoard,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UsersBoard));
