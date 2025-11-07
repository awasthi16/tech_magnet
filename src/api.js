import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://tech-maganet-backend.vercel.app",
});

export default api;


