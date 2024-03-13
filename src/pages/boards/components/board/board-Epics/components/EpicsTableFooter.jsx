import React, { useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";

const EpicsTableFooter = ({
  range,
  setPage,
  page,
  slice,
  dataLength,
  limit,
  inputSearch,
}) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);

  const showingCount = `${(page - 1) * limit + 1} - ${
    page * limit > dataLength ? dataLength : page * limit
  }`;
  return (
    <div className="tableEpicsFooter">
      <div className="num-records">
        <span>
          Showing{" "}
          {!inputSearch ? slice.length : slice.length === 0 ? 0 : showingCount}{" "}
          of {dataLength} records
        </span>
      </div>
      <div className="btn-container">
        <button
          className="button prev-next"
          onClick={() => {
            if (!range[0]) {
              return;
            }
            if (page === range[0]) {
              return;
            }
            setPage(page - 1);
          }}
        >
          <AiOutlineArrowLeft />
        </button>
        {range.map((el, index) => (
          <button
            key={index}
            className={`button ${
              page === el ? "activeButton" : "inactiveButton"
            }`}
            onClick={() => setPage(el)}
          >
            {el}
          </button>
        ))}

        <button
          className="button prev-next"
          onClick={() => {
            if (!range[range.length - 1]) {
              return;
            }
            if (page === range[range.length - 1]) {
              return;
            }
            setPage(page + 1);
          }}
        >
          <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

export default EpicsTableFooter;
