import axios from "axios";
import { API_BASE_URL } from "../../config";

const isLocalhost = false; // Defina como true se estiver em localhost
const baseUrl = !isLocalhost
  ? "https://ecoescolas-backend.onrender.com"
  : /* "http://localhost:5000" */ "http://192.168.1.217:5000";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});



export default api;
