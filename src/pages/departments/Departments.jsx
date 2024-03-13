import React from "react";
import Department from "./components/department/Department";
import NavbarHeader from "../../components/navbar-header/NavbarHeader";
import Block from "components/blocks/Block";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  fetchDepartmentsByCurrentUser,
  archiveDepartment,
  moveDepartmentAction,
} from "modules/departments/departments.action";
import {
  fetchBoardsByInvitedUser,
  moveGuestDepartmentAction,
} from "modules/boards/boards.action";
import GuestDepartment from "./components/department/GuestDepartment";
import { getSortDepartments } from "modules/departments/departments.selectors";
import { Container, Draggable } from "react-smooth-dnd";
import { getSortGuestDepartments } from "modules/boards/boards.selectors";
class Departments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      departments: [],
      count: 0,
    };
  }
  componentDidMount() {
    if (this.props.isAdmin) {
      this.props.fetchDepartments();
    } else {
      this.props.fetchDepartmentsByCurrentUser(this.props.user._id);
      this.props.fetchBoardsByInvitedUser(this.props.user._id);
    }
  }

  addDepartment = () => {
    this.setState({
      count: this.state.count + 1,
    });

    this.props.addDepartment().then(() => {
      this.setState({
        count: this.state.count - 1,
      });
    });
  };
  archiveDepartment = (department) => {
    if (department) {
      const isConfirmed = window.confirm("Are you sure?");
      if (isConfirmed) {
        this.setState({
          count: this.state.count + 1,
        });
        this.props.archiveDepartment(department).then(() => {
          this.setState({
            count: this.state.count - 1,
          });
        });
      }
    }
  };
  editDepartment = (currentDepartment) => {
    if (currentDepartment._id) {
      this.setState({
        count: this.state.count + 1,
      });
      this.props.updateDepartment(currentDepartment).then(() => {
        this.setState({
          count: this.state.count - 1,
        });
      });
    }
  };

  onDropGuestDepartmentAction = (dropResult) => {
    this.props.moveGuestDepartmentAction(dropResult);
  };
  onDropDepartment = (dropResult) => {
    this.props.moveDepartmentAction(dropResult);
  };
  render() {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Departments | TonyTicket</title>
        </Helmet>
        <NavbarHeader />
        <div className="container-departments">
          <div className="container ">
            <Block
              isAdmin={this.props.isAdmin}
              add={this.addDepartment}
              title={"TONYTECH DEPARTMENTS"}
            >
              {this.state.count > 0 && (
                <div className="spinner-border" role="status"></div>
              )}
              <div className="wrapper">
                <div className="department">
                  <Container
                    groupName="department"
                    orientation="vertical"
                    behaviour="move"
                    dragClass="departments-ghost"
                    dropClass="departments-ghost-drop"
                    dropPlaceholder={{
                      animationDuration: 150,
                      showOnTop: true,
                      className: "departments-drop-preview",
                    }}
                    key={"department"}
                    nonDragAreaSelector=".board-item"
                    getChildPayload={(index) => this.props.departments[index]}
                    dropPlaceholderAnimationDuration={150}
                    onDrop={(dropResult) => this.onDropDepartment(dropResult)}
                  >
                    {this.props.departments?.map((department) => (
                      <Draggable
                        key={department._id ? department._id : department.id}
                      >
                        <Department
                          department={department}
                          editDepartment={this.editDepartment}
                          archiveDepartment={this.archiveDepartment}
                          checkIdDepartment={department.id ? true : false}
                        />
                      </Draggable>
                    ))}
                  </Container>
                </div>
              </div>
            </Block>
            {!this.props.isAdmin && (
              <Block title={"TONYTECH GUEST'S WORKSPACE"}>
                <div className="wrapper">
                  <div className="department">
                    <Container
                      groupName="guest-Department"
                      orientation="vertical"
                      behaviour="move"
                      nonDragAreaSelector=".guest-board-item"
                      dragClass="departments-ghost"
                      dropClass="departments-ghost-drop"
                      dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: "departments-drop-preview",
                      }}
                      getChildPayload={(index) =>
                        this.props.guestUserDepartments[index]
                      }
                      dropPlaceholderAnimationDuration={150}
                      onDrop={(dropResult) =>
                        this.onDropGuestDepartmentAction(dropResult)
                      }
                    >
                      {this.props.guestUserDepartments?.map((department) => (
                        <Draggable
                          key={department._id ? department._id : department.id}
                        >
                          <GuestDepartment department={department} />
                        </Draggable>
                      ))}
                    </Container>
                  </div>
                </div>
              </Block>
            )}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  // departments: state.departments.listDepartments,
  departments: getSortDepartments(state),

  isAdmin: state.users.isAdmin,
  user: state.users.user,
  departmentsOfUser: state.users.currentUserDepartments,
  // guestUserDepartments: state.boards.guestUserDepartments,
  guestUserDepartments: getSortGuestDepartments(state),
});
const mapDispatchToProps = {
  fetchDepartmentsByCurrentUser,
  fetchDepartments,
  fetchBoardsByInvitedUser,
  addDepartment,
  updateDepartment,
  archiveDepartment,
  moveDepartmentAction,
  moveGuestDepartmentAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(Departments);
