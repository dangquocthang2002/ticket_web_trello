import React, { useState } from "react";
import { connect } from "react-redux";
import { useRef } from "react";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { BsTag, BsChevronDown } from "react-icons/bs";
import {
  filterLabelInBoard,
  removeFilterLabelInBoard,
  filterNoLabelInTicket,
  filterAllLabelInBoard,
  removeFilterAllLabelInBoard,
} from "modules/boards/boards.action";

const BoardFilterLabels = (props) => {
  const {
    boardLabels,
    boardActive,
    filter,
    filterLabelInBoard,
    removeFilterLabelInBoard,
    filterNoLabelInTicket,
    filterAllLabelInBoard,
    removeFilterAllLabelInBoard,
  } = props;
  const ref = useRef();
  const [showListItems, setShowListItem] = useState(false);
  const checkedNoLabel = true;
  useOnClickOutside(ref, () => setShowListItem(false));
  const handleCheck = (item) => {
    const isChecked = filter[boardActive._id]?.labels?.selectedLabel
      ?.map((label) => label._id)
      .includes(item._id);
    if (!isChecked) {
      filterLabelInBoard(boardActive._id, item);
    } else {
      removeFilterLabelInBoard(boardActive._id, item);
    }
  };
  const handleCheckNoLabel = () => {
    if (filter[boardActive._id]?.labels?.isNoLabel) {
      filterNoLabelInTicket(
        boardActive._id,
        !filter[boardActive._id]?.labels?.isNoLabel
      );
    } else {
      filterNoLabelInTicket(boardActive._id, checkedNoLabel);
    }
  };
  const labels = boardLabels
    .find((i) => i.boardId === boardActive._id)
    .labels.filter((item) => item._id);
  const handleCheckAll = (labels) => {
    const isCheckedAll = filter[boardActive._id]?.labels?.selectedLabel?.map(
      (label) => label._id
    );
    if (isCheckedAll?.length > 0) {
      removeFilterAllLabelInBoard(boardActive._id, labels);
    } else {
      filterAllLabelInBoard(boardActive._id, labels);
    }
  };
  return (
    <div className="board-filter_content_section_item">
      <h3>Labels</h3>
      <ul>
        <li>
          <input
            type="checkbox"
            id="noLabel"
            checked={filter[boardActive._id]?.labels?.isNoLabel ? true : false}
            onChange={() => handleCheckNoLabel()}
          />
          <label htmlFor="noLabel">
            <div className="board-filter_content_section_item-wrapper">
              <span className="board-filter_content_section_item_icon">
                <BsTag />
              </span>
              <span className="board-filter_content_section_item_content">
                No labels
              </span>
            </div>
          </label>
        </li>
        {boardLabels.find((i) => i.boardId === boardActive._id) &&
          boardLabels
            .find((i) => i.boardId === boardActive._id)
            .labels.map((item) => {
              return (
                <li key={item._id}>
                  <input
                    type="checkbox"
                    id={item._id}
                    checked={
                      filter[boardActive._id]?.labels?.selectedLabel
                        ?.map((label) => label._id)
                        .includes(item._id)
                        ? true
                        : false
                    }
                    onChange={() => handleCheck(item)}
                  />
                  <label
                    className="board-filter_content_section_item-wrapper"
                    htmlFor={item._id}
                  >
                    <span
                      className="labels-list_detail_color"
                      key={item._id}
                      style={{ backgroundColor: item.color }}
                    >
                      <h4>{item.name}</h4>
                    </span>
                  </label>
                </li>
              );
            })
            .slice(0, 3)}
        <li style={{ paddingBottom: 4 }}>
          <input
            type="checkbox"
            checked={
              filter[boardActive._id]?.labels?.selectedLabel?.map(
                (label) => label._id
              ).length > 0
                ? true
                : false
            }
            onChange={() => handleCheckAll(labels)}
          />
          <span className="select-items">
            <div className="board-filter_content_section_item-wrapper">
              <button
                className="board-filter_content_section_item_dropdown"
                placeholder="Select Labels"
                onClick={() => setShowListItem(!showListItems)}
              >
                {filter[boardActive._id]?.labels?.selectedLabel?.length || 0}{" "}
                label selected
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
              {boardLabels.find((i) => i.boardId === boardActive._id) &&
                boardLabels
                  .find((i) => i.boardId === boardActive._id)
                  .labels.map((item) => {
                    return (
                      <li key={item._id}>
                        <input
                          type="checkbox"
                          id={item._id}
                          checked={
                            filter[boardActive._id]?.labels?.selectedLabel
                              ?.map((label) => label._id)
                              .includes(item._id)
                              ? true
                              : false
                          }
                          onChange={() => handleCheck(item)}
                        />
                        <label
                          className="board-filter_content_section_item-wrapper"
                          htmlFor={item._id}
                        >
                          <span
                            className="labels-list_detail_color"
                            key={item._id}
                            style={{ backgroundColor: item.color }}
                          >
                            <h4>{item.name}</h4>
                          </span>
                        </label>
                      </li>
                    );
                  })}
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => ({
  boardLabels: state.labels.boardLabels,
  boardActive: state.boards.boardActive,
  filter: state.boards.filter,
});

const mapDispatchToProps = {
  filterLabelInBoard,
  removeFilterLabelInBoard,
  filterNoLabelInTicket,
  filterAllLabelInBoard,
  removeFilterAllLabelInBoard,
};
export default connect(mapStateToProps, mapDispatchToProps)(BoardFilterLabels);
