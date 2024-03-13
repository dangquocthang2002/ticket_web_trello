import React, { useEffect } from "react";
import { BsPerson } from "react-icons/bs";
import { HiOutlineArchive } from "react-icons/hi";

import Boards from "../boards/Boards";
import UsersDepartment from "./UsersDepartment";
import { useState } from "react";
import { fetchUsersDepartment } from "modules/departments/departments.action";
import { connect } from "react-redux";
function NewDepartment(props) {
  const {
    isAdmin,
    department,
    editDepartment,
    archiveDepartment,
    checkIdDepartment,
    departmentsUsers,
    fetchUsersDepartment,
  } = props;
  const [content, setContent] = useState(department.name);
  const [openPopup, setOpenPopup] = useState(false);
  const selectAllInLineText = (e) => {
    e.currentTarget.focus();
    e.currentTarget.select();
  };

  const onDepartmentBlur = () => {
    if (content === "") {
      setContent(department.name);
      return;
    }
    editDepartment({
      _id: department._id,
      name: content,
    });
  };

  const onDepartmentChange = (e) => {
    setContent(e.target.value);
  };

  const onDepartmentArchive = () => {
    archiveDepartment(department);
  };

  useEffect(() => {
    fetchUsersDepartment(department._id);
  }, []);
  return (
    <>
      <div className="department-container">
        <div className="department-container-label">
          <img
            className="navbar-menu_logo_img"
            src={"/assets/tonytech-single.png"}
            alt=""
          />
          {isAdmin ? (
            <input
              onChange={onDepartmentChange}
              onClick={selectAllInLineText}
              onBlur={onDepartmentBlur}
              value={content}
              type="text"
              placeholder="Enter Department Name"
            ></input>
          ) : (
            <input defaultValue={content} type="text" readOnly={true}></input>
          )}
        </div>
        <div className="department-container-logo">
          <div className="department-container-logo_button">
            <button
              type="button"
              className="btn btn-member"
              onClick={() => setOpenPopup(!openPopup)}
            >
              <BsPerson size={18} />
              <span>
                {departmentsUsers[department._id]
                  ? departmentsUsers[department._id].length
                  : ""}{" "}
                Members
              </span>
            </button>
            {openPopup && (
              <UsersDepartment
                setOpenPopup={setOpenPopup}
                department_Id={department._id}
              />
            )}
            {isAdmin && (
              <button
                type="button"
                className="btn btn-setting"
                onClick={onDepartmentArchive}
              >
                <HiOutlineArchive size={18} />
                <span>Archive</span>
              </button>
            )}
          </div>
        </div>
        <Boards
          department={department._id || department.id}
          checkIdDepartment={checkIdDepartment}
        />
      </div>
      <hr />
    </>
  );
}
const mapStateToProps = (state) => ({
  departmentsUsers: state.departments.departmentsUsers,
  isAdmin: state.users.isAdmin,
});

const mapDispatchToProps = {
  fetchUsersDepartment,
};
export default connect(mapStateToProps, mapDispatchToProps)(NewDepartment);
