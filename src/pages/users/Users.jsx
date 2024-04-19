import Block from "components/blocks/Block";
import NavbarHeader from "components/navbar-header/NavbarHeader";
import { useEffect } from "react";
import { connect } from "react-redux";
import UserDetails from "./components/UserDetails";
import Helmet from "react-helmet";
import { fetchUsers } from "modules/users/users.action";
function Users(props) {
  const { users, fetchUsers } = props;
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Users | KhoaWinTicket</title>
      </Helmet>
      <NavbarHeader />
      <div className="container">
        <Block title={"LIST USERS"}>
          <UserDetails users={users} />
        </Block>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  users: state.users.listUsers,
});

const mapDispatchToProps = {
  fetchUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
