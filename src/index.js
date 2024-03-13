import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";

import { store } from "modules/index";
import UsersProvider from "contexts/users/users.provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
const root = ReactDOM.createRoot(document.getElementById("root"));
if (!sessionStorage.getItem("client_id")) {
  sessionStorage.setItem("client_id", uuidv4());
}
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <UsersProvider>
        <ToastContainer />
        <App />
      </UsersProvider>
    </Router>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
