import request from "./axiosClient";

const activitiesApi = {
    getBoardsActivities(boardId, page, limit) {
        const url = `activities/boards/${boardId}?page=${page}limit=${limit}`
        return request().get(url)
    },
    getTicketActivities(ticketId, page, limit) {
        const url = `activities/tickets/${ticketId}?page=${page}&limit=${limit}`
        return request().get(url)
    },
}
export default activitiesApi


