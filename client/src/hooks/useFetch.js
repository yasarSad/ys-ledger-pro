import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  // States
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(!!url);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setIsPending(false);
      setError(new Error("You need a URL to proceed"));
      return;
    }

    // Don't let setting states during an unmount
    let isMounted = true;
    
    const fetchData = async () => {
      setIsPending(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(url, {
          // FIXED: Use backticks for template literal, not quotes
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });

        if (!response.ok) {
          // FIXED: Use backticks for template literal
          throw new Error(`HTTP error! ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result);
        }

      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setIsPending(false);
        }
      }
    };
    
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;