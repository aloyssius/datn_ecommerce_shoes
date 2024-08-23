import axios from 'axios';
import { PATH_PAGE } from '../routes/path';
// config

// ----------------------------------------------------------------------

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST_API_KEY || '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 404) {
      window.location.href = '/not-found';
    }
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== PATH_PAGE.account.login_register) {
        window.location.href = PATH_PAGE.root;
      }
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong @');
  }
);

export const apiGet = (url, params) => {
  return axiosInstance.get(url, {
    params,
  });
};

export const apiPost = (url, data) => {
  return axiosInstance.post(url, data);
};

export const apiFormData = (url, data) => {
  return axiosInstance.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};

export const apiPut = (url, data) => {
  return axiosInstance.put(url, data);
};

export const apiDelete = (url, params) => {
  return axiosInstance.delete(url, {
    params
  });
};

export default axiosInstance;
