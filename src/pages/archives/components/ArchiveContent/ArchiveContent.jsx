import { BiSearch } from "react-icons/bi";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { useEffect } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { MdRestore } from "react-icons/md";
import { connect } from "react-redux";
import {
  fetchArchivedItems,
  restoreArchivedItems,
  deleteArchivedItems,
} from "modules/archives/archives.action";
import useTable from "hooks/useTable";
import ArchiveContentFooter from "./ArchiveContentFooter";
import withRouter from "hocs/withRouter";

const LIMIT_ROWS_PER_PAGE = 5;

const ArchiveContent = (props) => {
  const {
    navigate,
    object,
    fetchArchivedItems,
    archivedItems,
    restoreArchivedItems,
    deleteArchivedItems,
  } = props;
  const [inputSearch, setInputSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const onChangeInputSearch = (e) => {
    setInputSearch(e.target.value);
  };

  const handleDeleteItem = (item, object) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      deleteArchivedItems(item, object);
    }
  };
  const handleRestoreItem = (item, object) => {
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      restoreArchivedItems(item, object);
    }
  };
  const handleRefLinkName = (item, object) => {
    switch (object) {
      case "boards":
        navigate(`/boards/${item._id}`);

        break;
      case "states":
        break;
      case "tickets":
        navigate(`/boards/${item.parent.state.board._id}/ticket/${item._id}`);
        break;
      default:
        break;
    }
  };
  const handleSortingChange = (row) => {
    const sortOrder = row === sortField && order === "asc" ? "desc" : "asc";
    setSortField(row);
    setOrder(sortOrder);
    handleSorting(row, sortOrder);
  };
  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      if (sortField === "name" || sortField === "archivedAt") {
        const sorted = archivedItems[object].sort((a, b) => {
          if (a[sortField] === null) return 1;
          if (b[sortField] === null) return -1;
          if (a[sortField] === null && b[sortField] === null) return 0;
          return (
            a[sortField]
              .toString()
              .localeCompare(b[sortField].toString(), "en", {
                numeric: true,
              }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
        return sorted;
      } else {
        const sorted = archivedItems[object].sort((a, b) => {
          if (a["parent"][sortField].name === null) return 1;
          if (b["parent"][sortField].name === null) return -1;
          if (
            a["parent"][sortField].name === null &&
            b["parent"][sortField].name === null
          )
            return 0;
          return (
            a["parent"][sortField].name
              .toString()
              .localeCompare(b["parent"][sortField].name.toString(), "en", {
                numeric: true,
              }) * (sortOrder === "asc" ? 1 : -1)
          );
        });
        return sorted;
      }
    }
  };
  useEffect(() => {
    fetchArchivedItems(object);
  }, [object]);

  const { slice, range } = useTable(
    archivedItems[object]
      ? archivedItems[object].filter((item) =>
          item.name.toLowerCase().includes(inputSearch.toLowerCase())
        )
      : [],
    page,
    LIMIT_ROWS_PER_PAGE
  );
  return (
    <div className="archive-container">
      <div className="archive-wrapper">
        <div className="archive-content-header">
          <div className="archive-content-header-title">
            <h3>ARCHIVED {object.toUpperCase()}</h3>
          </div>
          <div className="input-search">
            <span>
              <BiSearch size={17} />
            </span>
            <input
              type="search"
              defaultValue={inputSearch}
              onChange={onChangeInputSearch}
              placeholder="Get information by name"
            ></input>
          </div>
        </div>
        <div className="archive-content-table">
          <Table hover responsive className="table-archives">
            <thead>
              <tr>
                <th>ID</th>
                <th onClick={() => handleSortingChange("name")}>Name</th>
                {object === "boards" && (
                  <th onClick={() => handleSortingChange("department")}>
                    Department
                  </th>
                )}
                {object === "states" && (
                  <th onClick={() => handleSortingChange("board")}>Board</th>
                )}
                {object === "states" && (
                  <th onClick={() => handleSortingChange("department")}>
                    Department
                  </th>
                )}
                {object === "tickets" && (
                  <th onClick={() => handleSortingChange("state")}>State</th>
                )}
                {object === "tickets" && (
                  <th onClick={() => handleSortingChange("board")}>Board</th>
                )}
                {object === "tickets" && (
                  <th onClick={() => handleSortingChange("department")}>
                    Department
                  </th>
                )}
                <th onClick={() => handleSortingChange("archivedAt")}>
                  Archived At
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slice?.map((item) => (
                <tr key={item._id}>
                  <td className="item">{item.id}</td>
                  <td className="item">
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRefLinkName(item, object);
                      }}
                    >
                      {item.name}
                    </a>
                  </td>
                  {item.parent?.state && (
                    <td className="item">
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        {item.parent.state.name}
                      </a>
                    </td>
                  )}
                  {item.parent?.board && (
                    <td className="item">
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/boards/${item.parent.board._id}`);
                        }}
                      >
                        {item.parent.board.name}
                      </a>
                    </td>
                  )}
                  {item.parent?.department && (
                    <td className="item">
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/departments`);
                        }}
                      >
                        {item.parent.department.name}
                      </a>
                    </td>
                  )}

                  <td className="item">{item.archivedAt}</td>
                  <td className="item actions">
                    <button
                      className="p-btn"
                      onClick={() => {
                        handleRestoreItem(item, object);
                      }}
                    >
                      <span>
                        <MdRestore size={15} />
                      </span>{" "}
                      Restore
                    </button>
                    <button
                      className="p-btn"
                      onClick={() => {
                        handleDeleteItem(item, object);
                      }}
                    >
                      <span>
                        <BsFillTrashFill size={15} />
                      </span>{" "}
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ArchiveContentFooter
            dataLength={archivedItems[object]?.length}
            range={range}
            slice={slice}
            setPage={setPage}
            page={page}
            limit={LIMIT_ROWS_PER_PAGE}
            inputSearch={inputSearch === ""}
          />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  archivedItems: state.archives.archivedItems,
});
const mapDispatchToProps = {
  fetchArchivedItems,
  restoreArchivedItems,
  deleteArchivedItems,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ArchiveContent));
