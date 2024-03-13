import { connect } from "react-redux";
import { DiGitBranch } from "react-icons/di";
import { BiGitPullRequest } from "react-icons/bi";

const ticketPullRequests = (props) => {
  const { ticket, ticketPullRequests } = props;
  return (
    <>
      <div className="card-detail_pullrequests">
        <span>
          <BiGitPullRequest size={22} />
        </span>
        <div className="card-detail_pullrequests_title card-module-title">
          <h3>Pull Requests</h3>
        </div>
      </div>
      <div className="ticket-git-pr">
        {ticketPullRequests[ticket?._id]?.map((ticketPRBranch) => (
          <div
            key={Object.keys(ticketPRBranch)}
            className="ticket-git-pr-content"
          >
            {Object.values(ticketPRBranch)[0].map((pr) => (
              <div className="pull-request-data" key={pr.id}>
                <div className="pull-request-data-header">
                  <span>
                    <DiGitBranch size={16} fill="#fff"/>
                  </span>
                  <p
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(
                        `https://github.com/${Object.keys(ticketPRBranch)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    {Object.keys(ticketPRBranch)}
                  </p>
                </div>
                <div className="pull-request-data-content">
                  {/* <p>{pr.url}</p> */}
                  <span className="pull-request-data-number">
                    #{pr.url.split("/")[pr.url.split("/").length - 1]}:
                  </span>
                  <a
                    href="/#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(pr.html_url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <span>{pr.title}</span>
                  </a>
                </div>
                <div className="pull-request-data-state">
                  {pr.merged_at ? (
                    <span className={"pull-request-state merged"}>Merged</span>
                  ) : (
                    <span className={`pull-request-state ${pr.state}`}>
                      {pr.state.charAt(0).toUpperCase() + pr.state.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  userLoggedIn: state.users.user,
  ticketPullRequests: state.githubConnection.ticketPullRequests,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(ticketPullRequests);
