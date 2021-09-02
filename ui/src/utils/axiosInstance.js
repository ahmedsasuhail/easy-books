import axios from 'axios';

// QuickBook Axios Instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
