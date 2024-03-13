import Types from "./activities.constant";

const initialState = {
    isLoading: false,
    boardActivities: [],
    ticketActivities: [],
    finishedFetch: false,
    error: null,
};

const activitiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.GET_BOARD_ACTIVITIES_PENDING:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case Types.GET_BOARD_ACTIVITIES_SUCCESS:
            const { boardActivities, page } = action.payload

            if (page === 1) {
                return {
                    ...state,
                    boardActivities: [...boardActivities],
                    finishedFetch: boardActivities.length >= 20 ? false : true
                }
            }
            else if (page >= 2) {
                return {
                    boardActivities: [...state.boardActivities, ...boardActivities],
                    finishedFetch: boardActivities.length === 0 ? true : false
                }
            }
            return {
                ...state,
                boardActivities: boardActivities,
                isLoading: false,
                finishedFetch: false
            };

        case Types.GET_BOARD_ACTIVITIES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
            };

        //actitivies
        case Types.GET_TICKET_ACTIVITIES_PENDING:
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case Types.GET_TICKET_ACTIVITIES_SUCCESS:
            const { ticketActivities, page: pageTicket } = action.payload

            if (pageTicket === 1) {
                return {
                    ...state,
                    ticketActivities: [...ticketActivities],
                    finishedFetch: ticketActivities.length >= 20 ? false : true
                }
            }
            else if (pageTicket >= 2) {
                return {
                    ticketActivities: [...state.ticketActivities, ...ticketActivities],
                    finishedFetch: ticketActivities.length === 0 ? true : false
                }
            }
            return {
                ...state,
                ticketActivities: ticketActivities,
                isLoading: false,
            };

        case Types.GET_TICKET_ACTIVITIES_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
                ticketActivities: [],
            };
        default:
            return state;
    }
};

export default activitiesReducer