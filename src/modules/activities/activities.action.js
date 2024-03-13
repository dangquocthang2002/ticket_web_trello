import activitiesApi from "api/activities.api"

import Types from "./activities.constant";


///Activities ticket
const getTicketActivitiesPending = () => {
    return {
        type: Types.GET_TICKET_ACTIVITIES_PENDING
    };
};

const getTicketActivitiesSuccess = (ticketActivities, page, limit) => {
    return {
        type: Types.GET_TICKET_ACTIVITIES_SUCCESS,
        payload: { ticketActivities, page, limit },
    };
};

const getTicketActivitiesError = (error) => {
    return {
        type: Types.GET_TICKET_ACTIVITIES_ERROR,
        payload: error,
    };
};

const fetchTicketActivities = (ticketId, page, limit) => async (dispatch) => {

    try {
        dispatch(getTicketActivitiesPending());
        const res = await activitiesApi.getTicketActivities(ticketId, page, limit);
        dispatch(getTicketActivitiesSuccess(res.data, page, limit));
    } catch (err) {
        dispatch(getTicketActivitiesError(err.message));
    }
};

//activities board

// SYNC actions
const getBoardActivitiesPending = () => {
    return {
        type: Types.GET_BOARD_ACTIVITIES_PENDING
    };
};

const getBoardActivitiesSuccess = (boardActivities, page, limit) => {
    return {
        type: Types.GET_BOARD_ACTIVITIES_SUCCESS,
        payload: { boardActivities, page, limit },
    };
};

const getBoardActivitiesError = (error) => {
    return {
        type: Types.GET_BOARD_ACTIVITIES_ERROR,
        payload: error,
    };
};
const fetchBoardActivities = (boardId, page, limit) => async (dispatch) => {
    try {
        dispatch(getBoardActivitiesPending());
        const res = await activitiesApi.getBoardsActivities(boardId, page, limit);
        dispatch(getBoardActivitiesSuccess(res.data, page, limit));
    } catch (err) {
        dispatch(getBoardActivitiesError(err.message));
    }
};



export {
    getTicketActivitiesSuccess,
    getTicketActivitiesPending,
    getTicketActivitiesError,
    fetchTicketActivities,
    getBoardActivitiesSuccess,
    getBoardActivitiesError,
    getBoardActivitiesPending,
    fetchBoardActivities
}