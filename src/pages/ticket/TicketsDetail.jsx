import React, { useEffect, useContext, useState, useRef } from "react";
import { AiOutlinePicRight } from "react-icons/ai";
import { GrClose, GrSort } from "react-icons/gr";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsCardText, BsTag, BsPerson } from "react-icons/bs";
import { RiAttachment2 } from "react-icons/ri";
import Helmet from "react-helmet";

import TicketsTitle from "./ticket-title/TicketTitle";
import ticketsAPI from "api/tickets.api";
import { TicketsContext } from "contexts/tickets-provider/TicketProvider";
import TicketLabel from "./ticket-label/TicketLabel";

import TicketActivity from "./ticket-activity/TicketActivity";

import TicketTasks from "./ticket-tasks/TicketTasks";
import TicketMembers from "./ticket-members/TicketMembers";
import { connect } from "react-redux";
import {
  fetchUsersTicket,
  getTicketByIdSuccess,
  archiveTicket,
  clearTicketCurrent,
} from "modules/tickets/tickets.action";
import { getTicketLabels } from "modules/labels/labels.action";
import TicketEpics from "./ticket-epics/TicketEpics";
import TicketDescription from "./ticket-description/TIcketDescription";
import { updateTicket } from "modules/tickets/tickets.action";

import { useOnClickOutside } from "hooks/useOnClickOutside";
import { IoArchiveOutline } from "react-icons/io5";
import TicketPoints from "./ticket-points/TicketPoints";
import TicketAttachmentPopUp from "./ticket-attachments/TicketAttachmentPopUp";
import TicketAttachmentList from "./ticket-attachments/TikcetAttachmentList";
import { addFilesByTicket } from "modules/files/files.action";
import AttachmentView from "./ticket-attachments/attachment-viewer/AttachmentView";
import { toastError, toastSuccess } from "utils/toastHelper";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
import { DiGitBranch } from "react-icons/di";
import TicketGitConnection from "./ticket-git-connection/TicketGitConnection";
import { fetchPullRequestsByTicket } from "modules/githubConnection/githubConnection.action";
import TicketPullRequests from "./ticket-pullrequests/TicketPullRequests";
import WavesLoading from "components/waves-loading/WavesLoading";

const TicketsDetail = (props) => {
  const {
    ticketsUsers,
    fetchUsersTicket,
    getTicketLabels,
    boardLabels,
    ticketLabels,
    ticket,
    getTicketByIdSuccess,
    boardActive,
    epicsBoard,
    archiveTicket,
    isAdmin,
    updateTicket,
    addFilesByTicket,
    ticketFiles,
    boardViewOnly,
    stateArchived,
    ticketArchived,
    boardActiveInvitedMembers,
    departmentsUsers,
    clearTicketCurrent,
    fetchPullRequestsByTicket,
    ticketPullRequests,
    isLoadingGit,
  } = props;

  const { isOpenLabelsModal, setIsOpenLabelsModal } =
    useContext(TicketsContext);
  const { id, ticketId } = useParams();
  const navigate = useNavigate();
  const [openMember, setOpenMember] = useState(false);
  const [openEpics, setOpenEpics] = useState(false);
  const [openAttachView, setOpenAttachView] = useState();
  const [openPoints, setOpenPoints] = useState(false);
  const [openAttachment, setOpenAttachment] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [openGit, setOpenGit] = useState(false);
  // const [gitLoading, setGitLoading] = useState(false);

  const [showToastOneTime, setShowToastOneTime] = useState();

  const ref = useRef();

  const ticketDetail = ticketLabels.find((i) => i.ticketId === ticket?._id);
  const boardTicketLabel = boardLabels.find(
    (i) => i.boardId === boardActive._id
  );

  const handleArchiveTicket = async (ticket) => {
    if (boardViewOnly) {
      if (showToastOneTime !== "archive") {
        toastError("Just View Board Only");
        setShowToastOneTime(() => "archive");
      }
      return;
    }
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      await archiveTicket(ticket);
      navigate(`/boards/${id}`);
    }
  };
  const onChangePrivateTicket = () => {
    if (!isAdmin) {
      return;
    }
    if (ticket._id) {
      updateTicket({
        _id: ticket._id,
        state: ticket.state,
        content: {
          private: !ticket.private,
        },
      });
    }
  };

  useOnClickOutside(ref, () => navigate(`/boards/${id}`));

  useEffect(() => {
    fetchUsersTicket(ticketId);
    getTicketLabels(ticketId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ticketsAPI.getIdTicket(ticketId);
        getTicketByIdSuccess(res.data);
      } catch (error) {}
    };
    fetchData().then(() => setOpenDescription(true));
    fetchPullRequestsByTicket(ticketId);
  }, [ticketId]);

  useEffect(() => {
    const onAddFilePaste = (e) => {
      const newFiles = e.clipboardData.files;
      if (newFiles.length === 0) {
        return;
      }
      addFilesByTicket(ticketId, [...newFiles]);
    };
    window.addEventListener("paste", onAddFilePaste);
    return () => {
      window.removeEventListener("paste", onAddFilePaste);
    };
  });
  useEffect(() => {
    if (ticket?.state === stateArchived || ticket?._id === ticketArchived) {
      navigate(`/boards/${id}`);
    }
    return () => {
      if (ticket?.state === stateArchived || ticket?._id === ticketArchived) {
        clearTicketCurrent();
      }
    };
  }, [stateArchived, ticketArchived]);

  const ticketUsers = ticketsUsers[ticketId]?.filter((user) =>
    departmentsUsers[boardActive.department]
      ?.concat(boardActiveInvitedMembers || [])
      .map((user) => user._id)
      .includes(user._id)
  );

  if (!ticket?._id) {
    return "...";
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{ticket?.name || "Loading..."} | TonyTicket</title>
        <meta name="description" content={ticket?.description} />
      </Helmet>
      <div className="tickets-detail">
        <div ref={ref} className="tickets-detail_wrapper">
          <div className="close-ticket">
            <Link to={`/boards/${id}`}>
              <GrClose size={18} />
            </Link>
          </div>
          <div className="wrapper-image">
            {ticketFiles[ticket?._id]?.find((file) => file.isCovered) ? (
              <div
                className="tickets-detail-bgAttachment"
                onClick={() =>
                  setOpenAttachView(
                    ticketFiles[ticket._id]?.find((file) => file.isCovered)
                  )
                }
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/${
                    ticketFiles[ticket._id]?.find((file) => file.isCovered).path
                  }?h=160`}
                  alt="logo"
                  className={`${
                    ticketFiles[ticket._id]
                      ?.find((file) => file.isCovered)
                      .path.includes(".svg")
                      ? "svg"
                      : ticketFiles[ticket._id]
                          ?.find((file) => file.isCovered)
                          .path.includes(".gif")
                      ? "gif"
                      : ""
                  }`}
                />
              </div>
            ) : (
              <></>
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
          <div className="ticket-header">
            <span className="ticket-header_icon">
              <BsCardText size={22} />
            </span>
            <TicketsTitle />
          </div>
          <div className="ticket-content">
            <div className="ticket-main">
              <div className="card-detail_data">
                <div className="card-detail_item clearfix">
                  <h3 className="card-detail_item_header">Members</h3>
                  {ticketUsers?.map((user) => (
                    <div className="card-detail_item_member" key={user._id}>
                      <img
                        src={
                          user.avatar?.path
                            ? `${process.env.REACT_APP_API_URL}/${user.avatar?.path}?w=50&h=50`
                            : "/assets/no-avatar-user.png"
                        }
                        alt=""
                        className="card-detail_item_member_avatar"
                      />
                    </div>
                  ))}

                  {/* <button className="card-detail_item_add-button">
                  <span>
                    <BsPlusLg />
                  </span>
                </button> */}
                </div>

                <div className="card-detail_item clearfix">
                  <h3 className="card-detail_item_header">Label</h3>
                  {ticketDetail &&
                    ticketDetail.labelsActive?.map((item, index) => {
                      const labels = boardTicketLabel?.labels.find(
                        (i) => i._id === item.label
                      );
                      return (
                        labels && (
                          <div
                            className="card-detail_item_label"
                            key={index}
                            style={{ backgroundColor: labels.color }}
                          >
                            <span className="label-text">{labels.name}</span>
                          </div>
                        )
                      );
                    })}
                  {/* <button className="card-detail_item_add-button label-button">
                  <span>
                    <BsPlusLg />
                  </span>
                </button> */}
                </div>
                <div className="card-detail_item epic">
                  <h3 className="card-detail_item_header">Epic</h3>
                  <span
                    style={{
                      border: `2px solid ${
                        epicsBoard[id]?.find(
                          (epic) => epic._id === ticket?.epic
                        )
                          ? epicsBoard[id]?.find(
                              (epic) => epic._id === ticket?.epic
                            )?.color
                          : `#f4f5f7`
                      }`,
                    }}
                    className="epic-title"
                  >
                    {
                      epicsBoard[id]?.find((epic) => epic._id === ticket?.epic)
                        ?.name
                    }
                  </span>
                </div>

                <div className="clearfix"></div>
              </div>
              {openDescription && <TicketDescription ticket={ticket} />}
              <TicketAttachmentList />
              {isLoadingGit ? (
                <>
                  <div className="loading_wrapper">
                    <div className="center">
                      <WavesLoading waveNumbers={10} />
                    </div>
                  </div>
                </>
              ) : ticketPullRequests[ticket?._id]?.length > 0 ? (
                <TicketPullRequests ticket={ticket} />
              ) : (
                <></>
              )}
              <TicketTasks
                showToastOneTime={showToastOneTime}
                setShowToastOneTime={setShowToastOneTime}
              />
            </div>
            <div className="ticket-sidebar">
              <div className="ticket-sidebar_list">
                <div className="ticket-private">
                  {isAdmin && (
                    <input
                      type="checkbox"
                      checked={ticket?.private ? true : false}
                      onChange={onChangePrivateTicket}
                    />
                  )}
                  {(isAdmin ? true : ticket?.private ? true : false) && (
                    <span>Private</span>
                  )}
                </div>
                <div className="ticket-id">
                  <input
                    type="text"
                    readOnly
                    value={
                      ticket._id?.slice(0, 6) + "..." + ticket._id?.slice(-6)
                    }
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toastSuccess("Copied");
                    }}
                  />

                  <span onClick={() => setOpenGit(!openGit)}>
                    <DiGitBranch size={22} fill={"#172b4d"} />
                  </span>
                </div>
                {openGit && (
                  <TicketGitConnection
                    setOpenGit={setOpenGit}
                    ticket={ticket}
                  />
                )}
                <h3>Add to card</h3>
                <div className="ticket-members-btn">
                  <button
                    className="button-link"
                    onClick={() => setOpenMember(!openMember)}
                  >
                    <span className="button-link_icon">
                      <BsPerson />
                    </span>
                    <span className="button-link_text">Members</span>
                  </button>
                  {openMember && (
                    <TicketMembers setOpenMember={setOpenMember} />
                  )}
                </div>
                <div className="clearfix ticket-labels-btn">
                  <button
                    className="button-link"
                    onClick={() => setIsOpenLabelsModal(true)}
                  >
                    <span className="button-link_icon">
                      <BsTag />
                    </span>
                    <span className="button-link_text">Labels</span>
                  </button>
                  {isOpenLabelsModal && (
                    <TicketLabel
                      boardLabels={boardLabels}
                      ticketLabels={ticketLabels}
                    />
                  )}
                </div>
                <div className="clearfix ticket-attachment-btn">
                  <button
                    className="button-link"
                    onClick={() => {
                      if (boardViewOnly) {
                        if (showToastOneTime !== "attachment") {
                          toastError("Just View Board Only");
                          setShowToastOneTime(() => "attachment");
                        }
                        return;
                      }
                      setOpenAttachment((prev) => !prev);
                    }}
                  >
                    <span className="button-link_icon">
                      <RiAttachment2 />
                    </span>
                    <span className="button-link_text">Attachment</span>
                  </button>
                  {openAttachment && (
                    <TicketAttachmentPopUp
                      setOpenAttachment={setOpenAttachment}
                    />
                  )}
                </div>
                <div className="clearfix ticket-epics-btn">
                  <button
                    className="button-link"
                    onClick={() => setOpenEpics((prev) => !prev)}
                  >
                    <span className="button-link_icon">
                      <AiOutlinePicRight />
                    </span>
                    <span className="button-link_text">Epics</span>
                  </button>
                  {openEpics && <TicketEpics setOpenEpics={setOpenEpics} />}
                </div>
                <div className="clearfix ticket-points-btn">
                  <button
                    className="button-link"
                    onClick={() => setOpenPoints(true)}
                  >
                    <span className="button-link_icon"></span>
                    <span className="button-link_text">
                      <span style={{ color: "#0079bf" }}>
                        {ticket?.estimatePoints}{" "}
                      </span>
                      Points
                    </span>
                  </button>
                  {openPoints && <TicketPoints setOpenPoints={setOpenPoints} />}
                </div>
              </div>
              <div className="ticket-sidebar_list_actions">
                <h3>Actions</h3>
                <div className="ticket-btn">
                  <button
                    className="button-link"
                    onClick={() => handleArchiveTicket(ticket)}
                  >
                    <span className="button-link_icon">
                      <IoArchiveOutline />
                    </span>
                    <span className="button-link_text">Archived</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="ticket-activity">
              <div className="ticket-activity_icon">
                <div>
                  <span>
                    <GrSort size={16} />
                  </span>
                  <h3 className="activityP">Activity</h3>
                </div>
                <div className="checklist-new-items">
                  {
                    <button
                      type="button"
                      className="btn-new-items"
                      onClick={() => setShowActivities(!showActivities)}
                    >
                      {showActivities ? "Hide Details " : "Show Details"}
                    </button>
                  }
                </div>
              </div>

              {showActivities && (
                <TicketActivity setShowActivities={setShowActivities} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ticketsUsers: state.tickets.ticketsUsers,
  ticketLabels: state.labels.ticketLabels,
  boardLabels: state.labels.boardLabels,

  ticket: state.tickets.ticket,
  boardActive: state.boards.boardActive,
  epicsBoard: state.epics.epicsBoard,
  isAdmin: state.users.isAdmin,
  ticketFiles: state.files.ticketFiles,
  boardViewOnly: boardViewOnlySelector(state),
  stateArchived: state.states.stateArchived,
  ticketArchived: state.tickets.ticketArchived,
  departmentsUsers: state.departments.departmentsUsers,
  boardActiveInvitedMembers: state.boards.boardActiveInvitedMembers,
  ticketPullRequests: state.githubConnection.ticketPullRequests,
  isLoadingGit: state.githubConnection.isLoadingGit,
});
const mapDispatchToProps = {
  fetchUsersTicket,
  getTicketByIdSuccess,
  archiveTicket,
  updateTicket,
  getTicketLabels,
  addFilesByTicket,
  clearTicketCurrent,
  fetchPullRequestsByTicket,
};
export default connect(mapStateToProps, mapDispatchToProps)(TicketsDetail);
