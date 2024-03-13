import {
  combineReducers,
  legacy_createStore as createStore,
  applyMiddleware,
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import usersReducer from "./users/users.reducer";
import statesReducer from "./columns/columns.reducer";
import ticketReducer from "./tickets/tickets.reducer";
import boardsReducer from "./boards/boards.reducer";
import departmentsReducer from "./departments/departments.reducer";
import taskReducer from "./ticketTasks/tasks.reducer";
import labelsReducer from "./labels/labels.reducer";
import epicsReducer from "./epics/epics.reducer";
import slackConnectionReducer from "./slackConnection/slackConnection.reducer";

import activitiesReducer from "./activities/activities.reducer";

import archivesReducer from "./archives/archives.reducer";
import filesReducer from "./files/files.reducer";
import socketBoardMiddleware from "modules/sockets/connect/socketMiddleware";
import { socketsReducer } from "./sockets";
import githubConnectionReducer from "./githubConnection/githubConnection.reducer";

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
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk, socketBoardMiddleware))
);
