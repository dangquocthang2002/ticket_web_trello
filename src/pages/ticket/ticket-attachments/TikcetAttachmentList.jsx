import { GrAttachment } from "react-icons/gr";
import { connect } from "react-redux";
import { BsFillCalendar2Fill, BsCameraVideo } from "react-icons/bs";
import { GrDocument } from "react-icons/gr";
import { ImArrowUpRight2 } from "react-icons/im";

import { AiOutlineFileExclamation } from "react-icons/ai";
import { useState } from "react";
import AttachEditNamePop from "./edit-attachment/AttachEditNamePop";
import TicketAttachmentPopUp from "./TicketAttachmentPopUp";
import AttachmentView from "./attachment-viewer/AttachmentView";
import withRouter from "hocs/withRouter";
import { useEffect } from "react";
import {
  deleteFileFromTicket,
  fetchFilesByTicket,
  updateFile,
} from "modules/files/files.action";
import { formatDate } from "utils/formatDate";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
import WavesLoading from "components/waves-loading/WavesLoading";

const TicketAttachmentList = (props) => {
  const {
    updateFile,
    fetchFilesByTicket,
    isLoadingFile,
    ticketFiles,
    deleteFileFromTicket,
    params,
    boardViewOnly,
  } = props;
  const [openEditFileName, setOpenEditFileName] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [openAttachView, setOpenAttachView] = useState();
  const [showAllFiles, setShowAllFiles] = useState(false);
  const { ticketId } = params;
  const openAttachmentView = (file) => {
    if (!file._id) {
      return;
    }
    if (file.type === "other") {
      window.open(`${process.env.REACT_APP_API_URL}/${file?.path}`);
    } else {
      setOpenAttachView(file);
    }
  };
  const onDeleteFile = (file) => {
    if (file._id) {
      const isConfirmed = window.confirm("Are you sure?");
      if (isConfirmed) {
        deleteFileFromTicket(ticketId, file._id);
      }
    }
  };
  useEffect(() => {
    if (!ticketFiles[ticketId]) {
      fetchFilesByTicket(ticketId);
    }
  }, []);
  const filesDisplay =
    ticketFiles[ticketId]?.length > 4
      ? ticketFiles[ticketId]?.slice(0, 4)
      : ticketFiles[ticketId];
  return (
    <>
      {(ticketFiles[ticketId]?.length > 0 || isLoadingFile) && (
        <div className="card-detail_attachment">
          <span>
            <GrAttachment size={22} />
          </span>
          <div className="card-detail_attachment_title card-module-title">
            <h3>Attachment</h3>
          </div>
        </div>
      )}
      <div className="ticket-attachment-list">
        {isLoadingFile && (
          <div className="attachment-thumbnail processing">
            <div className="center">
              <WavesLoading waveNumbers={3} />
              <div>
                <span className="processing">Processing...</span>
              </div>
            </div>
          </div>
        )}
        {(showAllFiles ? ticketFiles[ticketId] : filesDisplay)?.map((file) => (
          <div key={file?._id} className="attachment-thumbnail">
            <div className="attachment-thumbnail-details">
              <div onClick={() => openAttachmentView(file)}>
                {file?.type.toLowerCase().includes("image") ? (
                  <img
                    className="thumb-icon img"
                    src={`${process.env.REACT_APP_API_URL}/${file?.path}?w=112&h=87`}
                    alt=""
                  />
                ) : file?.type.toLowerCase().includes("pdf") ||
                  file?.type.toLowerCase().includes("text/plain") ? (
                  <span className="thumb-icon docs">
                    <GrDocument size={22} />
                  </span>
                ) : file?.type.toLowerCase().includes("video") ? (
                  <span className="thumb-icon video">
                    <BsCameraVideo size={22} />
                  </span>
                ) : (
                  <span className="thumb-icon other">
                    <AiOutlineFileExclamation size={26} />
                  </span>
                )}
                <div className="attachment-thumbnail-details-name">
                  <span className="nameFile">{file?.name}</span>
                  <span className="icon">
                    <ImArrowUpRight2 />
                  </span>
                </div>
              </div>
              <span className="attachment-thumbnail-details-options">
                <span>Added {formatDate(file?.createdAt)}</span>
                {" - "}
                {boardViewOnly ? (
                  <></>
                ) : (
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteFile(file);
                    }}
                    className="opt"
                  >
                    Delete
                  </span>
                )}
                {" - "}
                {boardViewOnly ? (
                  <></>
                ) : (
                  <span
                    className="opt"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenEditFileName(file?._id);
                    }}
                  >
                    Edit
                  </span>
                )}
                {openEditFileName === file?._id && (
                  <AttachEditNamePop
                    setOpenEditFileName={setOpenEditFileName}
                    file={file}
                  />
                )}
              </span>
              {boardViewOnly ? (
                <></>
              ) : file.type.toLowerCase().includes("image") ? (
                <span className="attachment-thumbnail-details-cover">
                  <span>
                    <BsFillCalendar2Fill />
                  </span>
                  &nbsp;&nbsp;
                  <span
                    className="opt"
                    onClick={() =>
                      updateFile(ticketId, {
                        _id: file?._id,
                        content: {
                          isCovered: !file?.isCovered,
                        },
                      })
                    }
                  >
                    {file?.isCovered ? "Remove cover" : "Make cover"}
                  </span>
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
        {ticketFiles[ticketId]?.length > 4 &&
          (showAllFiles ? (
            <div
              className="hide-attachments"
              onClick={() => setShowAllFiles(false)}
            >
              <span className="btn-view">Show fewer attachments.</span>
            </div>
          ) : (
            <div
              className="show-more-attachments"
              onClick={() => setShowAllFiles(true)}
            >
              <span className="btn-view">
                View all attachments ({ticketFiles[ticketId]?.length - 4}{" "}
                hidden)
              </span>
            </div>
          ))}
        {boardViewOnly ? (
          <></>
        ) : (
          ticketFiles[ticketId]?.length > 0 && (
            <button
              className="btn-add-attach"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenAttachment(true);
              }}
            >
              Add an Attachment
            </button>
          )
        )}
        {openAttachment && (
          <TicketAttachmentPopUp
            popInListAttachment={true}
            setOpenAttachment={setOpenAttachment}
          />
        )}
      </div>
      {openAttachView ? (
        <AttachmentView
          setOpenAttachView={setOpenAttachView}
          fileActive={openAttachView}
        />
      ) : (
        <></>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  ticketFiles: state.files.ticketFiles,
  isLoadingFile: state.files.isLoadingFile,
  boardViewOnly: boardViewOnlySelector(state),
});
const mapDispatchToProps = {
  deleteFileFromTicket,
  fetchFilesByTicket,
  updateFile,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TicketAttachmentList));
