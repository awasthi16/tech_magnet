import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://tech-maganet-backend.vercel.app",
  // 👇 optional timeout to handle network delays
  // timeout: 15000,
});

export default api;
