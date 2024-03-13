import { React, useState, useContext } from "react";
import { BsXLg, BsChevronLeft } from "react-icons/bs";
import { TicketsContext } from "contexts/tickets-provider/TicketProvider";
import LabelColors from "../ColorsListLabel";
import { addLabels } from "modules/labels/labels.action";
import { connect } from "react-redux";

const AddTicketLabel = (props) => {
  const { setMode, addLabels, selectedColor, boardActive } = props;
  const [labelName, setLabelName] = useState("");
  const { setIsOpenLabelsModal } = useContext(TicketsContext);

  const onLabelNameChange = (e) => setLabelName(e.target.value);
  const onClickAddLabel = () => {
    const newTicketLabel = {
      name: labelName,
      color: selectedColor,
      board: boardActive._id,
    };
    addLabels(newTicketLabel);
    setMode("SELECT_LABELS");
  };

  return (
    <div className="label-modal-create">
      <div className="label-modal_header">
        <button
          className="label-modal_header_back-btn"
          onClick={() => {
            setMode("SELECT_LABELS");
          }}
        >
          <BsChevronLeft size={13} />
        </button>
        <span className="label-modal_header_title">Create label</span>
        <button
          className="label-modal_header_close-btn"
          onClick={() => setIsOpenLabelsModal(false)}
        >
          <BsXLg size={11} />
        </button>
      </div>
      <div className="label-modal_content">
        <span className="label-modal_content_title">Name</span>
        <input
          value={labelName}
          onChange={onLabelNameChange}
          onKeyDown={(e) => e.key === "Enter" && onClickAddLabel()}
        />
        <span className="label-modal_content_title">Select a color</span>
        <LabelColors />
        <div className="clearfix">
          <button className="create-btn" onClick={onClickAddLabel}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  selectedColor: state.labels.selectedColor,
  boardActive: state.boards.boardActive,
});
const mapDispatchToProps = {
  addLabels,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTicketLabel);
