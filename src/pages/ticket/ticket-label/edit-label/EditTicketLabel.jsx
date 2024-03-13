import { React, useState, useContext, useEffect } from "react";
import { BsXLg, BsChevronLeft } from "react-icons/bs";
import { TicketsContext } from "contexts/tickets-provider/TicketProvider";
import LabelColors from "../ColorsListLabel";
import { updateLabel } from "modules/labels/labels.action";
import { connect } from "react-redux";

const EditTicketLabel = (props) => {
  const { setMode, labelUpdate, updateLabel, selectedColor } = props;
  const [newLabelName, setNewLabelName] = useState("");
  const { setIsOpenLabelsModal } = useContext(TicketsContext);

  const onNewLabelNameChange = (e) => setNewLabelName(e.target.value);
  const updateNewLabel = () => {
    const newLabel = {
      ...labelUpdate,
      name: newLabelName,
      color: selectedColor,
    };
    updateLabel(newLabel);
    setMode("SELECT_LABELS");
  };

  useEffect(() => {
    if (labelUpdate) {
      setNewLabelName(labelUpdate.name);
    }
  }, [labelUpdate]);

  return (
    <div className="label-modal-edit">
      <div className="label-modal_header">
        <button
          className="label-modal_header_back-btn"
          onClick={() => {
            setMode("SELECT_LABELS");
          }}
        >
          <BsChevronLeft size={13} />
        </button>
        <span className="label-modal_header_title">Edit label</span>
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
          value={newLabelName}
          onChange={onNewLabelNameChange}
          onKeyDown={(e) => e.key === "Enter" && updateNewLabel()}
        />
        <span className="label-modal_content_title">Select a color</span>
        <LabelColors />
        <div className="clearfix">
          <div className="edit-btn">
            <button className="create-btn" onClick={updateNewLabel}>
              Save
            </button>
            <button
              className="delete-btn"
              onClick={() => {
                setMode("DELETE_LABEL");
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  labelUpdate: state.labels.labelUpdate,
  selectedColor: state.labels.selectedColor,
});

const mapDispatchToProps = {
  updateLabel,
};
export default connect(mapStateToProps, mapDispatchToProps)(EditTicketLabel);
