import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import boardsReducer from "./boards/boards.reducer";
import statesReducer from "./columns/columns.reducer";
import departmentsReducer from "./departments/departments.reducer";
import epicsReducer from "./epics/epics.reducer";
import labelsReducer from "./labels/labels.reducer";
import slackConnectionReducer from "./slackConnection/slackConnection.reducer";
import taskReducer from "./ticketTasks/tasks.reducer";
import ticketReducer from "./tickets/tickets.reducer";
import usersReducer from "./users/users.reducer";

import activitiesReducer from "./activities/activities.reducer";

import socketBoardMiddleware from "modules/sockets/connect/socketMiddleware";
import archivesReducer from "./archives/archives.reducer";
import filesReducer from "./files/files.reducer";
import githubConnectionReducer from "./githubConnection/githubConnection.reducer";
import notificationsReducer from "./notifications/notifications.reducer";
import { socketsReducer } from "./sockets";

export const rootReducer = combineReducers({
  activities: activitiesReducer,
  users: usersReducer,
  boards: boardsReducer,
  states: statesReducer,
  tickets: ticketReducer,
  departments: departmentsReducer,
  tasks: taskReducer,
  labels: labelsReducer,
  epics: epicsReducer,
  archives: archivesReducer,
  slackConnection: slackConnectionReducer,
  files: filesReducer,
  sockets: socketsReducer,
  githubConnection: githubConnectionReducer,
  notifications: notificationsReducer,
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, socketBoardMiddleware))
);
