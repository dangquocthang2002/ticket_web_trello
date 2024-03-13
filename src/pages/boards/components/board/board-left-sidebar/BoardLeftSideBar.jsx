import React, { useState } from "react";
import { BsChevronDoubleRight } from "react-icons/bs";
import BoardContentLeft from "./components/BoardContentLeft";
const BoardLeftSideBar = () => {
  const [showBoardleftSideBar, setShowBoardleftSideBar] = useState(false);

  return (
    <div className="board-left-sidebar">
      <div className="board-left">
        <div className="board-left-sidebar_button">
          <button
            type="button"
            className="btn"
            onClick={() => setShowBoardleftSideBar(!showBoardleftSideBar)}
          >
            <span className="board-left-sidebar_button_icon">
              <BsChevronDoubleRight color="red" />
            </span>
          </button>
        </div>
        {showBoardleftSideBar && (
          <BoardContentLeft
            setShowBoardleftSideBar={setShowBoardleftSideBar}
          />
        )}
      </div>
    </div>
  );
};

export default BoardLeftSideBar;
