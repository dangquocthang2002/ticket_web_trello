import { React, useState, useEffect, useRef } from "react";
import { BsXLg } from "react-icons/bs";
import { pointsList } from "constants/pointList";
import { updateTicket } from "modules/tickets/tickets.action";
import { useOnClickOutside } from "hooks/useOnClickOutside";

import { connect } from "react-redux";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const TicketPoints = (props) => {
  const { setOpenPoints, ticket, updateTicket, boardViewOnly } = props;
  const [pointTicket, setPointTicket] = useState("");
  const ref = useRef();
  useOnClickOutside(ref, () => setOpenPoints(false));

  const pickedPoint = (item) => {
    const newEstimated = {
      _id: ticket._id,
      state: ticket.state,
      content: {
        estimatePoints: item,
      },
    };
    updateTicket(newEstimated);
  };
  const pickedBonusPoint = (e, item, plusMore) => {
    e.preventDefault();
    e.stopPropagation();
    const newBonusEstimated = {
      _id: ticket._id,
      state: ticket.state,
      content: {
        estimatePoints: item + plusMore,
      },
    };
    updateTicket(newBonusEstimated);
  };
  const removePoint = () => {
    const removePoint = {
      _id: ticket._id,
      state: ticket.state,
      content: {
        estimatePoints: 0,
      },
    };
    updateTicket(removePoint);
  };
  useEffect(() => {
    if (ticket._id) {
      setPointTicket(ticket.estimatePoints);
    }
  }, [ticket._id, ticket.estimatePoints]);
  return (
    <div className="ticket-points" ref={ref}>
      <div className="ticket-points-wrapper">
        <div className="ticket-points-header">
          <span>Points</span>
          <button
            className="ticket-points-header-close-btn"
            onClick={() => setOpenPoints(false)}
          >
            <BsXLg size={11} />
          </button>
        </div>

        <div className="ticket-points-content">
          {/* {ticket.estimatePoints ? (
            <input
              placeholder="Ticket Points... "
              value={`${pointTicket} Point`}
            />
          ) : (
            <input placeholder="Ticket Points... " />
          )} */}

          <input
            placeholder="Ticket Points... "
            value={`${pointTicket || 0} Point`}
            readOnly={true}
          />
          {boardViewOnly ? (
            <></>
          ) : (
            <button className="point-clear" onClick={() => removePoint()}>
              Clear
            </button>
          )}
          {boardViewOnly ? (
            <></>
          ) : (
            <div className="ticket-points-content-point">
              <ul>
                {pointsList.map((item, index) => (
                  <li
                    className="point-item"
                    key={index}
                    onClick={() => pickedPoint(item)}
                  >
                    <span className="point-value">{item} Point</span>
                    <div className="point-btns">
                      <button
                        className="point-bonus-btn"
                        onClick={(e) => pickedBonusPoint(e, item, 0.5)}
                      >
                        +0.5
                      </button>
                      <button
                        className="point-bonus-btn"
                        onClick={(e) => pickedBonusPoint(e, item, item)}
                      >
                        x2
                      </button>
                      <button
                        className="point-bonus-btn"
                        onClick={(e) => pickedBonusPoint(e, item, item * 2)}
                      >
                        x3
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticket: state.tickets.ticket,
  boardViewOnly: boardViewOnlySelector(state),
});

const mapDispatchToProps = {
  updateTicket,
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketPoints);
