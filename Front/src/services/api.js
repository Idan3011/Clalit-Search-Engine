import axios from "axios";
const URL = import.meta.env.VITE_REACT_APP_RENDER_SERVER;
const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export default instance;
