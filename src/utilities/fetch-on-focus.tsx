import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useFetchOnFocus<T>(fetchFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await fetchFunction();
          if (isActive) {
            setData(result);
          }
        } catch (err) {
          if (isActive) {
            setError(err);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [fetchFunction])
  );

  return { data, loading, error };
}
