import React, { Component } from "react";
import Spinner from "components/spinner/Spinner";
import { connect } from "react-redux";
import { formatDate } from "utils/formatDate";
class ActivityPreview extends Component {
  get fullActivity() {
    const activity = this.props.activity;
    switch (activity.type) {
      //1.User
      case "ADD_USER_TO_TICKET":
        return (
          <span>
            added <b>{activity.data.object.name}</b> on this ticket
          </span>
        );
      case "ADD_USER_TO_BOARD":
        return (
          <span>
            added <b>{activity.data.object.name}</b> on this board
          </span>
        );
      case "REMOVE_USER_OUT_OF_TICKET":
        return (
          <span>
            removed <b>{activity.data.object.name}</b> from this ticket
          </span>
        );
      case "REMOVE_USER_OUT_OF_BOARD":
        return (
          <span>
            removed <b>{activity.data.object.name}</b> from this board
          </span>
        );
        case "RESTORE_STATE":
          return (
            <span>
              Restore state <b>{activity.data.object.name}</b> to the board
            </span>
          );
          case "ARCHIVE_STATE":
            return (
              <span>
                Archive state <b>{activity.data.object.name}</b>
              </span>
            );
          

      
      //2.Ticket
      case "UPDATE_TITLE_TICKET":
        return (
          <span>
            change new ticket title <b>{activity.data.object.name}</b> to{" "}
            <b>{activity.data.newObject.name}</b>
          </span>
        );

      case "MOVE_TICKET_TO_COLUMN":
        return (
          <span>
            moved this ticket from <b>{activity.data.oldParent.name} </b> to{" "}
            <b>{activity.data.newParent.name}</b>
          </span>
        );
      case "CREATE_NEW_TICKET":
        return (
          <span>
            added this ticket to <b>{activity.data.parent}</b>
          </span>
        );
        case "RESTORE_TICKET":
          return (
            <span>
              Restore ticket <b>{activity.data.object.name}</b> to the state
            </span>
          );
          case "ARCHIVE_TICKET":
            return (
              <span>
                Archive ticket <b>{activity.data.object.name}</b>
              </span>
            );

      //3. States
      case "ADD_STATE":
        return (
          <span>
            added new state <b>{activity.data.object.name}</b> to this board
          </span>
        );
      case "MOVE_STATE_POSITION":
        return (
          <span>
            moved state <b>{activity.data.object.name}</b>
          </span>
        );
      case "DELETE_STATE":
        return (
          <span>
            delete state <b>{activity.data.object.name}</b>
          </span>
        );
      case "UPDATE_STATE_TITLE":
        return (
          <span>
            change new title this state to <b>{activity.data.newObject.name}</b>
          </span>
        );

      //4. Checklist
      case "USER_DELETE_TASK":
        return (
          <span>
            delete task ticket to <b>{activity.data.object.name}</b>
          </span>
        );
      case "USER_CHANGE_TASK_TITLE":
        return (
          <span>
            change new task title <b>{activity.data.object.name}</b> to{" "}
            <b>{activity.data.newObject.name}</b>
          </span>
        );
      case "USER_ADD_TASK_TO_TICKET":
        return (
          <span>
            added task <b>{activity.data.object.name}</b> to this Checklist
          </span>
        );

      //5. Label
      case "USER_ADD_LABEL_TO_TICKET":
        return (
          <span>
            added new label <b>{activity.data.object.name}</b> to ticket{" "}
            <b>{activity.data.parent}</b>{" "}
          </span>
        );
      case "USER_CREATE_LABEL_TO_BOARD":
        return (
          <span>
            added new lable <b>{activity.data.object.name}</b> to this board{" "}
          </span>
        );
      case "USER_UPDATE_LABEL_INFO":
        return (
          <span>
            update lable info <b>{activity.data.object.name}</b>
          </span>
        );
      case "USER_REMOVE_LABEL_OF_TICKET":
        return (
          <span>
            removed label <b>{activity.data.object.name}</b>{" "}
          </span>
        );
      case "USER_DELETE_LABEL_OF_BOARD":
        return (
          <spanspan>
            delete lable <b>{activity.data.object.name}</b> to this board{" "}
          </spanspan>
        );
      default:
        return "";
    }
  }

  render() {
    const activity = this.props.activity;
    const allUserInBoard = this.props.allUserInBoard;
    const usersBoard = allUserInBoard?.find(
      (user) => user._id === activity.data?.activeUser?._id
    );
    return (
      <>
        {this.props.isLoading && !activity ? (
          <div className="Loading">
            <Spinner />
          </div>
        ) : (
          <div className="activity-preview">
            <div className="activity-preview_profile_avatar">
              <img
                src={
                  usersBoard?.avatar?.path
                    ? `${process.env.REACT_APP_API_URL}/${usersBoard?.avatar?.path}?w=50&h=50`
                    : "/assets/no-avatar-user.png"
                }
                alt=""
              />
            </div>
            <div className="activity-preview_member">
              <span className="activity-preview_member_span">
                {activity.data?.activeUser?.name}
              </span>{" "}
              <span> {this.fullActivity}</span>
            </div>
            <div className="activity-preview_time">
              <div>
                <div>{formatDate(activity.updatedAt)}</div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.activities.isLoading,
});

export default connect(mapStateToProps)(ActivityPreview);
