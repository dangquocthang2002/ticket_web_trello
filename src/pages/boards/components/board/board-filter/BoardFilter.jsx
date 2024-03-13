import React, { useRef } from "react";
import { BsXLg } from "react-icons/bs";
import { GrClear } from "react-icons/gr";
import { connect } from "react-redux";
import BoardFilterMember from "./board-filter-member/BoardFilterMember";
import BoardFilterLabels from "./board-filter-labels/BoardFilterLabels";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import BoardFilterEpic from "./board-filter-epic/BoardFilterEpic";
import {
  filterTicketInBoardByTitle,
  clearFilterInBoard,
} from "modules/boards/boards.action";

const BoardFilter = (props) => {
  const {
    setShowBoardFilter,
    boardActive,
    filterTicketInBoardByTitle,
    filter,
    clearFilterInBoard,
  } = props;
  const ref = useRef();
  const onChangInputSearch = (e) => {
    filterTicketInBoardByTitle(boardActive._id, e.target.value);
  };

  const clearFilterBoard = () => {
    clearFilterInBoard(boardActive._id);
  };

  useOnClickOutside(ref, () => setShowBoardFilter(false));
  return (
    <div className="board-filter" ref={ref}>
      <div className="board-filter_header">
        <button
          className="board-filter_header_clear-filter"
          onClick={() => clearFilterBoard()}
        >
          <GrClear size={13} />
        </button>
        <span className="board-filter_header_title">Filter</span>
        <button
          className="board-filter_header_close-btn"
          onClick={() => setShowBoardFilter(false)}
        >
          <BsXLg size={11} />
        </button>
      </div>
      <div className="board-filter_content">
        <div className="board-filter_content_section">
          <div className="board-filter_content_section_search">
            <h3>Keyword</h3>
            <input
              placeholder="Enter a keyword... "
              className="search-input"
              onChange={onChangInputSearch}
              value={
                filter[boardActive._id]?.ticketTitle
                  ? filter[boardActive._id]?.ticketTitle
                  : ""
              }
            />
            <p>Search name, members, labels, and more.</p>
          </div>
          <BoardFilterMember />
          <BoardFilterLabels />
          <BoardFilterEpic />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  boardActive: state.boards.boardActive,
  filter: state.boards.filter,
});

const mapDispatchToProps = {
  filterTicketInBoardByTitle,
  clearFilterInBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardFilter);
