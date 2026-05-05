import { useState, useEffect } from "react";

 const useFetch = (fetchMethod, ...args) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an internal async function
    const executeFetch = async () => {
      try {
        setLoading(true);
        const result = await fetchMethod(...args);
        setData(result);
      } catch (err) {
        setError(err);
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (fetchMethod) {
      executeFetch();
    }
  }, [fetchMethod, JSON.stringify(args)]);

  return { data, loading, error };
};

export default useFetch;