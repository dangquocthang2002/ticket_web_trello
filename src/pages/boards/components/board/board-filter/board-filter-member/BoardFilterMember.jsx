import React, { useState } from "react";
import { connect } from "react-redux";
import { useRef } from "react";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { BsPerson, BsChevronDown } from "react-icons/bs";
import {
  filterMemberInBoard,
  removeFilterMemberInBoard,
  filterAllMemberInBoard,
  removeFilterAllMemberInBoard,
  filterNoMemberInTicket,
} from "modules/boards/boards.action";

const BoardFilterMembers = (props) => {
  const {
    departmentsUsers,
    boardActive,
    user,
    filter,
    filterMemberInBoard,
    removeFilterMemberInBoard,
    filterAllMemberInBoard,
    removeFilterAllMemberInBoard,
    filterNoMemberInTicket,
    boardActiveInvitedMembers,
    me,
  } = props;
  const ref = useRef();
  const [showListItems, setShowListItem] = useState(false);
  const checkNoMember = true;
  useOnClickOutside(ref, () => setShowListItem(false));
  const handleCheck = (user) => {
    const isChecked = filter[boardActive._id]?.members?.selectedMember
      ?.map((user) => user._id)
      .includes(user._id);
    if (!isChecked) {
      filterMemberInBoard(boardActive._id, user);
    } else {
      removeFilterMemberInBoard(boardActive._id, user);
    }
  };

  const memberGuests = boardActiveInvitedMembers.filter(
    (u) => u._id !== user._id
  );
  const allMembersActiveInBoard = departmentsUsers[boardActive.department]
    ?.filter((u) => u._id !== user._id)
    ?.concat(memberGuests);

  const handleCheckAll = (allMembersActiveInBoard) => {
    const isCheckedAll = filter[boardActive._id]?.members?.selectedMember?.map(
      (member) => member._id
    );
    if (isCheckedAll?.length > 0) {
      removeFilterAllMemberInBoard(boardActive._id, allMembersActiveInBoard);
    } else {
      filterAllMemberInBoard(boardActive._id, allMembersActiveInBoard);
    }
  };
  const handleCheckNoMember = () => {
    if (filter[boardActive._id]?.members?.isNoMember) {
      filterNoMemberInTicket(
        boardActive._id,
        !filter[boardActive._id]?.members?.isNoMember
      );
    } else {
      filterNoMemberInTicket(boardActive._id, checkNoMember);
    }
  };
  return (
    <div className="board-filter_content_section_item">
      <h3>Members</h3>
      <ul>
        <li>
          <input
            type="checkbox"
            id="noMember"
            checked={
              filter[boardActive._id]?.members?.isNoMember ? true : false
            }
            onChange={() => handleCheckNoMember()}
          />
          <label htmlFor="noMember">
            <div className="board-filter_content_section_item-wrapper">
              <span className="board-filter_content_section_item_icon">
                <BsPerson />
              </span>
              <span className="board-filter_content_section_item_content">
                No members
              </span>
            </div>
          </label>
        </li>
        <li key={user._id}>
          <input
            type="checkbox"
            id={user._id}
            checked={
              filter[boardActive._id]?.members?.selectedMember
                ?.map((member) => member._id)
                .includes(user._id)
                ? true
                : false
            }
            onChange={() => handleCheck(user)}
          />
          <label htmlFor={user._id}>
            <div className="board-filter_content_section_item-wrapper">
              <div className="board-filter_content_section_item_img">
                <img
                  src={
                    me.avatar?.path
                      ? `${process.env.REACT_APP_API_URL}/${me.avatar?.path}?w=50&h=50`
                      : "/assets/no-avatar-user.png"
                  }
                  alt=""
                />
              </div>
              <span className="board-filter_content_section_item_content">
                Card assigned to me
              </span>
            </div>
          </label>
        </li>
        <li style={{ paddingBottom: 4 }}>
          <input
            type="checkbox"
            checked={
              filter[boardActive._id]?.members?.selectedMember?.map(
                (member) => member._id
              ).length > 0
                ? true
                : false
            }
            onChange={() => handleCheckAll(allMembersActiveInBoard)}
          />
          <span className="select-items">
            <div className="board-filter_content_section_item-wrapper">
              <button
                className="board-filter_content_section_item_dropdown"
                placeholder="Select Members"
                onClick={() => setShowListItem(!showListItems)}
              >
                {filter[boardActive._id]?.members?.selectedMember?.length || 0}{" "}
                member selected
                <span className="board-filter_content_section_item_dropdown_icon">
                  <BsChevronDown />
                </span>
              </button>
            </div>
          </span>
        </li>
        {showListItems && (
          <div className="list-items" ref={ref}>
            <ul>
              {allMembersActiveInBoard.map((u) => (
                <li key={u._id}>
                  <input
                    type="checkbox"
                    id={u._id}
                    checked={
                      filter[boardActive._id]?.members?.selectedMember
                        ?.map((member) => member._id)
                        .includes(u._id)
                        ? true
                        : false
                    }
                    onChange={() => handleCheck(u)}
                  />
                  <label htmlFor={u._id}>
                    <div className="board-filter_content_section_item-wrapper">
                      <div className="board-filter_content_section_item_img">
                        <img
                          src={
                            u.avatar?.path
                              ? `${process.env.REACT_APP_API_URL}/${u.avatar?.path}?w=50&h=50`
                              : "/assets/no-avatar-user.png"
                          }
                          alt=""
                        />
                      </div>
                      <span className="board-filter_content_section_item_content">
                        {u.name}
                      </span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  departmentsUsers: state.departments.departmentsUsers,
  boardActive: state.boards.boardActive,
  boardActiveInvitedMembers: state.boards.boardActiveInvitedMembers,
  user: state.users.user,
  me: state.users.me,
  filter: state.boards.filter,
});

const mapDispatchToProps = {
  filterMemberInBoard,
  removeFilterMemberInBoard,
  filterAllMemberInBoard,
  removeFilterAllMemberInBoard,
  filterNoMemberInTicket,
};
export default connect(mapStateToProps, mapDispatchToProps)(BoardFilterMembers);
