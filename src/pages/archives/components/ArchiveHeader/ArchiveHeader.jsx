import React from "react";
import withRouter from "hocs/withRouter";

import { HiOutlineViewBoards } from "react-icons/hi";
import { MdPanoramaVertical } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { SiGoogleclassroom } from "react-icons/si";

const ArchiveHeader = (props) => {
  const { navigate } = props;
  return (
    <>
      <div className="archive-header">
        <div className="archive-header-title">
          <h5>ARCHIVES</h5>
        </div>
        <div className="archive-header-list">
          <div className="archive-header-list-button p-btn">
            <button
              type="button"
              className="btn"
              onClick={() => {
                navigate(`/archived/departments`);
              }}
            >
              <span>
                <SiGoogleclassroom size={18} />
              </span>
              Departments
            </button>
          </div>
          <div className="archive-header-list-button p-btn">
            <button
              type="button"
              className="btn"
              onClick={() => {
                navigate(`/archived/boards`);
              }}
            >
              <span>
                <HiOutlineViewBoards size={18} />
              </span>
              Boards
            </button>
          </div>
          <div className="archive-header-list-button p-btn">
            <button
              type="button"
              className="btn"
              onClick={() => {
                navigate(`/archived/states`);
              }}
            >
              <span>
                <MdPanoramaVertical size={18} />
              </span>
              States
            </button>
          </div>
          <div className="archive-header-list-button p-btn">
            <button
              type="button"
              className="btn"
              onClick={() => {
                navigate(`/archived/tickets`);
              }}
            >
              <span>
                <IoTicketOutline size={18} />
              </span>
              Tickets
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default withRouter(ArchiveHeader);
