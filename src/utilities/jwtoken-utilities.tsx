import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { Platform } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { Registration } from "../utilities/types";
import api from "../services/base-api-url";

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

type DecodedToken = {
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    status: string;
  };
  exp: number;
  iat: number;
};

const processToken = async (): Promise<DecodedToken | null> => {
  try {
    if (Platform.OS === "web") {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    } else {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return null;

      const decoded = jwtDecode<DecodedToken>(token);
      return decoded;
    }
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

export function useGetDecodedToken() {
  const [decodedToken, setDecodedToken] = useState<DecodedToken>();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await processToken();
      if (token) {
        setDecodedToken(token);
      }
    };
    fetchToken();
  }, []);

  return decodedToken;
}

export const validateToken = async (): Promise<boolean> => {
  try {
    if (Platform.OS === "web") {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const decoded = jwtDecode<{ exp: number }>(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } else if (Platform.OS === "android" || Platform.OS === "ios") {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return false;

      const decoded = jwtDecode<{ exp: number }>(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    }
  } catch (err) {
    return false;
  }
  return false;
};

export const StoreToken = async (token: string) => {
  try {
    if (Platform.OS === "web") {
      await localStorage.setItem("token", token);
    } else if (Platform.OS === "android" || Platform.OS === "ios") {
      await SecureStore.setItemAsync("token", token);
    }
  } catch (error) {
    console.error("Erro ao armazenar o token:", error);
  }
};

export async function RemoveToken() {
  if (Platform.OS === "web") {
    await localStorage.removeItem("token");
    console.log("Token removido do localStorage");
  } else if (Platform.OS === "android" || Platform.OS === "ios") {
    await SecureStore.deleteItemAsync("token");
    console.log("Token removido do SecureStore");
  }
}

export async function GetToken() {
  try {
    if (Platform.OS === "web") {
      const token = localStorage.getItem("token");
      if (token) {
        return token;
      }
    } else if (Platform.OS === "android" || Platform.OS === "ios") {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        return token;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao obter o token:", error);
    return null;
  }
}

export const processingIsValidatedToActivity = async (
  activityId: string,
  userId: string
): Promise<string | null> => {
  try {
    if (!userId) {
      console.warn("⚠️ userId está vazio ou indefinido.");
      return null;
    }
    const response = await api.get("/activities/registrations/user");

    const exists = await response.data.some(
      (registration: Registration) => {
        if (registration.activityId === activityId && registration.userId === userId) {
          return true;
        }
      }
    );
    return exists;
  } catch (error) {
    console.error("Erro ao verificar atividade:", error);
    return null;
  }
};

export const useValidatedToActivity = (
  activityId: string,
  updateFlag?: boolean // <- novo parâmetro opcional
) => {
  const decodedToken = useGetDecodedToken();
  const [isRegistered, setIsRegistered] = useState<string | null>(null);

  useEffect(() => {
    if (!decodedToken?.data?.id) return;

    const fetchActivity = async () => {
      const result = await processingIsValidatedToActivity(
        activityId,
        decodedToken.data.id
      );
      setIsRegistered(result);
    };

    fetchActivity();
  }, [activityId, decodedToken, updateFlag]); // <- updateFlag força revalidação

  return isRegistered;
};




