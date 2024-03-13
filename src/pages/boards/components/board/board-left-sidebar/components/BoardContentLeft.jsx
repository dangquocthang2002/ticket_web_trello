import React, { useRef, useEffect } from "react";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { MdSpaceDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { BsChevronDoubleLeft } from "react-icons/bs";
import ListBoardsOfDepartment from "./ListBoardsOfDepartment";
import { Link, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { fetchBoardsByDepartment } from "modules/departments/departments.action";
import Spinner from "components/spinner/Spinner";

const BoardContentLeft = (props) => {
  const ref = useRef();
  const {
    selectedDepartment,
    boardActive,
    setShowBoardleftSideBar,
    fetchBoardsByDepartment,
    departmentsBoards,
    isLoading,
  } = props;

  const departmentId = boardActive.department;
  const { id } = useParams();
  useOnClickOutside(ref, () => setShowBoardleftSideBar(false));
  useEffect(() => {
    fetchBoardsByDepartment(departmentId);
  }, [departmentId]);

  return (
    <div className="board-left">
      <div className="board-left-sidebar">
        <div className="board-left-sidebar-container">
          <div className="board-left-sidebar-tab-container" ref={ref}>
            <div className="board-left-sidebar-header">
              {isLoading ? (
                <div className="Loading">
                  <Spinner />
                </div>
              ) : (
                <div className="board-left-sidebar-header-title">
                  <Link to="/departments">{selectedDepartment.name}</Link>
                </div>
              )}

              <div className="board-left-sidebar-header-close">
                <button onClick={() => setShowBoardleftSideBar(false)}>
                  <BsChevronDoubleLeft color="red" size={14} />
                </button>
              </div>
            </div>
            <div className="board-left-sidebar-content">
              <div className="board-left-sidebar-navigate">
                <Link
                  to={`/boards/${id}`}
                  className="board-left-sidebar-action"
                >
                  <span className="icon">
                    <MdSpaceDashboard size={18} />
                  </span>
                  <p>Board</p>
                </Link>

                <Link
                  to={`/boards/${id}/members`}
                  className="board-left-sidebar-action"
                >
                  <span className="icon">
                    <CgProfile size={18} />
                  </span>
                  <p>Member</p>
                </Link>
              </div>
              <div className="board-left-sidebar-action">
                <div className="span">
                  <span>Your boards</span>
                </div>
              </div>
              {isLoading ? (
                <div className="Loading">
                  <Spinner />
                </div>
              ) : (
                <div>
                  {departmentsBoards[departmentId]?.map((board) => (
                    <ListBoardsOfDepartment
                    // className= {` ListBoardsOfDepartment ${
                    //   id === board._id ? "active" : "acive2"
                    // } `}
                    board={board} key={board._id} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.departments.isLoading,
  selectedDepartment: state.departments.selectedDepartment,
  boardActive: state.boards.boardActive,
  departmentsBoards: state.departments.departmentsBoards,
});

const mapDispatchToProps = {
  fetchBoardsByDepartment,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardContentLeft);
