import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Platform } from "react-native";


type DecodedToken = {
  data: {
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string; // use string, pois vem como ISO string do JWT
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

export function getDecodedToken() {
  const [decodedToken, setDecodedToken] = React.useState<any>(null);

  React.useEffect(() => {
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
    } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
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
      localStorage.setItem("token", token);
    } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await SecureStore.setItemAsync("token", token);
    }
  } catch (error) {
    console.error("Erro ao armazenar o token:", error);
  }
}

export async function RemoveToken() {
  console.log('Removendo o token...');
  if (Platform.OS === 'web') {
    localStorage.removeItem('token');
    console.log('Token removido do localStorage');
  } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
    await SecureStore.deleteItemAsync('token');
    console.log('Token removido do SecureStore');
  }
}