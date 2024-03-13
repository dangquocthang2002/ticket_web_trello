import request from "./axiosClient";

const ticketsAPI = {
  getTicketsByState(id) {
    const url = `/states/${id}/tickets`;
    return request().get(url);
  },

  getIdTicket(id) {
    const url = `/tickets/${id}`;
    return request().get(url);
  },

  addTicket(data) {
    const url = "/tickets";
    return request().post(url, data);
  },

  updateTicket(id, data) {
    const url = `tickets/${id}`;
    return request().put(url, data);
  },

  deleteTicket(id, data) {
    const url = `tickets/${id}`;
    return request().delete(url, data);
  },

  getUserTicket(_id) {
    return request().get(`tickets/${_id}/users`);
  },
  addUserTicket(_id, users) {
    return request().post(`tickets/${_id}/users/`, users);
  },
  deleteUserTicket(_id, users) {
    return request().delete(`tickets/${_id}/users/`, { data: users });
  },
  getTicketsByEpicId(epicId) {
    return request().get(`/epics/${epicId}/tickets`);
  },
  addTicketLabel(_id, labelId) {
    return request().post(`tickets/${_id}/labels`, { labelId });
  },
  deleteTicketLabel(_id, labelId) {
    return request().delete(`tickets/${_id}/labels/${labelId}`, labelId);
  },
  getTicketLabels(_id) {
    return request().get(`tickets/${_id}/labels`);
  },

  // get File by Ticket
  getFilesByTicket(_id) {
    return request().get(`tickets/${_id}/files`);
  },
  // add file to ticket
  addFilesToTicket(_id, formData) {
    return request({
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).post(`tickets/${_id}/files`, formData);
  },
  deleteFilesFromTicket(_id, fileId) {
    return request().delete(`tickets/${_id}/files/${fileId}`);
  },
  updateFileInTicket(_id, file) {
    return request().put(`tickets/${_id}/files/${file._id}`, file.content);
  },
};

export default ticketsAPI;
