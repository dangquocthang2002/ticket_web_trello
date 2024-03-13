export const countBoardFiltersSelector = (state) => {
  let count = 0;

  const boardId = state.boards.boardActive._id;
  const { labels, members, epics, ticketTitle } =
    state.boards.filter[boardId] || {};

  if (ticketTitle) {
    count += 1;
  }

  if (labels) {
    if (labels.selectedLabel?.length > 0 || labels.isNoLabel) {
      count += 1;
    }
  }

  if (members) {
    if (members.selectedMember?.length > 0 || members.isNoMember) {
      count += 1;
    }
  }

  if (epics) {
    if (epics.selectedEpic?.length > 0 || epics.isNoEpic) {
      count += 1;
    }
  }
  return count;
};
export const boardViewOnlySelector = (state) =>
  state.users.isAdmin ? false : state.boards.boardActive.viewOnly;

export const getAllUserInBoard = (state) => {
  const allUser = state.boards?.boardActiveInvitedMembers
    .map((user) => user)
    .concat(
      state.departments?.departmentsUsers[state.boards?.boardActive?.department]
    );
  return allUser || [];
};
export const getSortGuestDepartments = (state) =>
  state.boards.guestDepartmentsPositions
    ?.sort((a, b) => a.posIndex - b.posIndex)
    .map((dpt) =>
      state?.boards?.guestUserDepartments?.find(
        (department) => (department?._id || department?.id) === dpt.departmentId
      )
    ) || [];
export const getSortGuestDepartmentsPositions = (state) =>
  state.boards.guestDepartmentsPositions?.sort(
    (a, b) => a.posIndex - b.posIndex
  );
export const getSortGuestBoardPositions = (state, departmentId) =>
  state.boards.guestDepartmentsPositions
    ?.find((dpt) => dpt.departmentId === departmentId)
    .boards.sort((a, b) => a.posIndex - b.posIndex);
export const getSortGuestBoard = (state, departmentId) =>
  state.boards.guestDepartmentsPositions
    ?.find((dpt) => dpt.departmentId === departmentId)
    .boards.sort((a, b) => a.posIndex - b.posIndex)
    .map((board) =>
      state.boards.invitedUserBoards.find((b) => b?._id === board.boardId)
    ) || [];
