import React from "react";
import {
  IoIosNotificationsOutline,
  IoIosCalendar,
  IoIosBody,
} from "react-icons/io";
import { IoArchive } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useState } from "react";
import ProfilePopup from "components/profile-popup/ProfilePopup";

const NavbarHeader = (props) => {
  const { isAdmin } = props;
  const [showProfilePopup, setshowProfilePopup] = useState(false);

  return (
    <div className="navbar-menu">
      <div className="navbar-menu_logo">
        <img
          className="navbar-menu_logo_img"
          src={"/assets/khoawin-single.png"}
          alt=""
        />
        <Link to={"/"}>KhoaWinTicket</Link>
      </div>
      <div className="navbar-menu_l">
        {isAdmin && (
          <div className="navbar-menu_l_userDepartment">
            <Link to="/archived/boards">
              <IoArchive size={30} />
              <span>Archives</span>
            </Link>
          </div>
        )}
        {isAdmin && (
          <div className="navbar-menu_l_userDepartment">
            <Link to="/users">
              <IoIosBody size={30} />
              <span>Users</span>
            </Link>
          </div>
        )}
        <div className="navbar-menu_l_userDepartment">
          <Link to="/departments">
            <IoIosCalendar size={30} />
            <span>Departments</span>
          </Link>
        </div>
        <div className="navbar-menu_l_search">
          <span className="search-icon">
            <BsSearch className="bs" />
          </span>
          <span>
            <input type="" placeholder="Search" />
          </span>
        </div>
        <div className="navbar-menu_l_notification">
          <button>
            <IoIosNotificationsOutline size={20} />
          </button>
        </div>
        <div className="navbar-menu_l_profileview">
          <button onClick={() => setshowProfilePopup(!showProfilePopup)}>
            <CgProfile size={20} />
          </button>
          {/* <button>
            <CgProfile size={20} />
          </button> */}
        </div>
        {showProfilePopup && (
          <ProfilePopup setshowProfilePopup={setshowProfilePopup} />
        )}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,
});
export default connect(mapStateToProps)(NavbarHeader);
