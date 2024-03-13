export const getSortDepartments = (state) =>
  state?.departments?.departmentsPositions
    ?.sort((a, b) => a.posIndex - b.posIndex)
    .map((dpt) =>
      state?.departments?.listDepartments?.find(
        (department) => (department?._id || department?.id) === dpt.departmentId
      )
    ) || [];
export const getSortBoardsByDepartmentId = (departmentId, state) => {
  return state.departments.departmentsPositions
    ?.find((department) => department.departmentId === departmentId)
    .boards?.sort((a, b) => a.posIndex - b.posIndex)
    .map((boardPst) =>
      state.departments.departmentsBoards[departmentId]?.find(
        (board) => (board?._id || board?.id) === boardPst.boardId
      )
    );
};
export const getSortDepartmentsPositions = (state) =>
  state?.departments?.departmentsPositions?.sort(
    (a, b) => a.posIndex - b.posIndex
  );
export const getSortBoardsPositionOfDepartment = (state, departmentId) => {
  return state.departments.departmentsPositions
    ?.find((department) => department.departmentId === departmentId)
    .boards?.sort((a, b) => a.posIndex - b.posIndex);
};
