import withRouter from "hocs/withRouter";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { addFilesByTicket } from "modules/files/files.action";
import { useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { MdOutlineClear } from "react-icons/md";
import { useDispatch } from "react-redux";
const TicketAttachmentPopUp = (props) => {
  const { setOpenAttachment, params, popInListAttachment } = props;
  const { ticketId } = params;
  const [newFiles, setNewFiles] = useState([]);
  const ref = useRef();
  const dispatch = useDispatch();
  const uploadFiles = () => {
    if (newFiles.length === 0) {
      return;
    }
    dispatch(addFilesByTicket(ticketId, newFiles));
    document.getElementById("files-input").value = "";
    setNewFiles();
    setOpenAttachment(false);
  };

  useOnClickOutside(ref, () => setOpenAttachment(false));

  return (
    <>
      <div
        ref={ref}
        className={`ticket-attachments ${
          popInListAttachment ? "pop-attach-list" : ""
        }`}
      >
        <div className="ticket-attachments-wrapper">
          <div className="ticket-attachments-header">
            <span>Attach from...</span>
            <button
              onClick={() => setOpenAttachment(false)}
              className="ticket-attachments-header-close-btn"
            >
              <BsXLg size={11} />
            </button>
          </div>
          <div className="ticket-attachments-content">
            <div className="ticket-attachments-content-upload">
              <label htmlFor="files-input">Select from computer...</label>
              <input
                id="files-input"
                type="file"
                multiple
                onChange={(e) =>
                  setNewFiles((prev) => [
                    ...prev,
                    ...[...e.target.files].filter(
                      (file) =>
                        !prev
                          .map((file) => file.lastModified)
                          .includes(file.lastModified) ||
                        !prev.map((file) => file.name).includes(file.name)
                    ),
                  ])
                }
              />
            </div>
            <div className="ticket-attachments-content-files">
              {newFiles?.map((file, i) => (
                <div
                  className="file-upload-item"
                  // key={file?.lastModified || file?.name}
                  key={i}
                >
                  <span className="nameFileUpload">{file?.name}</span>

                  <span
                    className="btn-delete-file"
                    onClick={() =>
                      setNewFiles((prev) =>
                        prev?.filter((f) => {
                          return (
                            f?.lastModified !== file?.lastModified ||
                            f?.name !== file?.name
                          );
                        })
                      )
                    }
                  >
                    <MdOutlineClear />
                  </span>
                </div>
              ))}
              {/* <input type="text" /> */}
            </div>
            <button className="btn-addFile" onClick={uploadFiles}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default withRouter(TicketAttachmentPopUp);
