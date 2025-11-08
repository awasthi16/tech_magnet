import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://tech-maganet-backend.vercel.app",
    // baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
});

export default api;


// http://localhost:5000
