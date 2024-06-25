import { useState, useEffect } from 'react';
import Swal from 'sweetalert2'
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/axios';
import useLoading from './useLoading';

const useFetch = (url, options = { fetch: true }) => {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState({});
  const [otherData, setOtherData] = useState({});
  const [fetchCount, setFetchCount] = useState(0);
  const [firstFetch, setFirstFetch] = useState(false);
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(url);
      setIsLoading(true);
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

        setFetchCount(prevCount => prevCount + 1);
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

  const post = async (url, data, onFinish) => {
    try {
      const response = await apiPost(url, data);
      Swal.close();
      onFinish?.(response.data.data);
    } catch (error) {
      console.log(error);
      Swal.close();
    }
  };

  // const put = async (url, body) => {
  //   onOpenLoading();
  //   try {
  //     const response = await put(url, body);
  //     setData(response.data);
  //     onCloseLoading();
  //   } catch (error) {
  //     onCloseLoading();
  //   }
  // };
  //
  // const remove = async (url) => {
  //   onOpenLoading();
  //   try {
  //     const response = await remove(url);
  //     setTimeout(() => {
  //       setData(null);
  //       onCloseLoading();
  //     }, 500)
  //   } catch (error) {
  //     onCloseLoading();
  //   }
  // };

  return { data, firstFetch, totalElements, totalPages, isLoading, post, setParams, fetchCount, statusCounts, otherData };
}

export default useFetch;
