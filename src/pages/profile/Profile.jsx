import NavbarHeader from "components/navbar-header/NavbarHeader";
import { React, useState, useEffect } from "react";
import { connect } from "react-redux";
import { BsFillCameraFill } from "react-icons/bs";
import { getMe } from "modules/users/users.action";
import { updateProfile } from "modules/users/users.action";
import { useDispatch } from "react-redux";
import { toastSuccess, toastError } from "utils/toastHelper";

function Profile(props) {
  const { getMe, me } = props;
  const [newFiles, setNewFiles] = useState("");
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const uploadFiles = async () => {
    if (!file) {
      return;
    }

    try {
      setLoading(true);
      await dispatch(updateProfile(file));
      document.getElementById("files-input").value = "";
      
      toastSuccess("You have updated new profile!");
    } catch (err) {
      toastError(err.message || "Network error");
    }

    setLoading(false);
  };
  const onChangeProfileAvatar = (e) => {
    setNewFiles(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    getMe();
  }, []);

  useEffect(() => {
    if (me.avatar) {
      setNewFiles(`${process.env.REACT_APP_API_URL}/${me.avatar?.path}`);
    }
  }, [me.avatar]);

  return (
    <>
      <NavbarHeader />
      <div className="content-wrapper">
        <div className="profile-user">
          <div className="profile-user_avatar">
            <label htmlFor="files-input" style={{ display: `unset` }}>
              <img
                src={newFiles ? `${newFiles}` : "/assets/no-avatar-user.png"}
                alt=""
                className="profile-user_avatar_img"
              />
            </label>
          </div>
          <div className="profile-user_icon">
            <label htmlFor="files-input" style={{ display: `unset` }}>
              <button>
                <BsFillCameraFill size={20} />
              </button>
            </label>
          </div>
          <input
            id="files-input"
            type="file"
            style={{ display: `none` }}
            multiple
            onChange={(e) => onChangeProfileAvatar(e)}
          />

          <div className="profile-user_content">
            <div className="profile-user_content_section">
              <h3>Usename</h3>
              <input
                disabled="disabled"
                placeholder="Enter a keyword... "
                className="profile-user_input"
                value={me?.username || ""}
              />
            </div>
            <div className="profile-user_content_section">
              <h3>Email</h3>
              <input
                disabled="disabled"
                placeholder="Enter a keyword... "
                className="profile-user_input"
                value={me?.email || ""}
              />
            </div>
            <div className="profile-user_content_section">
              <button
                className="create-btn"
                onClick={() => uploadFiles()}
                disabled={loading}
              >
                Save {loading ? "..." : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  me: state.users.me,
});

const mapDispatchToProps = {
  getMe,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
