import { Container, Draggable } from "react-smooth-dnd";
import React, { useEffect } from "react";
import BoardHeader from "./board-header/BoardHeader";
import ColumnTickets from "./column-tickets/ColumnTickets";
import AddColumn from "./add-column/AddColumn";
import { connect } from "react-redux";
import Spinner from "components/spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";

import {
  getDetailBoardById,
  fetchInvitedMembersOfBoardActive,
  fetchTicketsByBoard,
} from "modules/boards/boards.action";
import { fetchUsersDepartment } from "modules/departments/departments.action";

import {
  fetchStatesByBoard,
  moveColumnAction,
} from "modules/columns/columns.action";
import { fetchEpicsByBoard } from "modules/epics/epics.action";
import {
  connectSocket,
  disConnectSocket,
} from "modules/sockets/sockets.action";
import { getStates } from "modules/columns/columns.selectors";
import BoardEpics from "./board-Epics/BoardEpics";
import { fetchLabelsByBoard } from "modules/labels/labels.action";
import BoardLeftSideBar from "./board-left-sidebar/BoardLeftSideBar";
import { getMe } from "modules/users/users.action";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
import { useState } from "react";
import { useRef } from "react";

const Board = (props) => {
  const navigate = useNavigate();
  const refDnd = useRef();

  const {
    getDetailBoardById,
    moveColumnAction,
    states,
    isLoading,
    fetchStatesByBoard,
    fetchUsersDepartment,
    fetchLabelsByBoard,
    boardActive,
    fetchInvitedMembersOfBoardActive,
    fetchEpicsByBoard,
    epicsPage,
    getMe,
    fetchTicketsByBoard,
    boardViewOnly,
    connectSocket,
    disConnectSocket,
  } = props;
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const params = useParams();

  const onColumnDrop = (dropResult) => {
    if (boardViewOnly) {
      return;
    }
    if (dropResult.addedIndex === null) {
      return;
    }

    const column = dropResult.payload;

    if (dropResult.removedIndex !== null) {
      moveColumnAction({
        column,
        addedIndex: dropResult.addedIndex,
        removedIndex: dropResult.removedIndex,
      });
    }
  };

  useEffect(() => {
    setLoadingStates(true);
    getDetailBoardById(params.id)
      .then((res) => {
        Promise.all([
          fetchStatesByBoard(res._id),
          fetchUsersDepartment(res.department),
          fetchInvitedMembersOfBoardActive(res._id),
          fetchLabelsByBoard(res._id),
          fetchEpicsByBoard(res._id),
          getMe(),
        ]).then(() => {
          setLoadingStates(false);
          setLoadingTickets(true);
          fetchTicketsByBoard(params.id).then(() => {
            setLoadingTickets(false);
            connectSocket();
          });
        });
      })

      .catch(() => {
        navigate("/departments");
      });
    return () => disConnectSocket();
  }, [params.id]);

  useEffect(() => {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    let block = false;

    const ele = refDnd.current;

    const mouseUpHandler = function (e) {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
      ele.style.cursor = "grab";
      ele.style.removeProperty("user-select");
      pos.x = e.clientX;
      block = false;
    };

    const mouseDownHandler = function (e) {
      try {
        if (e.target?.className?.includes("gridview-board")) {
          block = false;
        } else {
          block = true;
        }
      } catch {
        block = true;
      }

      // Change the cursor and prevent user from selecting the text
      pos = {
        // The current scroll
        left: ele.scrollLeft,
        top: ele.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
      if (!block) {
        const dx = e.clientX - pos.x;
        ele.scrollLeft = pos.left - dx;
      }
    };

    document.addEventListener("mousedown", mouseDownHandler);

    // touch
    // const touchMoveHandler = (e) => {
    //   const clientX = e.touches[0].clientX;
    //   const dx = clientX - pos.x;
    //   ele.scrollLeft = pos.left - dx;
    // };

    // const touchUpHandler = function (e) {
    //   document.removeEventListener("touchmove", touchMoveHandler);
    //   document.removeEventListener("touchup", touchUpHandler);

    //   ele.style.cursor = "grab";
    //   ele.style.removeProperty("user-select");
    //   pos.x = e.clientX;
    // };

    // const touchDownHandler = function (e) {
    //   // Change the cursor and prevent user from selecting the text
    //   pos = {
    //     // The current scroll
    //     left: ele.scrollLeft,
    //     top: ele.scrollTop,
    //     // Get the current mouse position
    //     x: e.clientX,
    //     y: e.clientY,
    //   };

    //   document.addEventListener("touchmove", touchMoveHandler);
    //   document.addEventListener("touchend", touchUpHandler);
    // };

    // document.addEventListener("touchstart", touchDownHandler);
  }, []);

  return (
    <div className="content-wrapper">
      {loadingStates && (
        <div className="loader_wrapper">
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      <div className="content-wraper_1">
        <BoardLeftSideBar />

        <div className="content-wrapper_layout">
          <BoardHeader board={boardActive} />
        </div>

        {isLoading && !states ? (
          <div className="Loading">
            <Spinner />
          </div>
        ) : epicsPage ? (
          <BoardEpics />
        ) : (
          <div className="tickets">
            <div className="tickets_content" ref={refDnd}>
              <Container
                groupName="state"
                dragClass="tickets-ghost"
                dropClass="tickets-ghost-drop"
                getChildPayload={(index) => states[index]}
                orientation="horizontal"
                onDrop={(dropResult) => onColumnDrop(dropResult)}
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={{
                  animationDuration: 150,
                  showOnTop: true,
                  className: "column-drop-preview",
                }}
              >
                {states.map((column) => {
                  return boardViewOnly ? (
                    <ColumnTickets key={column._id} column={column} />
                  ) : (
                    <Draggable key={column._id}>
                      <ColumnTickets
                        column={column}
                        loadingTickets={loadingTickets}
                      />
                    </Draggable>
                  );
                })}
              </Container>
              {boardViewOnly ? <></> : <AddColumn />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  states: getStates(state),
  isLoading: state.states.isLoading,
  error: state.states.error,
  boardActive: state.boards.boardActive,
  boardViewOnly: boardViewOnlySelector(state),
});

const mapDispatchToProps = {
  moveColumnAction,
  fetchStatesByBoard,
  getDetailBoardById,
  fetchUsersDepartment,
  fetchInvitedMembersOfBoardActive,
  fetchLabelsByBoard,
  fetchEpicsByBoard,
  getMe,
  fetchTicketsByBoard,
  connectSocket,
  disConnectSocket,
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
