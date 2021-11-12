import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:8080/eb/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
