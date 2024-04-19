import { Outlet } from "react-router-dom";
import NavbarHeader from "../../components/navbar-header/NavbarHeader";
import ArchiveHeader from "./components/ArchiveHeader/ArchiveHeader";

import Helmet from "react-helmet";

const Archives = (props) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Archives | KhoaWinTicket</title>
      </Helmet>
      <NavbarHeader />
      <div className="content-wrapper">
        <ArchiveHeader />
        <Outlet />
      </div>
    </>
  );
};

export default Archives;
