import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React from "react";

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
    const token = await SecureStore.getItemAsync("token");
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
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
    const token = await SecureStore.getItemAsync("token");
    if (!token) return false;

    const decoded = jwtDecode<{ exp: number }>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (err) {
    return false;
  }
};
