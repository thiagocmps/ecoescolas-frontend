import axios from "axios";
import { API_BASE_URL } from "../../config";

const isLocalhost = true; // Defina como true se estiver em localhost
const baseUrl = !isLocalhost ? "https://ashamed-elfrida-thiagocmps-a0126839.koyeb.app" : "http://192.168.1.217:5000"; // URL padrão se a variável de ambiente não estiver definida


const api = axios.create({
  baseURL: baseUrl, /*  "http://localhost:5000"  ou   */ 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;