import withRouter from "hocs/withRouter";
import { connect } from "react-redux";
import Table from "react-bootstrap/Table";
import ProgressBar from "react-bootstrap/ProgressBar";
import { deleteEpic, fetchEpicsByBoard } from "modules/epics/epics.action";
import { useEffect, useState } from "react";
import useTable from "hooks/useTable";
import EpicsTableFooter from "./components/EpicsTableFooter";
import AddEpic from "./components/AddEpic";
import { SiEpicgames } from "react-icons/si";
import { BiSearch } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";
import { GiAutoRepair } from "react-icons/gi";
import { fetchStatesByBoard } from "modules/columns/columns.action";
import { getStates } from "modules/columns/columns.selectors";
import { toastError } from "utils/toastHelper";
import { boardViewOnlySelector } from "modules/boards/boards.selectors";

const LIMIT_ROWS_PER_PAGE = 5;

const BoardEpics = (props) => {
  const {
    params,
    epicsBoard,
    states,
    deleteEpic,
    fetchStatesByBoard,
    fetchEpicsByBoard,
    isAdmin,
    boardViewOnly,
  } = props;
  const [page, setPage] = useState(1);
  const [openFormUpdateEpic, setOpenFormUpdateEpic] = useState(false);
  const [openEpicFormAdd, setOpenEpicFormAdd] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const { id } = params;

  const onChangInputSearch = (e) => {
    setInputSearch(e.target.value);
  };
  const onDeleteEpic = (epic) => {
    if (!isAdmin) {
      toastError("You are not allowed to delete");
      return;
    }
    const isConfirmed = window.confirm("Are you sure?");
    if (isConfirmed) {
      deleteEpic(epic);
    }
  };

  useEffect(() => {
    fetchStatesByBoard(id);
    fetchEpicsByBoard(id);
  }, []);

  const data = epicsBoard[id]
    ? [
        ...(epicsBoard[id]
          ?.map((epic) => {
            const ticketsDoneEpic =
              epic.tickets.filter(
                (ticket) =>
                  states
                    ?.find((state) => state._id === ticket.state)
                    ?.name.toLowerCase() === "done"
              ).length > 0
                ? epic.tickets.filter(
                    (ticket) =>
                      states
                        ?.find((state) => state._id === ticket.state)
                        ?.name.toLowerCase() === "done"
                  ).length / epic?.tickets?.length
                : 0;
            return {
              ...epic,
              theme: epic.color ? (
                <div
                  className="themeColor"
                  style={{ backgroundColor: epic.color }}
                ></div>
              ) : (
                "-"
              ),
              startedDate: epic.startedDate?.slice(0, 10),
              endedDate: epic.endedDate?.slice(0, 10),
              countTickets: epic.tickets.length > 0 ? epic.tickets.length : "-",
              progress: ticketsDoneEpic,
              points: epic.tickets
                .map((ticket) => ticket.estimatePoints || 0)
                .reduce((rs, item) => rs + item, 0),
            };
          })
          .sort((a, b) => a.createdAt - b.createdAt) || []),
      ]
    : [];
  const { slice, range } = useTable(
    data?.filter((epic) =>
      epic.name.toLowerCase().includes(inputSearch.toLowerCase())
    ),
    page,
    LIMIT_ROWS_PER_PAGE
  );
  return (
    <div className="board-epics-container">
      <div className="board-epics-wrapper ">
        <div className="board-epics-header">
          <div className="board-epics-header-title">
            <h3>Epics of board</h3>
            {boardViewOnly ? (
              <></>
            ) : (
              <button
                type="button"
                className="p-btn"
                onClick={() => setOpenEpicFormAdd((prev) => true)}
              >
                <span className="sh">
                  <SiEpicgames size={17} />
                </span>
                New Epic
              </button>
            )}
          </div>
          <div className="inp-search">
            <span>
              <BiSearch size={17} />
            </span>
            <input
              type="search"
              defaultValue={inputSearch}
              onChange={onChangInputSearch}
              placeholder="filter epics by name"
            ></input>
          </div>
          {openEpicFormAdd && (
            <AddEpic
              epics={epicsBoard[id]}
              setOpenEpicFormAdd={setOpenEpicFormAdd}
            />
          )}
        </div>

        <Table hover responsive className="table-epics">
          <thead>
            <tr>
              <th className="column_id_row">ID</th>
              <th>Name</th>
              <th>Tickets</th>
              <th>Point</th>
              <th>Progress</th>
              <th>Theme</th>
              <th>Start</th>
              <th>Due</th>
              <th>Update At</th>
              {boardViewOnly ? <></> : <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {slice.map((dt) => (
              <tr
                className={`${
                  openFormUpdateEpic?._id === dt._id ? "item-active" : ""
                }`}
                key={dt._id ? dt._id : dt.id}
              >
                <td className="item id column_id_row">
                  <span>{dt?._id}</span>
                </td>
                <td className="item name">
                  <span>{dt.name}</span>
                </td>
                <td className="item number ticket">{dt.countTickets}</td>
                <td className="item number point">
                  {dt.points === 0 ? "-" : dt.points}
                </td>
                <td className="item progress-percentage">
                  <div className="progress-container">
                    {dt.progress * 100 === 100 ? (
                      <ProgressBar
                        variant="success"
                        now={dt.progress * 100}
                        className="container"
                      />
                    ) : (
                      <ProgressBar
                        animated
                        variant="info"
                        now={dt.progress * 100}
                        className="container"
                      />
                    )}
                    <span className="progress-percentage">
                      {dt.progress.toFixed(2) * 100}%
                    </span>
                  </div>
                </td>
                <td className="item theme">{dt.theme}</td>
                <td className="item">{dt.startedDate || "-"}</td>
                <td className="item">{dt.endedDate || "-"}</td>
                <td className="item">{dt.updatedAt?.slice(0, 10)}</td>
                {boardViewOnly ? (
                  <></>
                ) : (
                  <td className="item actions">
                    <button
                      className="p-btn"
                      onClick={() => setOpenFormUpdateEpic(dt)}
                    >
                      <span>
                        <GiAutoRepair />
                      </span>{" "}
                      Update
                    </button>
                    <button className="p-btn" onClick={() => onDeleteEpic(dt)}>
                      <span>
                        <BsFillTrashFill size={15} />
                      </span>{" "}
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        {openFormUpdateEpic && (
          <AddEpic
            update={true}
            epic={openFormUpdateEpic}
            setOpenFormUpdateEpic={setOpenFormUpdateEpic}
          />
        )}
        <EpicsTableFooter
          dataLength={data.length}
          range={range}
          slice={slice}
          setPage={setPage}
          page={page}
          limit={LIMIT_ROWS_PER_PAGE}
          inputSearch={inputSearch === ""}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  states: getStates(state),
  isAdmin: state.users.isAdmin,
  epicsBoard: state.epics.epicsBoard,
  ticketsByState: state.tickets.ticketsByState,
  boardViewOnly: boardViewOnlySelector(state),
});
const mapDispatchToProps = {
  deleteEpic,
  fetchEpicsByBoard,
  fetchStatesByBoard,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BoardEpics));
