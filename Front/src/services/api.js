import axios from 'axios';
const URL = 'http://172.27.43.56:8080/api/v1';
// const URL = import.meta.env.VITE_REACT_APP_RENDER_SERVER;

const instance = axios.create({
	baseURL: URL,
});

export default instance;
