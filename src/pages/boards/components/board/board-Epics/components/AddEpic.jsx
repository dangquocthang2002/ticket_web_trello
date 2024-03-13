import { colorsList } from "constants/ColorsList";
import withRouter from "hocs/withRouter";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { addEpicToBoard, updateEpic } from "modules/epics/epics.action";
import { useRef, useState } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { BsCheck } from "react-icons/bs";

const AddEpic = (props) => {
  const {
    setOpenEpicFormAdd,
    epics,
    params,
    update,
    epic,
    setOpenFormUpdateEpic,
  } = props;
  const [messageError, setMessageError] = useState(false);
  const [epicTitleInput, setEpicTitleInput] = useState(update ? epic.name : "");
  const [epicColor, setEpicColor] = useState(update ? epic.color : "");
  const [startedDate, setStartedDate] = useState(
    update ? epic.startedDate : ""
  );
  const [endedDate, setEndedDate] = useState(update ? epic.endedDate : "");
  const { id } = params;

  const ref = useRef();

  const dispatch = useDispatch();

  const onUpdateEpic = () => {
    if (
      epicTitleInput === "" ||
      startedDate === "" ||
      endedDate === "" ||
      startedDate >= endedDate
    ) {
      setMessageError(true);
      return;
    }
    setOpenFormUpdateEpic(null);
    const epicUpdate = {
      ...epic,
      name: epicTitleInput,
      startedDate: startedDate,
      endedDate: endedDate,
      color: epicColor,
    };
    dispatch(updateEpic(epicUpdate));
  };
  const onAddEpic = () => {
    if (!epics) {
      return;
    }
    if (
      epicTitleInput === "" ||
      startedDate === "" ||
      endedDate === "" ||
      startedDate >= endedDate
    ) {
      setMessageError(true);
      return;
    }
    setOpenEpicFormAdd(false);
    const newEpic = {
      name: epicTitleInput,
      startedDate: startedDate,
      endedDate: endedDate,
      board: id,
      color: epicColor,
    };
    dispatch(addEpicToBoard(newEpic));
  };

  useOnClickOutside(ref, () =>
    update ? setOpenFormUpdateEpic() : setOpenEpicFormAdd(false)
  );
  return (
    <>
      <div ref={ref} className={`add-epic-wrapper ${update ? "update" : ""} `}>
        <div className="epic-header">
          <h6>{update ? "UPDATE EPIC" : "EPICS"}</h6>
        </div>
        <div className="epic-form">
          <div className="epic-form-title">
            <div className="epic-form-title-content">
              <h6>Epic Title</h6>
            </div>

            <div className="epic-form-title-input">
              <input
                value={epicTitleInput}
                onChange={(e) => setEpicTitleInput(e.currentTarget.value)}
              ></input>
            </div>
            <div className="epic-form-color">
              <h6>Epic Color</h6>
              <div className="clearfix" style={{
                maxHeight: "100px",
                overflow: "auto"
              }}>
                {colorsList.map((item, index) => (
                  <label
                    key={index}
                    style={{ backgroundColor: item }}
                    className="color-label"
                    onClick={() =>
                      setEpicColor((prev) => (prev === item ? "" : item))
                    }
                  >
                    {epicColor === item && (
                      <span className="check-label">
                        <BsCheck size={25} />
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="epic-form-lifeCycle">
            <div className="epic-form-lifeCycle-item">
              <h6>Start Day</h6>
              <input
                type="date"
                className="datetime"
                value={startedDate}
                onChange={(e) => setStartedDate(e.currentTarget.value)}
              />
            </div>
            <div className="epic-form-lifeCycle-item">
              <h6>Due Day</h6>
              <input
                type="date"
                className="datetime"
                value={endedDate}
                onChange={(e) => setEndedDate(e.currentTarget.value)}
              />
            </div>
          </div>
          {messageError && (
            <div className="msg-error">
              <span>Not emty or invalid date</span>
            </div>
          )}
          <div className="epic-form-button">
            {update ? (
              <button type="button" className="btn" onClick={onUpdateEpic}>
                <span>Update Epic</span>
                <span>
                  <IoMdArrowRoundForward size={24} />
                </span>
              </button>
            ) : (
              <button type="button" className="btn" onClick={onAddEpic}>
                <span>Create epic</span>
                <span>
                  <IoMdArrowRoundForward size={24} />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default withRouter(AddEpic);
