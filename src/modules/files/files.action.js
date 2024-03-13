import ticketsAPI from "api/tickets.api";
import { toastSuccess } from "utils/toastHelper";
import Types from "./files.constant";

const addFilesToTicketSuccess = (ticketId, data) => ({
  type: Types.UPLOAD_FILES_SUCCESS,
  payload: {
    ticketId: ticketId,
    files: data.files,
    message: data.message,
  },
});
const handleUploadFailed = (error) => ({
  type: Types.HANDLE_UPLOAD_FILES_FAILED,
  payload: error,
});
const addFileToTicketPending = () => ({
  type: Types.UPLOAD_FILES_PENDING,
});
const addFilesByTicket = (ticketId, files) => async (dispatch) => {
  try {
    var formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("filesUpload", files[i]);
    }
    dispatch(addFileToTicketPending());

    const res = await ticketsAPI
      .addFilesToTicket(ticketId, formData)
      .then((res) => {
        dispatch(addFilesToTicketSuccess(ticketId, res.data));
        toastSuccess(res.data.message);
      });

    return Promise.resolve(res);
  } catch (error) {
    dispatch(handleUploadFailed(error.response.data));
    return Promise.reject(error);
  }
};
const getFilesByTicketSuccess = (ticketId, files) => ({
  type: Types.GET_FILES_BY_TICKET_SUCCESS,
  payload: {
    ticketId: ticketId,
    files: files,
  },
});
const fetchFilesByTicket = (ticketId) => async (dispatch) => {
  try {
    const res = await ticketsAPI.getFilesByTicket(ticketId).then((res) => {
      dispatch(getFilesByTicketSuccess(ticketId, res.data));
    });
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deleteFileFromTicketSuccess = (ticketId, fileId) => ({
  type: Types.DELETE_FILE_SUCCESS,
  payload: {
    ticketId: ticketId,
    fileId: fileId,
  },
});
const deleteFileFromTicket = (ticketId, fileId) => async (dispatch) => {
  try {
    dispatch(deleteFileFromTicketSuccess(ticketId, fileId));
    const res = await ticketsAPI.deleteFilesFromTicket(ticketId, fileId);
    return Promise.resolve(res);
  } catch (error) {
    dispatch(handleUploadFailed(error.response.data));
    return Promise.reject(error);
  }
};
const updateFilePending = (ticketId, file) => ({
  type: Types.UPDATE_FILE_PENDING,
  payload: {
    ticketId: ticketId,
    file: file,
  },
});
const updateFile = (ticketId, file) => async (dispatch) => {
  try {
    dispatch(updateFilePending(ticketId, file));
    const res = await ticketsAPI.updateFileInTicket(ticketId, file);
    return Promise.resolve(res);
  } catch (error) {
    dispatch(handleUploadFailed(error.response.data));
    return Promise.reject(error);
  }
};
const getAllFilesByTicketSuccess = (data) => {
  return {
    type: Types.GET_ALL_FILES_BY_TICKET_SUCCESS,
    payload: data,
  };
};
export {
  getFilesByTicketSuccess,
  updateFile,
  addFilesByTicket,
  fetchFilesByTicket,
  deleteFileFromTicket,
  getAllFilesByTicketSuccess,
  addFilesToTicketSuccess,
  updateFilePending,
  deleteFileFromTicketSuccess,
};
