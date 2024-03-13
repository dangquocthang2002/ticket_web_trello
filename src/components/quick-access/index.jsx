import React from "react";
import {
  IoIosCalendar,
  IoIosBody,
} from "react-icons/io";
import { IoArchive } from "react-icons/io5";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const NavbarHeader = (props) => {
  const { isAdmin } = props;

  return (
    <div className="quick-access">
        {isAdmin && (
          <div className="quick-access_menuitem">
            <Link to="/archived/boards">
              <IoArchive size={30} />
              <span>Archives</span>
            </Link>
          </div>
        )}
        {isAdmin && (
          <div className="quick-access_menuitem">
            <Link to="/users">
              <IoIosBody size={30} />
              <span>Users</span>
            </Link>
          </div>
        )}
        <div className="quick-access_menuitem">
          <Link to="/departments">
            <IoIosCalendar size={30} />
            <span>Departments</span>
          </Link>
        </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  isAdmin: state.users.isAdmin,
});
export default connect(mapStateToProps)(NavbarHeader);
