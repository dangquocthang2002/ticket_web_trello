import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { HiOutlineX } from "react-icons/hi";
import { FiCheckSquare } from "react-icons/fi";
import { connect } from "react-redux";
import {
  addTaskToTicket,
  deleteTask,
  updateTicketTask,
} from "modules/ticketTasks/tasks.action";
import withRouter from "hocs/withRouter";
import { useState } from "react";
import { toastError } from "utils/toastHelper";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";
const TicketTasks = (props) => {
  const {
    ticketTasks,
    addTaskToTicket,
    deleteTask,
    updateTicketTask,
    params,
    showToastOneTime,
    setShowToastOneTime,
    boardViewOnly,
  } = props;
  const { ticketId } = params;
  const [textAreaTaskId, setTextAreaTaskId] = useState(null);
  const [textAreaContent, setTextAreaContent] = useState("");
  const [openAddTicketTaskForm, setOpenAddTicketTaskForm] = useState(false);
  const [textAddTicketTask, setTextAddTicketTask] = useState("");

  const onChangeContentTask = (e) => {
    setTextAreaContent(e.target.value);
  };

  const onChangeTextAddTicketTask = (e) => {
    setTextAddTicketTask(e.target.value);
  };

  const onCloseTicketTaskFormAdd = () => {
    setOpenAddTicketTaskForm(false);
    setTextAddTicketTask("");
  };

  const onCloseTicketTaskFormUpdate = () => {
    setTextAreaTaskId(null);
    setTextAreaContent("");
  };

  const onAddNewTicketTask = () => {
    if (boardViewOnly) {
      return;
    }
    if (textAddTicketTask === "") {
      return;
    }
    onCloseTicketTaskFormAdd();
    addTaskToTicket(ticketId, textAddTicketTask.trim());
  };

  const onUpdateTicketTask = (clickCheckBox, task) => {
    if (boardViewOnly) {
      if (showToastOneTime !== "task") {
        toastError("Just View Board Only");
        setShowToastOneTime(() => "task");
      }
      return;
    }
    if (!task._id) {
      return;
    }
    onCloseTicketTaskFormAdd();
    if (clickCheckBox) {
      onCloseTicketTaskFormUpdate();
      task.status = task.status === "complete" ? "active" : "complete";
      updateTicketTask(ticketId, task);
    } else {
      if (textAreaContent === "") {
        return;
      }
      onCloseTicketTaskFormUpdate();
      task.name = textAreaContent;
      updateTicketTask(ticketId, task);
    }
  };

  const onOpenTextAreaTask = (task) => {
    if (boardViewOnly) {
      return;
    }
    if (task._id) {
      setTextAreaTaskId(task._id);
      setTextAreaContent(task.name);
    }
  };
  const percentageTask = Math.floor(
    100 *
      (ticketTasks[ticketId]?.filter((task) => task.status === "complete")
        .length /
        ticketTasks[ticketId]?.length)
  );
  return (
    <>
      <div className="card-detail_checklist">
        <span className="window-module-title-icon icon-lg icon-checklist">
          <FiCheckSquare size={22} />
        </span>
        <div className="card-detail_checklist_title card-module-title">
          <h3>Checklist</h3>
        </div>
      </div>
      <div className="checklist">
        {ticketTasks[ticketId]?.length > 0 && (
          <div className="checklist-progress">
            <span className="checklist-progress-percentage ">
              {percentageTask}%
            </span>
            <div className="checklist-progress-bar">
              {percentageTask === 100 ? (
                <ProgressBar
                  variant="success"
                  now={percentageTask}
                  className="container"
                />
              ) : (
                <ProgressBar
                  animated
                  now={percentageTask}
                  className="container"
                />
              )}
            </div>
          </div>
        )}
        <ul
          className="checklist-items-list"
          hidden={ticketTasks[ticketId]?.length <= 0}
        >
          {ticketTasks[ticketId]?.map((task) => (
            <li key={task._id ? task._id : task.id} className="checklist-item">
              <div className="checklist-item-checkbox">
                {task.status === "complete" ? (
                  <input
                    type="checkbox"
                    className="checklist-item-checkbox complete"
                    checked={true}
                    onChange={() => onUpdateTicketTask(true, task)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => onUpdateTicketTask(true, task)}
                  />
                )}
              </div>
              <div className="checklist-item-content">
                <div className="item-title">
                  {textAreaTaskId === task._id ? (
                    <div className="item-title-edit">
                      <input
                        defaultValue={task._id ? task.name : task.content.name}
                        onChange={onChangeContentTask}
                        autoFocus
                      ></input>
                      <button
                        className="btn-edit-item save"
                        onClick={() => onUpdateTicketTask(false, task)}
                      >
                        <span>Save</span>
                      </button>
                      <button
                        className="btn-edit-item cancel"
                        onClick={() => {
                          onCloseTicketTaskFormUpdate();
                        }}
                      >
                        <HiOutlineX size={21} />
                      </button>
                    </div>
                  ) : task.status === "complete" ? (
                    <span
                      className="complete"
                      onClick={() => {
                        onCloseTicketTaskFormAdd();
                        onOpenTextAreaTask(task);
                      }}
                    >
                      {task._id ? task.name : task.content.name}
                    </span>
                  ) : (
                    <span
                      onClick={() => {
                        onCloseTicketTaskFormAdd();
                        onOpenTextAreaTask(task);
                      }}
                    >
                      {task._id ? task.name : task.content.name}
                    </span>
                  )}
                </div>
                <div className="item-btn-delete">
                  {boardViewOnly ? (
                    <></>
                  ) : (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        if (task._id) {
                          const isConfirmed = window.confirm("Are you sure?");
                          onCloseTicketTaskFormAdd();
                          if (isConfirmed) {
                            deleteTask(ticketId, task._id);
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="editable checklist-new-item">
          {boardViewOnly ? (
            <></>
          ) : openAddTicketTaskForm ? (
            <div className="checklist-new-item-form">
              <input
                placeholder="Add an item"
                onChange={onChangeTextAddTicketTask}
                autoFocus
              ></input>
              <button className="btn-new-item add" onClick={onAddNewTicketTask}>
                <span>Add</span>
              </button>
              <button
                className="btn-new-item cancel"
                onClick={onCloseTicketTaskFormAdd}
              >
                <span>Cancel</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-new-item"
              onClick={() => {
                setOpenAddTicketTaskForm(true);
                onCloseTicketTaskFormUpdate();
              }}
            >
              <span>Add an item</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  ticketTasks: state.tasks.ticketTasks,
  boardViewOnly: boardViewOnlySelector(state),
});

const mapDispatchToProps = {
  addTaskToTicket,
  deleteTask,
  updateTicketTask,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TicketTasks));
