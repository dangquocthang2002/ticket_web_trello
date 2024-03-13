import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import BoardId from "./pages/boards/id";

import LoginUser from "./pages/login/LoginUser";
import NotFound from "./pages/errors/NotFound";
import TicketsDetail from "./pages/ticket/TicketsDetail";
import ProtectedRoute from "./hocs/ProtectedRoute";
import Department from "./pages/departments/Departments";
// import  UserProvider   from "./contexts/user-provider/UserProvider";
import { TicketsProvider } from "contexts/tickets-provider/TicketProvider";
import "./sass/index.scss";
import Users from "pages/users/Users";
import UsersBoard from "pages/boards/components/board/users-board/UsersBoard";
import Archives from "./pages/archives/Archives";
import ArchiveContent from "pages/archives/components/ArchiveContent/ArchiveContent";
// import ArchiveContent from "./pages/archives/components/ArchiveContent/ArchiveContent";
import Profile from "pages/profile/Profile";
import useNetwork from "hooks/useNetwork";
import DisconnectToast from "components/networkConnection/DisconnectToast";
const App = () => {
  const network = useNetwork();
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
