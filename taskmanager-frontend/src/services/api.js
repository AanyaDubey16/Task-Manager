import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-production-523d.up.railway.app/api/tasks",
});

export default api;