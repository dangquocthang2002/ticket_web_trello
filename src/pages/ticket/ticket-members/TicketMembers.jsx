import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchInvitedMembersOfBoardActive } from "modules/boards/boards.action";
import { useRef } from "react";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { GoCheck } from "react-icons/go";
import {
  addUserToTicket,
  deleteUsersFromTicket,
} from "modules/tickets/tickets.action";
import { BsXLg } from "react-icons/bs";
import { toastError } from "utils/toastHelper";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const TicketMembers = (props) => {
  const {
    userLoggedIn,
    setOpenMember,
    departmentsUsers,
    boardActiveInvitedMembers,
    boardActive,
    fetchInvitedMembersOfBoardActive,
    isAdmin,
    ticketsUsers,
    addUserToTicket,
    deleteUsersFromTicket,
    boardViewOnly,
  } = props;
  const { id, ticketId } = useParams();
  const [showToastOneTime, setShowToastOneTime] = useState();

  const ref = useRef();

  const checkUserInTicket = (id) => {
    return ticketsUsers[ticketId]
      ? ticketsUsers[ticketId].map((user) => user._id).includes(id)
      : false;
  };
  const handleCheck = (user) => {
    if (boardViewOnly) {
      if (showToastOneTime !== "ticketMembers") {
        toastError("Just View Board Only");
        setShowToastOneTime(() => "ticketMembers");
      }
      return;
    }
    const isChecked = checkUserInTicket(user._id);
    if (!isChecked) {
      addUserToTicket(ticketId, user);
    } else {
      deleteUsersFromTicket(ticketId, user);
    }
  };

  const isAllowAssignMembers = Boolean(
    isAdmin ||
      departmentsUsers[boardActive.department].find(
        (user) => user._id === userLoggedIn._id
      ) ||
      boardActiveInvitedMembers.find((user) => user._id === userLoggedIn._id)
  );

  useOnClickOutside(ref, () => setOpenMember(false));
  useEffect(() => {
    if (boardActiveInvitedMembers.length === 0) {
      fetchInvitedMembersOfBoardActive(id);
    }
  }, []);
  return (
    <div className="ticket-member">
      <div ref={ref} className="ticket-member-wrapper">
        <div className="ticket-member-header">
          <span>Members</span>
          <button
            className="ticket-member-header-close-btn"
            onClick={() => setOpenMember(false)}
          >
            <BsXLg size={11} />
          </button>
        </div>
        <div className="ticket-member_content">
          <div className="ticket-member_content_member">
            <ul>
              <h6>Department's Members</h6>
              {departmentsUsers[boardActive.department]?.map((user) => (
                <li key={user._id}>
                  <button
                    onClick={() =>
                      isAllowAssignMembers ? handleCheck(user) : null
                    }
                  >
                    <img
                      src={
                        user.avatar?.path
                          ? `${process.env.REACT_APP_API_URL}/${user.avatar?.path}?w=50&h=50`
                          : "/assets/no-avatar-user.png"
                      }
                      alt=""
                    />
                    <span>{user.name}</span>
                    <span
                      className="member_check"
                      style={{
                        display: checkUserInTicket(user._id) ? "block" : "none",
                      }}
                    >
                      <GoCheck />
                    </span>
                  </button>
                </li>
              ))}
              <h6>Board's Guests</h6>
              {boardActiveInvitedMembers?.map((user) => (
                <li key={user._id}>
                  <button
                    onClick={() =>
                      isAllowAssignMembers ? handleCheck(user) : null
                    }
                  >
                    <img
                      src={
                        user.avatar?.path
                          ? `${process.env.REACT_APP_API_URL}/${user.avatar?.path}?w=50&h=50`
                          : "/assets/no-avatar-user.png"
                      }
                      alt=""
                    />
                    <span>{user.name}</span>
                    <span
                      className="member_check"
                      style={{
                        display: checkUserInTicket(user._id) ? "block" : "none",
                      }}
                    >
                      <GoCheck />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userLoggedIn: state.users.user,
  departmentsUsers: state.departments.departmentsUsers,
  boardActive: state.boards.boardActive,
  boardActiveInvitedMembers: state.boards.boardActiveInvitedMembers,
  isAdmin: state.users.isAdmin,
  ticketsUsers: state.tickets.ticketsUsers,
  boardViewOnly: boardViewOnlySelector(state),
});

const mapDispatchToProps = {
  fetchInvitedMembersOfBoardActive,
  addUserToTicket,
  deleteUsersFromTicket,
};
export default connect(mapStateToProps, mapDispatchToProps)(TicketMembers);
