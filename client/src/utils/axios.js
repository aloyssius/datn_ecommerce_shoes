import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

export const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const apiGet = (url, params) => {
  return axiosInstance.get(url, {
    params,
  });
};

export const apiPost = (url, data) => {
  return axiosInstance.post(url, data);
};

export const apiPut = (url, data) => {
  return axiosInstance.put(url, data);
};

export const apiDelete = (url) => {
  return axiosInstance.delete(url);
};

export default axiosInstance;
