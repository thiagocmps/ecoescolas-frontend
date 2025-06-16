import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useFetchOnFocus<T>(
  fetchFunction: () => Promise<T | null>,
  options?: { delay?: number } // você pode passar delay opcional
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (options?.delay) await sleep(options.delay); // espera antes de buscar
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, options?.delay]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return { data, loading, error, refetch: fetchData };
}
