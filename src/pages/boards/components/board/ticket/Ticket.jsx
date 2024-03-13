import { React } from "react";
import { FiCheckSquare } from "react-icons/fi";
import { BsJustifyLeft, BsShieldLock } from "react-icons/bs";

import { RiAttachment2 } from "react-icons/ri";

import { connect } from "react-redux";
import { fetchTasksByTicketId } from "modules/ticketTasks/tasks.action";
import { useNavigate, useParams } from "react-router-dom";
import { fetchUsersTicket } from "modules/tickets/tickets.action";
import { getTicketLabels } from "modules/labels/labels.action";
import { fetchFilesByTicket } from "modules/files/files.action";

const Ticket = (props) => {
  const {
    ticket,
    ticketsUsers,
    boardActive,
    departmentsUsers,
    boardActiveInvitedMembers,
    ticketLabels,
    boardLabels,
    ticketTasks,
    epicsBoard,
    ticketFiles,
  } = props;
  const navigate = useNavigate();

  const ticketDetail = ticketLabels.find((i) => i.ticketId === ticket._id);
  const boardTicketLabel = boardLabels.find(
    (i) => i.boardId === boardActive._id
  );
  const { id } = useParams();
  const onclickTicketPage = () => {
    navigate(`ticket/${ticket._id}`);
  };

  const isCompletedAllTasks =
    ticketTasks[ticket._id]?.filter((task) => task.status === "complete")
      .length === ticketTasks[ticket._id]?.length;

  const epic = epicsBoard[id]?.find((epic) => epic._id === ticket?.epic);
  return (

    <div className="list-card">       
      {ticketFiles[ticket._id]?.find((file) => file.isCovered) ? (
        <div className="list-card-bgAttachment" onClick={onclickTicketPage}>
          <img
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
            src={`${process.env.REACT_APP_API_URL}/${
              ticketFiles[ticket._id]?.find((file) => file.isCovered).path
            }?h=165&w=252`}
            alt="logo"
          />
        </div>
      ) : (
        <></>
      )}
      <div
        onClick={onclickTicketPage}
        className="list-card_item"
        style={
          epic
            ? {
                borderLeft: `4px solid ${epic.color || `#f6f7fa`}`,
              }
            : {}
        }
      >
        <div className="list-card_item-private">
          {ticket.private && (
            <span>
              <BsShieldLock size={20} color="#20c997" />
            </span>
          )}
        </div>
        <div className="list-card_item_img">
          {ticketsUsers[ticket._id]
            ?.filter((user) =>
              [
                ...Array.isArray(departmentsUsers[boardActive?.department]) ? departmentsUsers[boardActive?.department] : [],
                ...boardActiveInvitedMembers,
              ]
                ?.map((departmentsUsers) => departmentsUsers._id)
                .includes(user._id)
            )
            ?.map((user) => (
              <div className="member-in-ticket" key={user._id}>
                <img
                  src={user.avatar?.path
                    ? `${process.env.REACT_APP_API_URL}/${user.avatar?.path}?w=50&h=50`
                    : '/assets/no-avatar-user.png'}
                  alt=""
                  className="card-detail_item_member_avatar"
                />
              </div>
            ))}
        </div>
        <div className="list-card_item_title">
          <p className="epic">
            {epicsBoard[id]?.find((epic) => epic._id === ticket?.epic)?.name}
          </p>
          <p>{ticket.name}</p>
        </div>

        <div>
          {ticketDetail &&
            ticketDetail.labelsActive?.map((item, index) => {
              const label = boardTicketLabel?.labels.find(
                (i) => i._id === item.label
              );
              return (
                label && (
                  <span
                    className="list-card_item_label"
                    key={index}
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                )
              );
            })}
          <div className="list-card_item_task">
            <div className="card-item-icons">
              {ticket.description && (
                <>
                  <span className="descriptionIcon">
                    <BsJustifyLeft size={16} />
                  </span>
                </>
              )}
              {ticketFiles[ticket._id]?.length > 0 && (
                <>
                  <span>
                    <RiAttachment2 size={16} />
                  </span>
                  <span className="attachIcon">
                    {ticketFiles[ticket._id]?.length}
                  </span>
                </>
              )}
              {ticketTasks[ticket._id]?.length > 0 && isCompletedAllTasks && (
                <div className="task-complete">
                  <span className="taskIcon">
                    <FiCheckSquare size={16} />
                  </span>
                  <span className="taskProgress">
                    {
                      ticketTasks[ticket._id]?.filter(
                        (task) => task.status === "complete"
                      ).length
                    }
                    {"/"}
                    {ticketTasks[ticket._id]?.length}
                  </span>
                </div>
              )}

              {ticketTasks[ticket._id]?.length > 0 && !isCompletedAllTasks && (
                <div className="task-todo">
                  <span className="taskIcon">
                    <FiCheckSquare size={16} />
                  </span>
                  <span className="taskProgress">
                    {
                      ticketTasks[ticket._id]?.filter(
                        (task) => task.status === "complete"
                      ).length
                    }
                    {"/"}
                    {ticketTasks[ticket._id]?.length}
                  </span>
                </div>
              )}
              {ticket.estimatePoints ? (
                <span className="card-point-preview">
                  {ticket.estimatePoints} pts
                </span>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div className="list-card_item_menu">
          {/* <BsCardList size={18} /> */}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticketsUsers: state.tickets.ticketsUsers,
  departmentsUsers: state.departments.departmentsUsers,
  boardActive: state.boards.boardActive,
  boardActiveInvitedMembers: state.boards.boardActiveInvitedMembers,
  ticketLabels: state.labels.ticketLabels,
  boardLabels: state.labels.boardLabels,
  ticketTasks: state.tasks.ticketTasks,
  epicsBoard: state.epics.epicsBoard,
  ticketFiles: state.files.ticketFiles,
});
const mapDispatchToProps = {
  fetchTasksByTicketId,
  fetchUsersTicket,
  getTicketLabels,
  fetchFilesByTicket,
};
export default connect(mapStateToProps, mapDispatchToProps)(Ticket);
