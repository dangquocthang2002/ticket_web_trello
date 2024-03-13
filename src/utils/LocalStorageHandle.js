export const saveToken = (token) => {
  localStorage.setItem("ticket.token", token);
};

export const getToken = () => {
  return localStorage.getItem("ticket.token");
};

export const deleteToken = () => {
  return localStorage.removeItem("ticket.token");
};
