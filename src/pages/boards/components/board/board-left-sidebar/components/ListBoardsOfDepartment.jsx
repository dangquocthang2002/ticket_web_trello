import React from "react";
import { RiFlowChart } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";

const ListBoardsOfDepartment = (props) => {
  const { board } = props;
  const boardId = board._id;
  const { id } = useParams();

  // list-items
  return (
    <Link
      to={`/boards/${boardId}`}
      className={` Link ${boardId === id ? "active" : "list-items"} `}
    >
      <span className="icon">
        <RiFlowChart size={18} />
      </span>
      <p>{board.name}</p>
      {board.viewOnly ? (
        <div className="board-view-only">
          <AiOutlineEye size={18} />
        </div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default ListBoardsOfDepartment;
