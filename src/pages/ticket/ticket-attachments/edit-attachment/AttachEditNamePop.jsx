import { useOnClickOutside } from "hooks/useOnClickOutside";
import { updateFile } from "modules/files/files.action";
import { useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const AttachEditNamePop = (props) => {
  const { setOpenEditFileName, file } = props;
  const [inputName, setInputName] = useState(file ? file.name : "");
  const { ticketId } = useParams();

  const ref = useRef();
  const dispatch = useDispatch();
  const onUpdateFileName = () => {
    if (!file._id) {
      return;
    }
    if (inputName === "") {
      return;
    }
    dispatch(
      updateFile(ticketId, {
        _id: file._id,
        content: {
          name: inputName,
        },
      })
    );
    setOpenEditFileName(false);
  };
  useOnClickOutside(ref, () => setOpenEditFileName(false));

  return (
    <div ref={ref} className="pop-edit-name-file">
      <div className="pop-edit-name-file-header">
        <span>Edit attachment</span>
        <button
          className="pop-edit-name-file-header-close-btn"
          onClick={(e) => {
            setOpenEditFileName(false);
          }}
        >
          <BsXLg size={11} />
        </button>
      </div>
      <div className="pop-edit-name-file-content">
        <input
          value={inputName}
          onChange={(e) => {
            setInputName(e.target.value);
          }}
        />
        <button className="btn" onClick={() => onUpdateFileName()}>
          Update
        </button>
      </div>
    </div>
  );
};
export default AttachEditNamePop;
