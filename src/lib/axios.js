import axios from "axios";

const request = axios.create({
  baseURL: "http://185.183.243.118:5002/api",
});

export function errorHandler(error) {
  if (error.response) {
    if (error.response.status === 401) {
      localStorage.removeItem("hireliy-token");
      window.location.replace("/");
    }
    return Promise.reject(error.response);
  }
  if (error.request) {
    return Promise.reject(error.request);
  }
  return Promise.reject(error);
}

request.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
request.defaults.headers["Access-Control-Allow-Origin"] = "*";

request.interceptors.request.use((config) => {
  const token = localStorage.getItem("hireliy-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, errorHandler);

request.interceptors.response.use((response) => {
  const pagination = response.headers?.["x-pagination"]
    ? JSON.parse(response.headers?.["x-pagination"])
    : "";
  const payload = {};
  payload.data = response.data.result || response.data;
  if (pagination) {
    payload.pagination = pagination;
  }
  return payload;
}, errorHandler);

export default request;
