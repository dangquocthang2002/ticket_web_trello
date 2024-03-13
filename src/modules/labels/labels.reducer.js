import Types from "./labels.constant";

const initialState = {
  ticketLabels: [],
  boardLabels: [],
  labelUpdate: {},
  selectedColor: null,
};

const labelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.GET_LABELS_PENDING:
      return {
        ...state,
      };

    case Types.GET_LABELS_SUCCESS:
      return {
        ...state,
        boardLabels: [
          {
            boardId: action.payload.boardId,
            labels: action.payload.labels,
          },
        ],
      };

    case Types.GET_TICKETLABELS_PENDING:
      return {
        ...state,
      };

    case Types.GET_TICKETLABELS_SUCCESS:
      return {
        ...state,
        ticketLabels: [
          ...state.ticketLabels,
          {
            ticketId: action.payload.ticketId,
            labelsActive: action.payload.ticketLabel,
          },
        ],
      };

    case Types.SELECT_COLOR_SUCCESS:
      const item = action.payload;
      return {
        ...state,
        selectedColor: item,
      };

    case Types.ADD_LABELS_SUCCESS:
      let data = state.boardLabels || [];
      if (data.find((a) => a.boardId === action.payload.board)) {
        data = state.boardLabels.map((item) =>
          item.boardId === action.payload.board
            ? {
                ...item,
                labels: (item.labels || []).concat(action.payload),
              }
            : item
        );
      } else {
        data = data.concat({
          boardId: action.payload.board,
          labels: [].concat(action.payload),
        });
      }
      return {
        ...state,
        boardLabels: data,
      };

    case Types.ADD_LABEL_TO_TICKET_SUCCESS:
      let selectLabelSuccess = state.ticketLabels || [];
      if (
        selectLabelSuccess.find((a) => a.ticketId === action.payload.ticketId)
      ) {
        selectLabelSuccess = state.ticketLabels.map((item) =>
          item.ticketId === action.payload.ticketId
            ? {
                ...item,
                labelsActive: (item.labelsActive || []).concat(
                  action.payload.ticketLabel
                ),
              }
            : item
        );
      } else {
        selectLabelSuccess = selectLabelSuccess.concat({
          ticketId: action.payload.ticketId,
          labelsActive: [].concat(action.payload.ticketLabel),
        });
      }
      return {
        ...state,
        ticketLabels: selectLabelSuccess,
      };
    case Types.DELETE_TICKETLABEL_SUCCESS:
      const newTicketLabel = state.ticketLabels.map((item) =>
        item.ticketId === action.payload.ticketId
          ? {
              ...item,
              labelsActive: item.labelsActive.filter(
                (id) => action.payload.ticketLabelId !== id._id
              ),
            }
          : item
      );
      return {
        ...state,
        ticketLabels: newTicketLabel,
      };

    case Types.GET_LABEL_TO_UPDATE_SUCCESS:
      const { label } = action.payload;
      return {
        ...state,
        labelUpdate: {
          ...state.labelUpdate,
          ...label,
        },
      };

    case Types.UPDATE_LABELS_SUCCESS:
      const labelToUpdate = state.boardLabels.find(
        (i) => i.boardId === action.payload.board
      );
      const newLabelUpdate = labelToUpdate.labels.map((l) =>
        l._id === action.payload._id
          ? {
              ...action.payload,
            }
          : l
      );
      return {
        ...state,
        boardLabels: state.boardLabels.map((item) =>
          item.boardId === action.payload.board
            ? {
                ...item,
                labels: newLabelUpdate,
              }
            : item
        ),
      };

    case Types.DELETE_LABELS_SUCCESS:
      const labelToDelete = state.boardLabels.find(
        (i) => i.boardId === action.payload.currentLabel.board
      );
      const ticketLabelUpdate = state.ticketLabels.find(
        (i) => i.ticketId === action.payload.ticketId
      );
      const newTicketLabelsUpdate = ticketLabelUpdate?.labelsActive.filter(
        (item) => item !== action.payload.currentLabel._id
      );
      const newTicketsLabel = labelToDelete?.labels.filter(
        (item) => item._id !== action.payload.currentLabel._id
      );
      return {
        ...state,
        boardLabels: state.boardLabels.map((item) =>
          item.boardId === action.payload.currentLabel.board
            ? {
                ...item,
                labels: [...newTicketsLabel],
              }
            : item
        ),
        ticketLabels: state.ticketLabels.map((item) =>
          item.ticketId === action.payload.ticketId
            ? {
                ...item,
                labelsActive: [...newTicketLabelsUpdate],
              }
            : item
        ),
      };
    case Types.GET_ALL_LABELS_BY_TICKET_SUCCESS:
      return {
        ...state,
        ticketLabels: action.payload,
      };
    default:
      return state;
  }
};
export default labelsReducer;
