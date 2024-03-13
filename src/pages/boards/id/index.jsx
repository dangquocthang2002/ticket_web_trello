import React from "react";
import { Outlet } from "react-router-dom";

import Board from "../components/board/Board";
import NavbarHeader from "components/navbar-header/NavbarHeader";

const Home = ({ epicsPage }) => {
  return (
    <>
      <NavbarHeader />
      <Board epicsPage={epicsPage} />
      <Outlet />
    </>
  );
};

export default Home;
