import React from "react";
import { Navigate } from "react-router-dom"
import { connect } from "react-redux";

const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
const mapStateToProps = state => (
  {
    isLoggedIn: state.users.isLoggedIn
  }
)

export default connect(mapStateToProps)(ProtectedRoute);