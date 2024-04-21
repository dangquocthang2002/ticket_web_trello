import { deleteUserAPI } from "api/users.api";
import Table from "react-bootstrap/Table";
import { MdDelete } from "react-icons/md";
import { toastError } from "utils/toastHelper";

function UserDetails({ users, deleteUser }) {
  const handleDeleteUser = async (user) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      try {
        const res = await deleteUserAPI(user);
        deleteUser(user)
      } catch (error) {
        toastError()
      }
    }
  }
  return (
    <div className="users-list">
      <Table striped>
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user._id}>
              <td>{index}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><MdDelete cursor={"pointer"} onClick={() => { handleDeleteUser(user) }} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
export default UserDetails;
