import { React, useContext } from "react";
import { BsXLg, BsChevronLeft } from "react-icons/bs";
import { TicketsContext } from "contexts/tickets-provider/TicketProvider";
import { deleteLabel } from "modules/labels/labels.action";
import { connect } from "react-redux";

const DeleteTicketLabel = (props) => {
  const { setMode, labelUpdate, deleteLabel, ticket } = props;
  const { setIsOpenLabelsModal } = useContext(TicketsContext);
  const onConfirmModalAction = () => {
    const newLabel = {
      ...labelUpdate,
    };
    deleteLabel(newLabel, ticket._id);
    setMode("SELECT_LABELS");
  };
  return (
    <div className="label-modal-delete">
      <div className="label-modal_header">
        <button
          className="label-modal_header_back-btn"
          onClick={() => {
            setMode("SELECT_LABELS");
          }}
        >
          <BsChevronLeft size={13} />
        </button>
        <span className="label-modal_header_title">Delete label</span>
        <button
          className="label-modal_header_close-btn"
          onClick={() => setIsOpenLabelsModal(false)}
        >
          <BsXLg size={11} />
        </button>
      </div>
      <div className="label-modal_content">
        <p>This will remove this label from all cards. There is no undo.</p>
        <button
          className="label-modal_content_section_create-btn"
          style={{ color: "white", backgroundColor: "#b04632" }}
          onClick={onConfirmModalAction}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  labelUpdate: state.labels.labelUpdate,
  ticket: state.tickets.ticket,
});

const mapDispatchToProps = {
  deleteLabel,
};
export default connect(mapStateToProps, mapDispatchToProps)(DeleteTicketLabel);
