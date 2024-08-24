import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/axios';
import useConfirm from './useConfirm';
import useLoading from './useLoading';
import useNotification from './useNotification';

const useFetch = (url, options = { fetch: true }) => {
  const { onOpenErrorNotify } = useNotification();
  const { onOpenLoading, onCloseLoading } = useLoading();
  const { showSuccess } = useConfirm();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState({});
  const [params, setParams] = useState({});
  const [otherData, setOtherData] = useState({});
  const [firstFetch, setFirstFetch] = useState(false);
  const [res, setRes] = useState([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      onOpenLoading();
      setIsLoading(true);
      try {
        const response = await apiGet(url, params);
        const data = response.data;
        setData(data.data);
        console.log(data.data);

        if (data.page) {
          setPage(data.page);
        }

        if (data.otherData) {
          setOtherData(data.otherData)
        }

        setFirstFetch(true);
        setKey((key) => key + 1);
        onCloseLoading();
        setIsLoading(false);

      } catch (error) {
        console.log(error);
        // if (error.status !== 401) {
        onCloseLoading();
        setIsLoading(false);
        // }
      }
    }

    if (options.fetch) {
      fetchData();
    }
  }, [url, options.fetch, params])

  const fetch = async (url, params, onFinish, onError, showNoti = true) => {
    onOpenLoading();
    setIsLoading(true);
    try {
      const response = await apiGet(url, params);
      const data = response.data;
      setRes(data.data);
      console.log(data.data);

      if (data.page) {
        setPage(data.page);
      }

      if (data.otherData) {
        setOtherData(data.otherData)
      }

      setIsLoading(false);
      onCloseLoading();
      onFinish?.(response.data.data);

    } catch (error) {
      console.log(error);
      onError?.(error);
      if (showNoti) {
        onOpenErrorNotify(error?.message);
      }
      setIsLoading(false);
      onCloseLoading();
    }
  }

  const post = async (url, data, onFinish, onError, showNoti = true) => {
    onOpenLoading();
    try {
      const response = await apiPost(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      onError?.(error);
      console.log(error);
      onCloseLoading();
      if (showNoti) {
        onOpenErrorNotify(error?.message);
      }
    }
  };

  const put = async (url, data, onFinish, showNoti = true, showModal = false) => {
    onOpenLoading();
    try {
      const response = await apiPut(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      if (showNoti) {
        onOpenErrorNotify(error?.message);
      }
      if (showModal) {
        showSuccess(error?.message, "", 'error');
      }
    }
  };

  const remove = async (url, data, onFinish) => {
    onOpenLoading();
    try {
      const response = await apiDelete(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    }
  };

  return {
    data,
    setData,
    fetch,
    post,
    put,
    res,
    setRes,
    remove,
    isLoading,
    firstFetch,
    setParams,
    page,
    key,
    otherData
  };
}

export default useFetch;
