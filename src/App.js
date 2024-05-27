import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import BoardId from "./pages/boards/id";
import Home from "./pages/home/Home";

import ProtectedRoute from "./hocs/ProtectedRoute";
import Department from "./pages/departments/Departments";
import NotFound from "./pages/errors/NotFound";
import LoginUser from "./pages/login/LoginUser";
import TicketsDetail from "./pages/ticket/TicketsDetail";
// import  UserProvider   from "./contexts/user-provider/UserProvider";
import { TicketsProvider } from "contexts/tickets-provider/TicketProvider";
import ArchiveContent from "pages/archives/components/ArchiveContent/ArchiveContent";
import UsersBoard from "pages/boards/components/board/users-board/UsersBoard";
import Users from "pages/users/Users";
import Archives from "./pages/archives/Archives";
import "./sass/index.scss";
// import ArchiveContent from "./pages/archives/components/ArchiveContent/ArchiveContent";
import DisconnectToast from "components/networkConnection/DisconnectToast";
import useNetwork from "hooks/useNetwork";
import { getListNotificationsUnSeen } from "modules/notifications/notifications.action";
import {
  connectSocketNotification,
  disConnectSocketNotification,
} from "modules/sockets/sockets.action";
import Profile from "pages/profile/Profile";
import { useDispatch } from "react-redux";
const App = () => {
  const network = useNetwork();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connectSocketNotification());
    dispatch(getListNotificationsUnSeen());
    return () => dispatch(disConnectSocketNotification());
  }, []);
  return (
    <TicketsProvider>
      <div className="container-fluid">
        <Routes>
          <Route path="/login" element={<LoginUser />} />
          <Route
            path="/boards/:id"
            element={
              <ProtectedRoute>
                <BoardId />
              </ProtectedRoute>
            }
          >
            <Route
              path="members"
              element={
                <ProtectedRoute>
                  <UsersBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="ticket/:ticketId"
              element={
                <ProtectedRoute>
                  <TicketsDetail />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/boards/:id/epics"
            element={
              <ProtectedRoute>
                <BoardId epicsPage={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path={"/departments"}
            element={
              <ProtectedRoute>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archived"
            element={
              <ProtectedRoute>
                <Archives />
              </ProtectedRoute>
            }
          >
            <Route
              path="departments"
              element={
                <ProtectedRoute>
                  <ArchiveContent object={"departments"} />
                </ProtectedRoute>
              }
            />
            <Route
              path="boards"
              element={
                <ProtectedRoute>
                  <ArchiveContent object={"boards"} />
                </ProtectedRoute>
              }
            />
            <Route
              path="states"
              element={
                <ProtectedRoute>
                  <ArchiveContent object={"states"} />
                </ProtectedRoute>
              }
            />
            <Route
              path="tickets"
              element={
                <ProtectedRoute>
                  <ArchiveContent object={"tickets"} />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path={"/"}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={"/profile"}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {network ? <></> : <DisconnectToast />}
      </div>
    </TicketsProvider>
  );
};
export default App;
