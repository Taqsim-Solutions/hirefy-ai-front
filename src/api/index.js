import request from "../lib/axios";

export const loginEmail = (data) => {
  return request({ method: "POST", url: "/auth/login-email", data });
};

export const createResume = (data) => {
  return request({ method: "POST", url: "/resumes", data });
};

export const getResumes = () => {
  return request({ method: "GET", url: "/resumes" });
};

export const getTemplates = () => {
  return request({ method: "GET", url: "/templates" });
};

export const createTemplate = (data) => {
  return request({ method: "POST", url: "/templates", data });
};
