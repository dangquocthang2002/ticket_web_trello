import request from "./axiosClient";

export const postLogin = (body) => request().post("/auth/login", body);

export const getMe = () => request().get("/auth/me");

export const updateMe = (body) =>
  request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).put("/auth/me", body);
