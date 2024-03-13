import React, { useRef } from "react";
import { saveContentAfterEnter } from "utils/ContenEditable";
import { connect } from "react-redux";
import { updateTicket } from "modules/tickets/tickets.action";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const TicketsTitle = (props) => {
  const { ticket, updateTicket, boardViewOnly } = props;

  const contentRef = useRef();
  const onTicketTitleChange = (e) => {
    contentRef.current.textContent = e.currentTarget.innerText;
  };

  const editTitle = () => {
    if (boardViewOnly) {
      return;
    }
    if (contentRef.current?.textContent === "") {
      contentRef.current.textContent = ticket?.name;
      return;
    }
    const newTicketTitle = {
      _id: ticket._id,
      state: ticket.state,
      content: {
        name: contentRef.current?.textContent,
      },
    };
    updateTicket(newTicketTitle);
  };

  return (
    <div className="ticket-header_title">
      {ticket?._id ? (
        <div
          ref={contentRef}
          contentEditable={!boardViewOnly}
          suppressContentEditableWarning={true}
          id="text"
          placeholder="Enter your title here"
          className="card-detail_header"
          onInput={onTicketTitleChange}
          onBlur={editTitle}
          onKeyDown={saveContentAfterEnter}
        >
          {ticket?.name}
        </div>
      ) : (
        // />
        <p>loading...</p>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(TicketsTitle);
