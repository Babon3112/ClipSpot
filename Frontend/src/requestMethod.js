import axios from "axios";

const BASE_URL = "http://localhost:3112/vidverse/api/v1";
const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.data.accessToken;

export const publicRequest = axios.create({ baseURL: BASE_URL });

export const userRequest = axios.create({
  baseURL: BASE_URL,
  credentials: "include",
});

userRequest.interceptors.request.use(
  (config) => {
    if (TOKEN) {
      config.headers.Authorization = `Bearer ${TOKEN}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
