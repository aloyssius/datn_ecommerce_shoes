import { useState, useEffect } from 'react';
import axios from 'axios';
import useLoading from './useLoading';

const shopID = 189389;
const serviceID = 53320;
const shopDistrictId = 1482;
const shopWardCode = 11007;
const token = "62124d79-4ffa-11ee-b1d4-92b443b7a897";

const useDeliveryApi = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [shipFee, setShipFee] = useState(0);
  const { onOpenLoading, onCloseLoading } = useLoading();

  const fetchApi = async (url, params = {}) => {
    onOpenLoading();
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
    } finally {
      onCloseLoading();
    }
  };

  const fetchApiNoLoading = async (url, params = {}) => {
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

  const fetchShipFee = async (toDistrictId, toWardCode) => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`;
    const params = {
      from_district_id: shopDistrictId,
      from_ward_code: String(shopWardCode),
      service_id: serviceID,
      to_district_id: parseInt(toDistrictId),
      to_ward_code: String(toWardCode),
      shop_id: shopID,
      weight: 240,
    };
    const response = await fetchApi(url, params);
    setShipFee(response.total);
  };

  const fetchProvincesReturn = async () => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province`;
    const response = await fetchApiNoLoading(url);
    return response;
  };

  const fetchDistrictsByProvinceIdReturn = async (provinceId) => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`;
    const params = {
      province_id: provinceId,
    };
    const response = await fetchApiNoLoading(url, params);
    return response;
  };

  const fetchWardsByDistrictIdReturn = async (districtId) => {
    const url = `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`;
    const params = {
      district_id: districtId,
    };
    const response = await fetchApiNoLoading(url, params);
    return response;
  };

  useEffect(() => {
    fetchProvinces();
  }, [])

  return { provinces, districts, wards, fetchWardsByDistrictId, fetchDistrictsByProvinceId, setWards, setDistricts, shipFee, fetchShipFee, setShipFee, fetchWardsByDistrictIdReturn, fetchDistrictsByProvinceIdReturn, fetchProvincesReturn };
}

export default useDeliveryApi;
