import { compareAsc } from "date-fns";

export const getSortTicket = (store, stateId) => {
  const state = store.states.states.find((state) => state._id === stateId);

  const tickets = store?.tickets?.ticketsByState[stateId];

  const sortData = tickets?.slice().sort((a, b) => {
    if (state.isDone) {
      return compareAsc(new Date(b.movedAt), new Date(a.movedAt));
    } else {
      return a.positionIndex - b.positionIndex;
    }
  });
  return sortData || [];
};
