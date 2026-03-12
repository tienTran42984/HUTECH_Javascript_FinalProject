import axios from "https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm";

const api = axios.create({
    baseURL: "http://localhost:5000/api", // backend
});

export default api;