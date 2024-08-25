import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import { apiGet, apiPost, apiPut, apiDelete, apiFormData, apiFormDataPut } from '../utils/axios';
import useLoading from './useLoading';
import useNotification from './useNotification';

const useFetch = (url, options = { fetch: true }) => {
  const { onOpenErrorNotify } = useNotification();
  const { onOpenLoading, onCloseLoading, onResetLoading } = useLoading();
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({});
  const [otherData, setOtherData] = useState({});
  const [firstFetch, setFirstFetch] = useState(false);
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(url);
      setIsLoading(true);
      // onOpenLoading('backdrop');
      onOpenLoading();
      try {
        console.log(params);
        const response = await apiGet(url, params);
        const data = response.data;
        setData(data.data);
        console.log(data.data);

        if (data.page) {
          setTotalElements(data.page.totalElements);
          setTotalPages(data.page.totalPages);
        }

        if (data.statusCounts) {
          setStatusCounts(data.statusCounts);
        }

        if (data.otherData) {
          setOtherData(data.otherData)
        }

        setFirstFetch(true);
        onCloseLoading();
        setIsLoading(false);

      } catch (error) {
        console.log(error);
        onCloseLoading();
        setIsLoading(false);
      }
    }

    if (options.fetch) {
      fetchData();
    }
  }, [url, options.fetch, params])

  const fetch = async (url, params, loading = true) => {
    if (loading) {
      setIsLoading(true);
      onOpenLoading();
    }
    try {
      const response = await apiGet(url, params);
      const data = response.data;
      setData(data.data);
      console.log(data.data);

      onCloseLoading();
      setIsLoading(false);
      setFirstFetch(true);

    } catch (error) {
      console.log(error);
      onCloseLoading();
      setIsLoading(false);
    }
  }

  const post = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      const response = await apiPost(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }

  };

  const formDataFile = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      const response = await apiFormData(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }

  };

  const formDataFilePut = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      const response = await apiFormDataPut(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }

  };

  const put = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      const response = await apiPut(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }
  };

  const putEndVoucher = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      // Gọi hàm apiPut để thực hiện PUT request
      const response = await apiPut(url, data);
      // Đảm bảo bạn lấy dữ liệu đúng từ response
      onCloseLoading();
      // Truyền dữ liệu phản hồi vào hàm callback onFinish
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }
  };

  const putRestoreVoucher = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      // Gọi hàm apiPut để thực hiện PUT request
      const response = await apiPut(url, data);
      // Đảm bảo bạn lấy dữ liệu đúng từ response
      onCloseLoading();
      // Truyền dữ liệu phản hồi vào hàm callback onFinish
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }
  };

  const remove = async (url, data, onFinish) => {
    onOpenLoading('backdrop');
    try {
      const response = await apiDelete(url, data);
      onCloseLoading();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      onCloseLoading();
      onOpenErrorNotify(error?.message);
    } finally {
      onResetLoading();
    }
  };

  return {
    isLoading,
    data,
    setData,
    fetch,
    post,
    formDataFile,
    formDataFilePut,
    put,
    putEndVoucher,
    putRestoreVoucher,
    remove,
    firstFetch,
    setParams,
    totalElements,
    totalPages,
    statusCounts,
    setStatusCounts,
    setTotalPages,
    otherData
  };
}

export default useFetch;
