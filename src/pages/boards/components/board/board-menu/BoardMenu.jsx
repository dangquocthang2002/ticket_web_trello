import React, { useRef, useState } from "react";
import { GrClose, GrSort } from "react-icons/gr";
import ActivityPreview from "components/board-activities/ActivityPreview";
// import { BsFillWalletFill, BsCardImage } from "react-icons/bs";
// import { FiMoreHorizontal } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { fetchBoardActivities } from "modules/activities/activities.action";
import { useEffect } from "react";
import { connect } from "react-redux";
import { getAllUserInBoard } from "modules/boards/boards.selectors";
const BoardMenu = (props) => {
  const limit = 20;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const ref = useRef();
  const { setShowBoardMenu, fetchBoardActivities, boardActivities, renderOtherMenu, allUserInBoard } = props;

  useOnClickOutside(ref, () => setShowBoardMenu(false));

  useEffect(() => {
    fetchBoardActivities(params.id, page, limit);
    setLoading(false);
  }, [params.id, page]);

  return (
    <div className="board-menu">
      <div className="board-menu-container">
        <div className="board-menu-tab-container" ref={ref}>
          <div className="board-menu-header">
            <div className="board-menu-header-title">
              <p>Menu</p>
            </div>
            <div className="board-menu-header-close">
              <button onClick={() => setShowBoardMenu(false)}>
                <GrClose size={16} />
              </button>
            </div>
          </div>
          <div className="board-menu-content">
            <div className="board-menu-navigate">
              {renderOtherMenu && renderOtherMenu()}
              {/* <div className="board-menu-icon-action about">
                <span>
                  <BsFillWalletFill size={18} />
                </span>
                <p>About this board</p>
              </div>
              <div className="board-menu-icon-action changeBackground">
                <span className="icon">
                  <BsCardImage size={18} />
                </span>
                <p>Change background</p>
              </div> */}
              {/* <div className="board-menu-icon-action more">
                <span>
                  <FiMoreHorizontal size={18} />
                </span>
                <p>More</p>
              </div> */}
            </div>
            <hr className="board-menu-header-divider"></hr>
            <div className="board-menu-icon-action">
              <Link to="#" className="activity ">
                <GrSort className="activityIcon" />
                <span>Activity</span>
              </Link>
            </div>

            <div>
              {boardActivities?.map((activity, index) => (
                <ActivityPreview activity={activity} key={index} allUserInBoard={allUserInBoard}/>
              ))}
            </div>

            <div className="show-more-activities">
              {!props.finishedFetch && (
                <button onClick={() => setPage(page + 1)}>
                  {loading ? "Loading..." : <p>View more activity...</p>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  boardActivities: state.activities.boardActivities,
  finishedFetch: state.activities.finishedFetch,
  allUserInBoard: getAllUserInBoard(state)
});

const mapDispatchToProps = {
  fetchBoardActivities,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardMenu);
