import withRouter from "hocs/withRouter";
import { useRef, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { DiGitBranch } from "react-icons/di";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { connect } from "react-redux";
import { toastSuccess } from "utils/toastHelper";

const TicketGitConnection = (props) => {
  const { setOpenGit, ticket, user, isTicketTask, taskCommit } = props; // {ticketsUsers}
  const [openTicketBranch, setOpenTicketBranch] = useState(true);
  const ref = useRef();
  // useOnClickOutside(ref, () => setOpenGit(false));

  const branchName =
    `${user.username}/` +
    "t-" +
    ticket._id +
    "/" +
    ticket.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .slice(0, 6)
      .join("-");

  const commitValue =
    "[t-" + ticket._id.slice(0, 4) + ticket._id.slice(-4) + "] " + ticket.name;
  return (
    <div className="ticket-git">
      <div ref={ref} className="ticket-git-wrapper">
        <div className="ticket-git-header">
          <span>
            <DiGitBranch size={16} />
            Git Helpers
          </span>
          <button
            className="ticket-member-header-close-btn"
            onClick={() => setOpenGit(false)}
          >
            <BsXLg size={11} />
          </button>
        </div>
        <div className="ticket-git-content">
          {!isTicketTask && <div className="ticket-git-switch">
            <button
              className="ticket-git-switch-branch-btn btn git-switch-active"
              onClick={() => {
                setOpenTicketBranch(true);
                document
                  .getElementsByClassName("ticket-git-switch-branch-btn")[0]
                  .classList.add("git-switch-active");
                document
                  .getElementsByClassName("ticket-git-switch-commit-btn")[0]
                  .classList.remove("git-switch-active");
              }}
            >
              Your Branch
            </button>
            <button
              className="ticket-git-switch-commit-btn btn git-switch-unactive"
              onClick={() => {
                setOpenTicketBranch(false);
                document
                  .getElementsByClassName("ticket-git-switch-branch-btn")[0]
                  .classList.remove("git-switch-active");
                document
                  .getElementsByClassName("ticket-git-switch-commit-btn")[0]
                  .classList.add("git-switch-active");
              }}
            >
              Your Commit
            </button>
          </div>}
          {openTicketBranch ? (
            <div className="ticket-git-branch">
              <div className="ticket-git-branch-content">
                <h6>Branch:</h6>
                <div className="ticket-git-branch-control">
                  <input
                    id="branch-name"
                    type="text"
                    value={branchName}
                    readOnly
                  />
                  <button
                    className="btn"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        document.getElementById("branch-name").value
                      );
                      toastSuccess("Copied");
                    }}
                  >
                    <span>
                      <HiOutlineClipboardCheck size={16} />
                    </span>
                  </button>
                </div>
              </div>
              <div className="ticket-git-branch-content">
                <h6>Checkout:</h6>
                <div className="ticket-git-branch-control">
                  <input
                    id="branch-checkout"
                    type="text"
                    value={"git checkout -b " + branchName}
                    readOnly
                  />
                  <button
                    className="btn "
                    onClick={() => {
                      navigator.clipboard.writeText(
                        document.getElementById("branch-checkout").value
                      );
                      toastSuccess("Copied");
                    }}
                  >
                    <span>
                      <HiOutlineClipboardCheck size={16} />
                    </span>
                  </button>
                </div>
              </div>
              {
                isTicketTask && <div className="ticket-git-branch">
                  <div className="ticket-git-branch-content">
                    <h6>Commit:</h6>
                    <div className="ticket-git-branch-control">
                      <input
                        id="commit-value"
                        type="text"
                        value={taskCommit}
                        readOnly
                      />
                      <button
                        className="btn"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            document.getElementById("commit-value").value
                          );
                          toastSuccess("Copied");
                        }}
                      >
                        <span>
                          <HiOutlineClipboardCheck size={16} />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="ticket-git-branch-content">
                    <h6>Command:</h6>
                    <div className="ticket-git-branch-control">
                      <input
                        id="commit-command"
                        type="text"
                        value={'git commit -m "' + taskCommit + '"'}
                        readOnly
                      />
                      <button
                        className="btn "
                        onClick={() => {
                          navigator.clipboard.writeText(
                            document.getElementById("commit-command").value
                          );
                          toastSuccess("Copied");
                        }}
                      >
                        <span>
                          <HiOutlineClipboardCheck size={16} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          ) : (
            <div className="ticket-git-branch">
              <div className="ticket-git-branch-content">
                <h6>Commit:</h6>
                <div className="ticket-git-branch-control">
                  <input
                    id="commit-value"
                    type="text"
                    value={commitValue}
                    readOnly
                  />
                  <button
                    className="btn"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        document.getElementById("commit-value").value
                      );
                      toastSuccess("Copied");
                    }}
                  >
                    <span>
                      <HiOutlineClipboardCheck size={16} />
                    </span>
                  </button>
                </div>
              </div>
              <div className="ticket-git-branch-content">
                <h6>Command:</h6>
                <div className="ticket-git-branch-control">
                  <input
                    id="commit-command"
                    type="text"
                    value={'git commit -m "' + commitValue + '"'}
                    readOnly
                  />
                  <button
                    className="btn "
                    onClick={() => {
                      navigator.clipboard.writeText(
                        document.getElementById("commit-command").value
                      );
                      toastSuccess("Copied");
                    }}
                  >
                    <span>
                      <HiOutlineClipboardCheck size={16} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  ticketsUsers: state.tickets.ticketsUsers,
  user: state.users.user,
  githubByBoard: state.githubConnection.githubByBoard,
  ticketPullRequests: state.githubConnection.ticketPullRequests,
});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TicketGitConnection));
