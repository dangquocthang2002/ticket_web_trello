import React from "react";
import { connect } from "react-redux";
import BoardDetail from "../boards/components/BoardDetail";
import { ReactSortable } from "react-sortablejs";
import { moveGuestBoardAction } from "modules/boards/boards.action";
import { getSortGuestBoard } from "modules/boards/boards.selectors";
function GuestDepartment(props) {
  const { isAdmin, department, guestBoards, moveGuestBoardAction } = props;
  const onDropGuestBoard = (dropResult) => {
    moveGuestBoardAction({
      newIndex: dropResult.newIndex,
      oldIndex: dropResult.oldIndex,
      boardId: dropResult.item.dataset.id,
      fromDepartmentId: dropResult.from.className,
      toDepartmentId: dropResult.to.className,
    });
  };
  const boards = guestBoards(department?._id).filter((board) =>
    board ? true : false
  );
  return (
    <>
      <div className="department-container">
        <div className="department-container-label">
          <img
            className="navbar-menu_logo_img"
            src={"/assets/khoawin-single.png"}
            alt=""
          />
          <input
            defaultValue={department.name}
            type="text"
            placeholder="Enter Department Name"
            readOnly={!isAdmin}
          ></input>
        </div>
        <div className="container">
          <div className="list-boards-wrapper">
            {/* <ul className="list-boards"> */}
            <ReactSortable
              className={department?._id}
              key={department?._id}
              group={`guest-boards-${department?._id}`}
              onEnd={onDropGuestBoard}
              multiDrag
              animation={200}
              delayOnTouchStart={true}
              delay={0.2}
              chosenClass="sortable-chosen"
              setList={() => guestBoards(department?._id)}
              list={boards}
              tag="ul"
            >
              {boards?.map((board) => (
                <li
                  className="guest-board-item"
                  key={board._id ? board._id : board.id}
                >
                  <BoardDetail invitedBoard={true} board={board} />
                </li>
              ))}
            </ReactSortable>

            {/* </ul> */}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,
  guestBoards: (departmentId) => getSortGuestBoard(state, departmentId),
});
const mapDispatchToProps = {
  moveGuestBoardAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(GuestDepartment);
