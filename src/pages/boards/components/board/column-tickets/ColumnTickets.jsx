import React, { useState, useEffect, useMemo } from "react";
import { saveContentAfterEnter } from "utils/ContenEditable";
import { BsThreeDots } from "react-icons/bs";
import { Dropdown, Form } from "react-bootstrap";
import AddTicket from "../add-ticket/AddTicket";
import Ticket from "../ticket/Ticket";
import { editTitle } from "modules/columns/columns.action";
import { connect } from "react-redux";
import { Container, Draggable } from "react-smooth-dnd";
import {
  moveTicketAction,
  fetchTicketByState,
} from "modules/tickets/tickets.action";
import { archiveState, doneState } from "modules/columns/columns.action";

import { getSortTicket } from "modules/tickets/ticket.selectors";
import { toastError } from "utils/toastHelper";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
import WavesLoading from "components/waves-loading/WavesLoading";

const ColumnTickets = (props) => {
  const {
    doneState,
    moveTicketAction,
    ticketsByState,
    column,
    editTitle,
    // fetchTicketByState,
    archiveState,
    boardActive,
    filter,
    ticketsUsers,
    ticketLabels,
    isLoading,
    boardViewOnly,
    loadingTickets,
  } = props;
  const stateId = column._id;

  const tickets = ticketsByState(stateId);
  const [columnTitle, setColumnTitle] = useState("");
  // const [isLoading, setLoading] = useState(false);
  // const [ticketShow, setTicketShow] = useState();

  const checkFilterBoard = () => {
    return tickets.filter((ticket) => {
      let matched = true;

      const userChecked =
        filter[boardActive._id]?.members?.selectedMember?.map(
          (mem) => mem._id
        ) || [];
      const filteredMember = ticketsUsers[ticket._id]?.find((user) =>
        userChecked.includes(user._id)
      );

      const labelChecked =
        filter[boardActive._id]?.labels?.selectedLabel?.map(
          (label) => label._id
        ) || [];
      const filteredLabel = ticketLabels
        .find((i) => i.ticketId === ticket._id)
        ?.labelsActive.find((i) => labelChecked.includes(i.label));

      const epicChecked =
        filter[boardActive._id]?.epics?.selectedEpic?.map((epic) => epic._id) ||
        [];
      const filteredEpic = epicChecked.includes(ticket.epic);

      const ticketTitleChecked = filter[boardActive._id]?.ticketTitle;
      const filteredTicketTitle = ticket.name
        .toLowerCase()
        .includes(ticketTitleChecked?.toLowerCase());

      const noMemberChecked = filter[boardActive._id]?.members?.isNoMember;
      const noMemberFiltered = ticketsUsers[ticket._id]?.find(
        (user) => user._id
      );

      const noLabelChecked = filter[boardActive._id]?.labels?.isNoLabel;
      const noLabelFiltered = ticketLabels
        .find((i) => i.ticketId === ticket._id)
        ?.labelsActive.find((i) => i.label);

      const noEpicChecked = filter[boardActive._id]?.epics?.isNoEpic;
      const noEpicFiltered = ticket.epic;

      if (
        (userChecked.length > 0 && !filteredMember) ||
        (labelChecked.length > 0 && !filteredLabel) ||
        (epicChecked.length > 0 && !filteredEpic) ||
        (ticketTitleChecked && !filteredTicketTitle) ||
        (noMemberChecked && noMemberFiltered) ||
        (noLabelChecked && noLabelFiltered) ||
        (noEpicChecked && noEpicFiltered)
      ) {
        matched = false;
      } else {
        matched = true;
      }

      return matched;
    });
  };

  const clickStateIsDone = () => {
    if (boardViewOnly) {
      toastError("Just View Board Only");
      return;
    }
    if (column._id) {
      doneState({
        _id: column._id,
        body: {
          isDone: !column?.isDone,
        },
      });
    }
  };

  const ticketShow = useMemo(() => {
    if (
      filter[boardActive._id]?.members?.selectedMember?.length > 0 ||
      filter[boardActive._id]?.labels?.selectedLabel?.length > 0 ||
      filter[boardActive._id]?.epics?.selectedEpic?.length > 0 ||
      filter[boardActive._id]?.ticketTitle ||
      filter[boardActive._id]?.members?.isNoMember ||
      filter[boardActive._id]?.labels?.isNoLabel ||
      filter[boardActive._id]?.epics?.isNoEpic
    ) {
      return checkFilterBoard();
    } else {
      return tickets;
    }
  }, [filter[boardActive._id], tickets]);

  const onNewColumnTitleChange = (e) => {
    if (boardViewOnly) {
      return;
    }
    setColumnTitle(e.target.value);
  };

  const handleColumnTitleBlur = () => {
    if (boardViewOnly) {
      return;
    }
    if (columnTitle === "") {
      setColumnTitle(column.name);
      return;
    }
    const newTitle = {
      ...column,
      name: columnTitle,
    };
    editTitle(newTitle);
  };

  const handleDeleteStates = () => {
    if (boardViewOnly) {
      toastError("Just View Board Only");
      return;
    }
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      archiveState(column);
    }
  };

  const selectAllInLineText = (e) => {
    e.target.focus();
    e.target.select();
  };

  const onTicketDrop = (dropResult) => {
    if (boardViewOnly) {
      return;
    }
    if (dropResult.addedIndex === null) {
      return;
    }

    const ticket = dropResult.payload;
    if (dropResult.removedIndex === null) {
      moveTicketAction({
        ticket,
        fromStateId: ticket.state,
        toStateId: stateId,
        addedIndex: dropResult.addedIndex,
      });
    } else {
      moveTicketAction({
        ticket,
        fromStateId: ticket.state,
        toStateId: ticket.state,
        addedIndex: dropResult.addedIndex,
        removedIndex: dropResult.removedIndex,
      });
    }
  };

  useEffect(() => {
    setColumnTitle(column.name);
  }, [column.name]);

  return (
    <div className=" gridview-board ">
      <div className=" gridview-board_tickets">
        <div className="column-drag-handle list">
          <div className=" list-header">
            <div className="list-header_title">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                className=" input-enter-content-editable btn "
                value={columnTitle}
                spellCheck="false"
                onBlur={handleColumnTitleBlur}
                onClick={selectAllInLineText}
                onChange={onNewColumnTitleChange}
                onKeyDown={saveContentAfterEnter}
                onMouseDown={(e) => e.preventDefault()}
              />
            </div>
            <div className="list-header_extras">
              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  variant="seconrian"
                  className="dropdown-btn"
                >
                  <BsThreeDots size={18} />
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ margin: 0 }} className="dropdown-menu">
                  <div className="dropdown-menu-title">
                    <span className="pop-over-header-title">List actions</span>
                  </div>
                  <div className="mask-done-state">
                    <label>
                      Mark as DONE State
                      <input
                        type="checkbox"
                        checked={column?.isDone}
                        onChange={clickStateIsDone}
                      />
                    </label>
                  </div>
                  <Dropdown.Item>...</Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteStates}>
                    Archive this list
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        {loadingTickets && (
          <div className="loading_wrapper">
            <div className="center">
              <WavesLoading waveNumbers={10} />
            </div>{" "}
          </div>
        )}
        <div className="tiketss">
          {!isLoading && (
            <Container
              behaviour="move"
              orientation="vertical"
              getChildPayload={(index) => tickets[index]}
              onDrop={(dropResult) => onTicketDrop(dropResult)}
              dragClass="tickets-ghost"
              dropClass="tickets-ghost-drop"
              groupName="ticket"
              dropPlaceholder={{
                animationDuration: 150,
                showOnTop: true,
                className: "tickets-drop-preview",
              }}
              dropPlaceholderAnimationDuration={150}
            >
              {ticketShow &&
                ticketShow.map((ticket) =>
                  boardViewOnly ? (
                    <Ticket key={ticket?._id} ticket={ticket} />
                  ) : (
                    <Draggable key={ticket._id}>
                      <Ticket ticket={ticket} />
                    </Draggable>
                  )
                )}
              <AddTicket column={column} />
            </Container>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.tickets.isLoading,
  ticketsByState: (stateId) => getSortTicket(state, stateId),
  states: state.states.states,
  ticketsUsers: state.tickets.ticketsUsers,
  filter: state.boards.filter,
  boardActive: state.boards.boardActive,
  ticketLabels: state.labels.ticketLabels,
  boardViewOnly: boardViewOnlySelector(state),
});

const mapDispatchToProps = {
  doneState,
  editTitle,
  fetchTicketByState,
  moveTicketAction,
  archiveState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColumnTickets);
