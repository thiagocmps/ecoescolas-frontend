import axios from "axios";
import { API_BASE_URL } from "../../config";
import { GetToken } from "../utilities/jwtoken-utilities";

const isLocalhost = true; // Defina como true se estiver em localhost
const baseUrl = !isLocalhost
  ? "https://ashamed-elfrida-thiagocmps-a0126839.koyeb.app"
  : /* "http://localhost:5000" */ "http://192.168.1.217:5000"; // URL padrão se a variável de ambiente não estiver definida

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await GetToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
