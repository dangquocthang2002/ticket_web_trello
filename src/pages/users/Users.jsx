import Block from "components/blocks/Block";
import NavbarHeader from "components/navbar-header/NavbarHeader";
import { fetchUsers } from "modules/users/users.action";
import { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";
import AddUserModal from "./components/AddUserModal";
import UserDetails from "./components/UserDetails";
function Users(props) {
  const { users, fetchUsers, isAdmin } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenAddUserModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
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
        <Block title={"LIST USERS"} isAdmin={isAdmin} add={onOpenAddUserModal}>
          <UserDetails users={users} />
        </Block>
      </div>
      {isModalOpen && <AddUserModal open={isModalOpen} handleCancel={handleCancel} />}
    </>
  );
}

const mapStateToProps = (state) => ({
  users: state.users.listUsers,
  isAdmin: state.users.isAdmin,
});

const mapDispatchToProps = {
  fetchUsers,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
