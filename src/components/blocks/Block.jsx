import React from "react";
import { GrFormAdd } from "react-icons/gr";

function Block(props) {
  const { title, add, isAdmin } = props;
  return (
    <div className="block">
      <div className="block-header">
        <h3>{title}</h3>
        {isAdmin && (
          <GrFormAdd className="block-header_button" size={24} onClick={add} />
        )}
      </div>
      {props.children}
    </div>
  );
}

export default Block;
