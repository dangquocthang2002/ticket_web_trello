import withRouter from "hocs/withRouter";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
import { fetchEpicsByBoard } from "modules/epics/epics.action";
import { updateTicket } from "modules/tickets/tickets.action";
import { useEffect, useRef, useState } from "react";
import { BsXLg, BsCheck } from "react-icons/bs";
import { connect } from "react-redux";
import { toastError } from "utils/toastHelper";
const TicketEpics = (props) => {
  const {
    params,
    updateTicket,
    epicsBoard,
    fetchEpicsByBoard,
    ticket,
    setOpenEpics,
    boardViewOnly,
  } = props;

  const [showToastOneTime, setShowToastOneTime] = useState();

  const { id } = params;
  const ref = useRef();

  const onUpdateEpicOfTicket = (epic) => {
    if (boardViewOnly) {
      if (showToastOneTime !== "epics") {
        toastError("Just View Board Only");
        setShowToastOneTime(() => "epics");
      }
      return;
    }
    if (epic._id) {
      if (ticket.epic === epic._id) {
        updateTicket({
          _id: ticket._id,
          state: ticket.state,
          content: {
            epic: null,
          },
        });
      } else {
        updateTicket({
          _id: ticket._id,
          state: ticket.state,
          content: {
            epic: epic._id,
          },
        });
      }
    }
  };

  useOnClickOutside(ref, () => setOpenEpics(false));

  useEffect(() => {
    fetchEpicsByBoard(id);
  }, []);
  const epicsSort =
    epicsBoard[id]?.sort((a, b) => a.createdAt - b.createdAt) || [];
  return (
    <div ref={ref} className="ticket-epics">
      <div className="ticket-epics-wrapper">
        <div className="ticket-epics-header">
          <span>Epics</span>
          <button
            className="ticket-epics-header-close-btn"
            onClick={() => setOpenEpics(false)}
          >
            <BsXLg size={11} />
          </button>
        </div>
        <div className="ticket-epics-content">
          <div className="ticket-epics-content-epic">
            <ul>
              {epicsSort?.map((epic) => (
                <li
                  key={epic._id ? epic._id : epic.id}
                  className="epic-item"
                  style={{ border: ` 2px solid ${epic.color}` }}
                  onClick={() => onUpdateEpicOfTicket(epic)}
                >
                  <span className="epic-name">{epic.name}</span>
                  {ticket?.epic !== epic._id ? (
                    <></>
                  ) : (
                    <span className="check-epic">
                      <BsCheck size={25} />
                    </span>
                  )}
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
  epicsBoard: state.epics.epicsBoard,
  ticket: state.tickets.ticket,
  boardViewOnly: boardViewOnlySelector(state),
});
const mapDispatchToProps = {
  fetchEpicsByBoard,
  updateTicket,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TicketEpics));
