import { useEffect, useState } from "react";
import BoardDetail from "./components/BoardDetail";
import AddBoard from "./components/AddBoard";
import {
  fetchBoardsByDepartment,
  addBoardToDepartment,
  updateBoard,
  archiveBoard,
  moveBoardAction,
} from "modules/departments/departments.action";

import { connect } from "react-redux";
import { getSortBoardsByDepartmentId } from "modules/departments/departments.selectors";
import { ReactSortable } from "react-sortablejs";

const limitBoard = 8;

function ListBoards(props) {
  const {
    checkIdDepartment,
    department,
    fetchBoardsByDepartment,
    departmentsBoards,
    addBoardToDepartment,
    updateBoard,
    archiveBoard,
    moveBoardAction,
    isAdmin,
  } = props;

  const [count, setCount] = useState(0);
  const addBoard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (department) {
      setCount((prev) => prev + 1);

      addBoardToDepartment(department).then(() => {
        setCount((prev) => prev - 1);
      });
    }
  };

  const editBoardTitle = (currentBoard) => {
    if (currentBoard._id) {
      setCount((prev) => prev + 1);
      updateBoard(department, currentBoard).then(() => {
        setCount((prev) => prev - 1);
      });
    }
  };

  const deleteBoard = (board) => {
    if (board) {
      const isConfirmed = window.confirm("Are you sure?");
      if (isConfirmed) {
        setCount((prev) => prev + 1);
        archiveBoard(board).then(() => setCount((prev) => prev - 1));
      }
    }
  };
  const onDropBoard = (dropResult) => {
    moveBoardAction({
      newIndex: dropResult.newIndex,
      oldIndex: dropResult.oldIndex,
      boardId: dropResult.item.dataset.id,
      fromDepartmentId: dropResult.from.className,
      toDepartmentId: dropResult.to.className,
    });
  };
  useEffect(() => {
    if (!checkIdDepartment) {
      fetchBoardsByDepartment(department);
    }
  }, []);
  return (
    <div className="container">
      <div className="list-boards-wrapper">
        {/* <div className="list-boards"> */}
        {count > 0 && <div className="spinner-border" role="status"></div>}
        <ReactSortable
          className={department}
          key={department}
          group={`${isAdmin ? "boards" : `boards-${department}`}`}
          onEnd={onDropBoard}
          multiDrag
          animation={200}
          delayOnTouchStart={true}
          delay={2}
          chosenClass="sortable-chosen"
          ghostClass="sortable-ghost"
          filter=".ignore-elements"
          preventOnFilter={false}
          // dragClass="sortable-drag"
          setList={() => departmentsBoards(department)}
          list={departmentsBoards(department).filter((board) =>
            board ? true : false
          )}
          tag="ul"
        >
          {departmentsBoards(department)
            .filter((board) => (board ? true : false))
            ?.map((board, index) => (
              <li className="board-item" key={board?._id ? board?._id : index}>
                <BoardDetail
                  board={board}
                  editBoardTitle={editBoardTitle}
                  deleteBoard={deleteBoard}
                />
              </li>
            ))}
          <AddBoard
            department={department}
            countBoardCanAdd={
              limitBoard -
              (departmentsBoards(department)
                ? departmentsBoards(department).length
                : 0)
            }
            addBoard={addBoard}
            canAddMoreBoard={
              (departmentsBoards(department)
                ? departmentsBoards(department).length
                : 0) < limitBoard
                ? true
                : false
            }
          />
        </ReactSortable>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,

  departmentsBoards: (departmentId) =>
    getSortBoardsByDepartmentId(departmentId, state),
});

const mapDispatchToProps = {
  fetchBoardsByDepartment,
  addBoardToDepartment,
  updateBoard,
  archiveBoard,
  moveBoardAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListBoards);
