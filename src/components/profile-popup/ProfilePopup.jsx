import React, { useRef } from "react";
import { BsXLg } from "react-icons/bs";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "hooks/useOnClickOutside";

const ProfilePopup = (props) => {
  const { setshowProfilePopup } = props;
  const ref = useRef();
  useOnClickOutside(ref, () => setshowProfilePopup(false));

  return (
    <div className="profile-popup" ref={ref}>
      <div className="profile-popup_header">
        <span className="profile-popup_header_title">Account</span>
        <button
          className="profile-popup_header_close-btn"
          onClick={() => setshowProfilePopup(false)}
        >
          <BsXLg size={11} />
        </button>
      </div>
      <div className="profile-popup_content">
        <div className="profile-popup_content_section">
          <Link to="/profile">
            <span className="profile-popup_content_section_item">
              Profile management
            </span>
          </Link>
        </div>
        <div className="profile-popup_content_section">
          <Link to="/login">
            <span className="profile-popup_content_section_item">Log out</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePopup);
