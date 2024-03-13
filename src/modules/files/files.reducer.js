import { toastError } from "utils/toastHelper";
import Types from "./files.constant";

const initialState = {
  ticketFiles: {},
  isLoadingFile: false,
};

const filesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_FILES_BY_TICKET_SUCCESS:
      return {
        ...state,
        ticketFiles: {
          ...state.ticketFiles,
          [action.payload.ticketId]: action.payload.files,
        },
      };
    case Types.UPLOAD_FILES_SUCCESS:
      return {
        ...state,
        isLoadingFile: false,
        ticketFiles: {
          ...state.ticketFiles,
          [action.payload.ticketId]: [
            ...action.payload.files,
            ...(state.ticketFiles[action.payload.ticketId] || []),
          ],
        },
      };
    case Types.DELETE_FILE_SUCCESS:
      return {
        ...state,
        ticketFiles: {
          ...state.ticketFiles,
          [action.payload.ticketId]: state.ticketFiles[
            action.payload.ticketId
          ].filter((file) => file._id !== action.payload.fileId),
        },
      };
    case Types.UPDATE_FILE_PENDING:
      return {
        ...state,
        ticketFiles: {
          ...state.ticketFiles,
          [action.payload.ticketId]: state.ticketFiles[
            action.payload.ticketId
          ].map((file) => {
            if (file._id === action.payload.file._id) {
              return {
                ...file,
                ...action.payload.file.content,
              };
            }
            return {
              ...file,
              isCovered: action.payload.file.content.name
                ? file?.isCovered
                : false,
            };
          }),
        },
      };

    case Types.UPLOAD_FILES_PENDING:
      return { ...state, isLoadingFile: true };

    case Types.HANDLE_UPLOAD_FILES_FAILED:
      toastError(action.payload);
      return {
        ...state,
        isLoadingFile: false,
      };
    case Types.GET_ALL_FILES_BY_TICKET_SUCCESS:
      return {
        ...state,
        ticketFiles: action.payload,
      };
    default:
      return state;
  }
};
export default filesReducer;
