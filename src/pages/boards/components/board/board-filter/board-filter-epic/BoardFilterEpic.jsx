import React, { useState } from "react";
import { connect } from "react-redux";
import { useRef } from "react";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlinePicRight } from "react-icons/ai";
import {
  filterEpicInBoard,
  removeFilterEpicInBoard,
  filterNoEpicInTicket,
  filterAllEpicInBoard,
  removeFilterAllEpicInBoard,
} from "modules/boards/boards.action";

const BoardFilterEpics = (props) => {
  const {
    epicsBoard,
    boardActive,
    filter,
    filterEpicInBoard,
    removeFilterEpicInBoard,
    filterNoEpicInTicket,
    filterAllEpicInBoard,
    removeFilterAllEpicInBoard,
  } = props;
  const ref = useRef();
  const [showListItems, setShowListItem] = useState(false);
  const checkedNoEpic = true;

  useOnClickOutside(ref, () => setShowListItem(false));
  const epics = epicsBoard[boardActive._id].filter((epic) => epic._id);
  const handleCheck = (item) => {
    const isChecked = filter[boardActive._id]?.epics?.selectedEpic
      ?.map((epic) => epic._id)
      .includes(item._id);
    if (!isChecked) {
      filterEpicInBoard(boardActive._id, item);
    } else {
      removeFilterEpicInBoard(boardActive._id, item);
    }
  };

  const handleCheckNoMember = () => {
    if (filter[boardActive._id]?.epics?.isNoEpic) {
      filterNoEpicInTicket(
        boardActive._id,
        !filter[boardActive._id]?.epics?.isNoEpic
      );
    } else {
      filterNoEpicInTicket(boardActive._id, checkedNoEpic);
    }
  };

  const handleCheckAll = (epics) => {
    const isCheckedAll = filter[boardActive._id]?.epics?.selectedEpic?.map(
      (epic) => epic._id
    );
    if (isCheckedAll?.length > 0) {
      removeFilterAllEpicInBoard(boardActive._id, epics);
    } else {
      filterAllEpicInBoard(boardActive._id, epics);
    }
  };
  return (
    <div className="board-filter_content_section_item">
      <h3>Epics</h3>
      <ul>
        <li>
          <input
            type="checkbox"
            id="noEpic"
            checked={filter[boardActive._id]?.epics?.isNoEpic ? true : false}
            onChange={() => handleCheckNoMember()}
          />
          <label htmlFor="noEpic">
            <div className="board-filter_content_section_item-wrapper">
              <span className="board-filter_content_section_item_icon">
                <AiOutlinePicRight />
              </span>
              <span className="board-filter_content_section_item_content">
                No Epics
              </span>
            </div>
          </label>
        </li>
        {epicsBoard[boardActive._id]
          .map((epic) => (
            <li key={epic._id}>
              <input
                type="checkbox"
                id={epic._id}
                checked={
                  filter[boardActive._id]?.epics?.selectedEpic
                    ?.map((item) => item._id)
                    .includes(epic._id)
                    ? true
                    : false
                }
                onChange={() => handleCheck(epic)}
              />
              <label
                className="board-filter_content_section_item-wrapper"
                htmlFor={epic._id}
              >
                <span
                  className="epic-name"
                  style={{ border: `2px solid ${epic.color}` }}
                >
                  {epic.name}
                </span>
              </label>
            </li>
          ))
          .slice(0, 3)}
        <li style={{ paddingBottom: 4 }}>
          <input
            type="checkbox"
            checked={
              filter[boardActive._id]?.epics?.selectedEpic?.map(
                (epic) => epic._id
              ).length > 0
                ? true
                : false
            }
            onChange={() => handleCheckAll(epics)}
          />
          <span className="select-items">
            <div className="board-filter_content_section_item-wrapper">
              <button
                className="board-filter_content_section_item_dropdown"
                placeholder="Select Epics"
                onClick={() => setShowListItem(!showListItems)}
              >
                {filter[boardActive._id]?.epics?.selectedEpic?.length || 0} epic
                selected
                <span className="board-filter_content_section_item_dropdown_icon">
                  <BsChevronDown />
                </span>
              </button>
            </div>
          </span>
        </li>
        {showListItems && (
          <div className="list-items" ref={ref}>
            <ul>
              {epicsBoard[boardActive._id].map((epic) => (
                <li key={epic._id}>
                  <input
                    type="checkbox"
                    id={epic._id}
                    checked={
                      filter[boardActive._id]?.epics?.selectedEpic
                        ?.map((item) => item._id)
                        .includes(epic._id)
                        ? true
                        : false
                    }
                    onChange={() => handleCheck(epic)}
                  />
                  <label
                    className="board-filter_content_section_item-wrapper"
                    htmlFor={epic._id}
                  >
                    <span
                      className="epic-name"
                      style={{ border: `2px solid ${epic.color}` }}
                    >
                      {epic.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  boardActive: state.boards.boardActive,
  epicsBoard: state.epics.epicsBoard,
  filter: state.boards.filter,
});

const mapDispatchToProps = {
  filterEpicInBoard,
  removeFilterEpicInBoard,
  filterNoEpicInTicket,
  filterAllEpicInBoard,
  removeFilterAllEpicInBoard,
};
export default connect(mapStateToProps, mapDispatchToProps)(BoardFilterEpics);
