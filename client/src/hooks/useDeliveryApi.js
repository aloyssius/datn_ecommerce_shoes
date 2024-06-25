import { useState, useEffect } from 'react';
import axios from 'axios';

const shopID = 189389;
const serviceID = 53320;
const shopDistrictId = 1482;
const shopWardCode = 11007;
const token = "62124d79-4ffa-11ee-b1d4-92b443b7a897";

const useDeliveryApi = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const fetchApi = async (url, params = {}) => {
    try {
      const response = await axios.get(url, {
        params: {
          ...params,
        },
        headers: {
          token,
          Accept: "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fetchProvinces = async () => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`;
    const response = await fetchApi(url);
    setProvinces(response);
  };

  const fetchDistrictsByProvinceId = async (provinceId) => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`;
    const params = {
      province_id: provinceId,
    };
    const response = await fetchApi(url, params);
    setDistricts(response);
  };

  const fetchWardsByDistrictId = async (districtId) => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`;
    const params = {
      district_id: districtId,
    };
    const response = await fetchApi(url, params);
    setWards(response);
  };

  useEffect(() => {
    fetchProvinces();
  }, [])

  return { provinces, districts, wards, fetchWardsByDistrictId, fetchDistrictsByProvinceId, setWards, setDistricts };
}

export default useDeliveryApi;
