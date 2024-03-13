import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { HiOutlineX } from "react-icons/hi";
import { ImArrowUpRight2 } from "react-icons/im";
import { deleteFileFromTicket } from "modules/files/files.action";
import { formatBytes } from "utils/formatByte";
import { formatDate } from "utils/formatDate";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const AttachmentView = (props) => {
  const {
    ticketFiles,
    fileActive,
    setOpenAttachView,
    deleteFileFromTicket,
    boardViewOnly,
  } = props;
  const { ticketId } = useParams();

  const [currentIndex, setCurrentIndex] = useState({
    index: ticketFiles[ticketId]
      ?.map((file) => file._id)
      .indexOf(fileActive._id),
    file: fileActive,
  });

  const ref = useRef();

  const goToPrevious = () => {
    const newIndex =
      currentIndex.index === 0
        ? ticketFiles[ticketId]?.length - 1
        : currentIndex.index - 1;
    setCurrentIndex({
      index: newIndex,
      file: ticketFiles[ticketId][newIndex],
    });
  };

  const goToNext = () => {
    const newIndex =
      currentIndex.index === ticketFiles[ticketId]?.length - 1
        ? 0
        : currentIndex.index + 1;
    setCurrentIndex({
      index: newIndex,
      file: ticketFiles[ticketId][newIndex],
    });
  };

  const onDeleteFile = (file) => {
    if (currentIndex.file?._id) {
      const isConfirmed = window.confirm("Are you sure?");
      if (isConfirmed) {
        deleteFileFromTicket(ticketId, currentIndex.file?._id);
        setOpenAttachView();
      }
    }
  };

  useOnClickOutside(ref, () => setOpenAttachView());
  useEffect(() => {
    const keyPress = (e) => {
      if (e.key === "Escape") {
        setOpenAttachView();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", keyPress);
    return () => {
      window.removeEventListener("keydown", keyPress);
    };
  });
  return (
    <div
      className="attachment-view"
      //  onKeyDown={keyPress}
    >
      <div ref={ref} className="attachment-view-container">
        <span>
          <HiOutlineX
            onClick={() => setOpenAttachView()}
            className="btn-close-attach-view"
            size={35}
          />
        </span>
        <div className="attachment-view-wrapper">
          {ticketFiles[ticketId]?.map((file, index) => (
            <div
              className={`item-view ${
                currentIndex.index === index ? "active" : ""
              }`}
              onClick={() => setOpenAttachView()}
              key={file?._id}
            >
              {currentIndex.file?.type.toLowerCase().includes("image") ? (
                <img
                  className={`${
                    currentIndex.file?.path.includes(".svg")
                      ? "svg"
                      : currentIndex.file?.path.includes(".gif")
                      ? "gif"
                      : ""
                  }`}
                  src={`${process.env.REACT_APP_API_URL}/${currentIndex.file?.path}?h=533`}
                  alt=""
                  onClick={(e) => e.stopPropagation()}
                />
              ) : currentIndex.file?.type.toLowerCase().includes("video") ? (
                <video controls onClick={(e) => e.stopPropagation()}>
                  <source
                    src={`${process.env.REACT_APP_API_URL}/${currentIndex.file?.path}`}
                    type="video/mp4"
                  />
                </video>
              ) : currentIndex.file?.type.toLowerCase().includes("pdf") ||
                currentIndex.file?.type.toLowerCase().includes("text/plain") ? (
                <iframe
                  onClick={(e) => e.stopPropagation()}
                  className={`${
                    currentIndex.file?.type.toLowerCase().includes("text/plain")
                      ? "txt"
                      : ""
                  }`}
                  src={`${process.env.REACT_APP_API_URL}/${currentIndex.file?.path}`}
                  title={currentIndex.file?.name}
                  height="100%"
                  width="80%"
                />
              ) : (
                <p
                  onClick={(e) => e.stopPropagation()}
                  className="item-view-download"
                >
                  There is no preview available for this attachment.{" "}
                  <span
                    onClick={() =>
                      window.open(
                        `${process.env.REACT_APP_API_URL}/${currentIndex.file?.path}`
                      )
                    }
                    className="item-view-download-btn"
                  >
                    Download
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="attachment-view-overlay">
          <MdOutlineKeyboardArrowLeft
            size={40}
            className="buttn-slide prev"
            onClick={goToPrevious}
          />
          <div className="attachment-view-details">
            <h2 className="nameFile" style={{ fontSize: "20px" }}>
              {currentIndex.file?.name}
            </h2>
            <p>
              Added {formatDate(currentIndex.file?.createdAt)}
              {" - "} {formatBytes(currentIndex.file?.size)}
            </p>
            <p className="opt">
              <span className="icon">
                <ImArrowUpRight2 size={14} />
                &nbsp;
              </span>
              <span
                className="btn-opt"
                onClick={() =>
                  window.open(
                    `${process.env.REACT_APP_API_URL}/${currentIndex.file?.path}`
                  )
                }
              >
                Open in new tab
              </span>
              &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              {boardViewOnly ? (
                <></>
              ) : (
                <span className="icon">
                  <HiOutlineX size={17} />
                  &nbsp;
                </span>
              )}
              {"  "}
              {boardViewOnly ? (
                <></>
              ) : (
                <span className="btn-opt" onClick={onDeleteFile}>
                  {" "}
                  Delete
                </span>
              )}
            </p>
          </div>
          <MdOutlineKeyboardArrowRight
            size={40}
            className="buttn-slide next"
            onClick={goToNext}
          />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticketFiles: state.files.ticketFiles,
  boardViewOnly: boardViewOnlySelector(state),
});
const mapDispatchToProps = { deleteFileFromTicket };
export default connect(mapStateToProps, mapDispatchToProps)(AttachmentView);
