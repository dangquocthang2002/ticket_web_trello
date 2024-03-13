import React, { useState } from "react";
import ActivityPreview from "components/board-activities/ActivityPreview";
import { fetchTicketActivities } from "modules/activities/activities.action";
import { connect } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllUserInBoard } from "modules/boards/boards.selectors";

const TicketActivity = (props) => {
  const limit = 20;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { fetchTicketActivities, ticketActivities, allUserInBoard } = props;

  const { ticketId } = useParams();
  useEffect(() => {
    fetchTicketActivities(ticketId, page, limit);
    setLoading(false);
  }, [page]);
  return (
    <>
      <div className="">
        <div className="">
          <div className="toggle">
            {ticketActivities?.map((activity, index) => (
              <ActivityPreview activity={activity} key={index} allUserInBoard={allUserInBoard} />
            ))}
            {!props.finishedFetch && (
              <button
                className="show-more-activities"
                onClick={() => setPage(page + 1)}
              >
                {loading ? "Loading..." : <p>Show more action...</p>}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  ticketActivities: state.activities.ticketActivities,
  finishedFetch: state.activities.finishedFetch,
  allUserInBoard: getAllUserInBoard(state)
});

const mapDispatchToProps = {
  fetchTicketActivities,
};
export default connect(mapStateToProps, mapDispatchToProps)(TicketActivity);
