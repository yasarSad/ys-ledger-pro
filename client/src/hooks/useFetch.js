import { useState, useEffect } from 'react';

export const useFetch = (url) => {
  // states
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(!!url);
  const [error, setError] = useState(null);

  // algorithm
  useEffect(() => {
    if (!url) {
      setIsPending(false);
      setError(new Error("You need a URL to proceed"));
      return;
    }
    // not let setting states during an unmount
    let isMounted = true;
    
    const fetchData = async () => {
      setIsPending(true);  // Ensure loading state is updated
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          headers: {Authorization: 'Bearer ${token}'},
        });

        if (!response.ok) {
          throw new Error("HTTP error! ${response.status}");
        }
        const result = await response.json();

        if(isMounted){
          setData(result);
        }

      } catch (error) {
        if(isMounted){
        setError(error);
        }
      } finally {
        if(isMounted){
        setIsPending(false);
      }
    }
    };
    
    fetchData();
    return() => {
      isMounted = false;
    }
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
