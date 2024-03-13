import { React, useContext, useRef } from "react";
import { TicketsContext } from "contexts/tickets-provider/TicketProvider";
import { BsPencil, BsCheck, BsXLg } from "react-icons/bs";
import AddTicketLabel from "./add-label/AddTicketLabel";
import EditTicketLabel from "./edit-label/EditTicketLabel";
import DeleteTicketLabel from "./delete-label/DeleteTicketLabel";
import { useState } from "react";
import { connect } from "react-redux";
import {
  getLabelToUpdateSuccess,
  addLabelToTicket,
  deleteLabelFromTicket,
} from "modules/labels/labels.action";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { toastError } from "utils/toastHelper";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const TicketLabelModal = (props) => {
  const {
    boardLabels,
    ticketLabels,
    addLabelToTicket,
    deleteLabelFromTicket,
    getLabelToUpdateSuccess,
    ticket,
    boardActive,
    boardViewOnly,
  } = props;

  const [showToastOneTime, setShowToastOneTime] = useState();

  const { setIsOpenLabelsModal } = useContext(TicketsContext);

  const [mode, setMode] = useState("SELECT_LABELS"); // SELECT_LABELS -> NEW_LABEL -> EDIT_LABEL -> DELETE_LABEL
  const ref = useRef();

  const pickedLabels = (item, isChecked) => {
    if (boardViewOnly) {
      if (showToastOneTime !== "ticketLabels") {
        toastError("Just View Board Only");
        setShowToastOneTime(() => "ticketLabels");
      }
      return;
    }
    const ticketLabelActive = ticketLabels
      .find((i) => i.ticketId === ticket._id)
      .labelsActive.find((i) => i.label === item._id);
    if (isChecked) {
      deleteLabelFromTicket(ticket._id, ticketLabelActive?._id);
    } else {
      addLabelToTicket(ticket._id, item._id);
    }
  };

  const showEditlabelModal = (item) => {
    getLabelToUpdateSuccess(item);
    setMode("EDIT_LABEL");
  };

  useOnClickOutside(ref, () => setIsOpenLabelsModal(false));

  return (
    <div ref={ref} className="ticket-label">
      <div className="label-modal">
        {mode === "SELECT_LABELS" && (
          <div className="label-modal-detail">
            <div className="label-modal_header">
              <span className="label-modal_header_title">Labels</span>
              <button
                className="label-modal_header_close-btn"
                onClick={() => setIsOpenLabelsModal(false)}
              >
                <BsXLg size={11} />
              </button>
            </div>
            <div className="label-modal_content">
              {/* <input placeholder="Search labels... " /> */}
              <div className="label-modal_content_section">
                {/* <h4>Label</h4> */}
                <ul className="labels-list">
                  {boardLabels.find((i) => i.boardId === boardActive._id) &&
                    boardLabels
                      .find((i) => i.boardId === boardActive._id)
                      .labels.map((item, index) => {
                        const isChecked = ticketLabels
                          .find((i) => i.ticketId === ticket?._id)
                          ?.labelsActive.map((i) => i.label)
                          .includes(item._id);
                        return (
                          <li key={index}>
                            <label className="labels-list_detail">
                              <span
                                className="labels-list_detail_color"
                                key={index}
                                style={{ backgroundColor: item.color }}
                                onClick={() => pickedLabels(item, isChecked)}
                              >
                                <h4>{item.name}</h4>
                                {isChecked && (
                                  <span
                                    className="check-label"
                                    style={{ right: 6 }}
                                  >
                                    <BsCheck size={22} />
                                  </span>
                                )}
                              </span>
                              {boardViewOnly ? (
                                <></>
                              ) : (
                                <div
                                  className="labels-list-edit"
                                  onClick={() => showEditlabelModal(item)}
                                >
                                  <BsPencil size={12} />
                                </div>
                              )}
                            </label>
                          </li>
                        );
                      })}
                </ul>
                {boardViewOnly ? (
                  <></>
                ) : (
                  <button
                    className="label-modal_content_section_create-btn"
                    onClick={() => {
                      setMode("CREATE_LABEL");
                    }}
                  >
                    Create a new label
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {mode === "CREATE_LABEL" && <AddTicketLabel setMode={setMode} />}
        {mode === "EDIT_LABEL" && <EditTicketLabel setMode={setMode} />}
        {mode === "DELETE_LABEL" && <DeleteTicketLabel setMode={setMode} />}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticketLabels: state.labels.ticketLabels,
  boardLabels: state.labels.boardLabels,
  ticket: state.tickets.ticket,
  boardActive: state.boards.boardActive,
  boardViewOnly: boardViewOnlySelector(state),
});

const mapDispatchToProps = {
  addLabelToTicket,
  getLabelToUpdateSuccess,
  deleteLabelFromTicket,
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketLabelModal);
