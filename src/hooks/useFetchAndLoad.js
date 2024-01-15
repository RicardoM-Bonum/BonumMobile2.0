import { useEffect, useState } from 'react';

const useFetchAndLoad = () => {
  const [loading, setLoading] = useState(false);
  let controller = null;

  const callEndpoint = async axiosCall => {
    setLoading(true);
    if (axiosCall.controller) controller = axiosCall.controller;
    let result = {};
    try {
      result = await axiosCall.call();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
    return result;
  };

  const cancelEndpoint = () => {
    setLoading(false);
    if (controller) controller.abort();
  };

  useEffect(() => {
    return cancelEndpoint();
  }, []);

  return { loading, callEndpoint };
};

export default useFetchAndLoad;
