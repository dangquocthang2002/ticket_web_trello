import withRouter from "hocs/withRouter";
import React, { useState } from "react";
import { BsFilter, BsThreeDots, BsSlack } from "react-icons/bs";
import { AiOutlinePicRight } from "react-icons/ai";
import { RiUserSharedLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import BoardMenu from "../board-menu/BoardMenu";
import BoardFilter from "../board-filter/BoardFilter";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import SlackConnection from "../slack-connection/SlackConnection";
import { AiOutlineEye } from "react-icons/ai";

import { countBoardFiltersSelector } from "modules/boards/boards.selectors";
import { DiGitBranch } from "react-icons/di";
import GithubConnection from "../github-connection/GithubConnection";

const isMobile = window.innerWidth < 600;

const BoardHeader = (props) => {
  const {
    board,
    navigate,
    userActive,
    countFilters,
    departmentsUsers,
    boardActive,
    userLoggedIn
    // setOpenEpicsBoard
  } = props;
  const title = board.name;
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [showBoardFilter, setShowBoardFilter] = useState(false);
  const { id } = useParams();
  const [showSlackConnection, setShowSlackConnection] = useState(false);
  const [showGitHubConnection, setShowGitHubConnection] = useState(false);

  // useEffect(() => {
  //   document.title = `${title} | TonyTech-Ticket`;
  //   return () => {
  //     document.title = "TonyTech - Tickets";
  //   };
  // }, [title]);

  const isLeader = Boolean(
    userActive.role === "ADMIN" ||
      departmentsUsers[boardActive.department]?.find(
        (user) => user._id === userLoggedIn._id
      )
  );

  console.log('isLeader', isLeader);

  const mainMenu = () => {
    return (
      <>
        {isLeader && (
          <div className="board-header_l_button p-btn">
            <button
              type="button"
              className="btn"
              onClick={() => setShowGitHubConnection(!showGitHubConnection)}
            >
              <span>
                <DiGitBranch size={20} />
              </span>
              Github Connection
            </button>
          </div>
        )}
        {showGitHubConnection && (
          <GithubConnection setShowGitHubConnection={setShowGitHubConnection} />
        )}
        {["ADMIN"].includes(userActive.role) && (
          <div className="board-header_l_button p-btn">
            <button
              type="button"
              className="btn"
              onClick={() => setShowSlackConnection(!showSlackConnection)}
            >
              <span>
                <BsSlack size={16} />
              </span>
              Slack Connection
            </button>
          </div>
        )}
        {showSlackConnection && (
          <SlackConnection setShowSlackConnection={setShowSlackConnection} />
        )}

        <div className="board-header_l_button p-btn">
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigate(`/boards/${id}/members`);
            }}
          >
            <span>
              <RiUserSharedLine size={18} />
            </span>
            Share
          </button>
        </div>
        <div className="board-header_l_button p-btn">
          <button
            type="button"
            className="btn"
            onClick={() =>
              // setOpenEpicsBoard(true)
              navigate(`/boards/${id}/epics`)
            }
          >
            <span>
              <AiOutlinePicRight size={18} />
            </span>
            Epics
          </button>
        </div>
        <div className="board-header_l_button p-btn">
          <button
            type="button"
            className="btn "
            onClick={() => setShowBoardFilter(!showBoardFilter)}
          >
            <span>
              <BsFilter size={18} />
            </span>
            Filter ({countFilters})
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="board-header">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title || "..."} | TonyTicket</title>
      </Helmet>

      <div className="board-header_wrapper">
        <div
          className="board-header_wrapper_user"
          onClick={() => {
            navigate(`/boards/${id}`);
          }}
        >
          {title}{" "}
          {board.viewOnly ? (
            <div className="board-view-only">
              <AiOutlineEye size={18} />
              <span>mode</span>
            </div>
          ) : (
            <></>
          )}
        </div>
        {/* <div className="p-btn member">
          <button
            type="button"
            className="btn"
            onClick={() => {
              navigate("members");
            }}
          >
            <span>
              <RiUserSharedLine size={18} />
            </span>
            Share
          </button>
        </div> */}
      </div>
      <div className="board-header_l">
        {!isMobile && mainMenu()}
        <div className="board-header_l_button p-btn">
          <button
            type="button"
            className="btn "
            onClick={() => setShowBoardMenu(!showBoardMenu)}
          >
            <span>
              <BsThreeDots size={18} />
            </span>
            Show menu
          </button>
        </div>
        {showBoardMenu && (
          <BoardMenu
            setShowBoardMenu={setShowBoardMenu}
            renderOtherMenu={() => {
              if (isMobile) {
                return mainMenu();
              }
              return "";
            }}
          />
        )}
        {showBoardFilter && (
          <BoardFilter setShowBoardFilter={setShowBoardFilter} />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  userActive: state.users.user,
  userLoggedIn: state.users.user,
  departmentsUsers: state.departments.departmentsUsers,
  boardActive: state.boards.boardActive,
  countFilters: countBoardFiltersSelector(state),
});

export default connect(mapStateToProps)(withRouter(BoardHeader));
