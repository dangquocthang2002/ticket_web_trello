import request from "./axiosClient";

const statesAPI = {
    // api states
    getStatesByBoard(id) {
        const url = `/boards/${id}/states`
        return request().get(url)
    },
    addState(data) {
        const url = "/states";
        return request().post(url, data)
    },
    updateState(id, data) {
        const url = `/states/${id}`
        return request().put(url, data)
    },
    deleteState(id) {
        const url = `/states/${id}`
        return request().delete(url)
    },
}

export default statesAPI