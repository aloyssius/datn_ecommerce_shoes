import { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/axios';
import useLoading from './useLoading';

const useFetch = (url, options = { fetch: true, page: true }) => {
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [data, setData] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);
  const [params, setParams] = useState({});
  const [otherData, setOtherData] = useState({});
  const [fetchCount, setFetchCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      onOpenLoading();
      try {
        console.log(params);
        const response = await apiGet(url, params);
        const data = response.data;
        setData(data.data);

        setStatusCounts(data.statusCounts);

        if (options.page) {
          setTotalElements(data.page.totalElements);
          setTotalPages(data.page.totalPages);
        }

        if (data.otherData) {
          setOtherData(data.otherData)
        }

        setFetchCount(prevCount => prevCount + 1);
        onCloseLoading();
        setLoading(false);

      } catch (error) {
        setError(error)
        onCloseLoading();
        setLoading(false);
      }
    }

    if (options.fetch) {
      fetchData();
    }
  }, [url, options.fetch, params])

  // const post = async (body) => {
  //   onOpenLoading();
  //   try {
  //     const response = await post(url, body);
  //     setData(response.data);
  //     onCloseLoading();
  //   } catch (error) {
  //     setError(error);
  //     onCloseLoading();
  //   }
  // };
  //
  // const put = async (url, body) => {
  //   onOpenLoading();
  //   try {
  //     const response = await put(url, body);
  //     setData(response.data);
  //     onCloseLoading();
  //   } catch (error) {
  //     setError(error);
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
  //     setError(error);
  //   }
  // };

  return { data, totalElements, totalPages, loading, error/* , post, put, remove */, setParams, fetchCount, statusCounts, otherData };
}

export default useFetch;
