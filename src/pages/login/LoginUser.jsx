import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { login, logOut } from "modules/users/users.action";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import { deleteToken } from "utils/LocalStorageHandle";

const LoginUser = (props) => {
  // const navigate = useNavigate();
  const { login, isloading, error, logOut } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await login(email, password);
    if (token) {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    logOut();
    deleteToken();
  }, []);

  return (
    <div className="Login">
      <div className="header container">
        <Link to="/">
          <button color="none" className="btn-logo">
            <img src="./assets/khoawin-single.png" alt="" />
            <h1 className="title">khoawin-Tickets</h1>
          </button>
        </Link>
      </div>
      <div className="formm container">
        <h2 className="header-signin">Log In</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="col">
            <div className="form-group">
              <p className="text-error">{error}</p>
              <label className="tilte">Username</label>
              <Form.Control
                name="username"
                placeholder="username"
                type="text"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="password" className="tilte">
                Password
              </label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                placeholder="password"
                type="password"
                className="form-control "
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <button className="button btn-danger btn" disabled={isloading}>
                {isloading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  error: state.users.error,
  isloading: state.users.isloading,
  user: state.users.user,
});

const mapDispatchToProps = {
  login,
  logOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginUser);
