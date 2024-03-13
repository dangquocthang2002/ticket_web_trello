const useTable = (data, page, rowsPerPage) => {
  const range = [];
  const num = Math.ceil(data.length / rowsPerPage);
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  return {
    slice: data.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    range: range,
  };
};

export default useTable;
