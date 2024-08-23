// react
import React, { useState, useEffect, Fragment } from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Modal } from 'reactstrap';

// data stubs
import dataAddresses from '../../data/accountAddresses';
import theme from '../../data/theme';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, set, useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFInput,
} from '../../components/hook-form';
import { isVietnamesePhoneNumberValid } from '../../utils/validate';
import { CLIENT_API } from '../../api/apiConfig';
import useFetch from '../../hooks/useFetch';
import useDeliveryApi from '../../hooks/useDelivery';
import useNotification from '../../hooks/useNotification';
import LoadingScreen from '../shared/LoadingScreen';
import useLoading from '../../hooks/useLoading';
import useAuth from '../../hooks/useAuth';


export default function AccountPageAddresses() {

  const {
    provinces,
    districts,
    wards,
    fetchDistrictsByProvinceId,
    fetchWardsByDistrictId,
    setDistricts,
    setWards,
    fetchProvincesReturn,
    fetchDistrictsByProvinceIdReturn,
    fetchWardsByDistrictIdReturn,
  } = useDeliveryApi();
  const { post, data, setData, remove, put, firstFetch } = useFetch(CLIENT_API.account.address.all);
  const [open, setOpen] = useState(false);
  const [fetch, setFetch] = useState(false);
  const { onOpenLoading, onCloseLoading } = useLoading();
  const [isEdit, setIsEdit] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({});
  const { updateAddressDefault } = useAuth();
  const { onOpenSuccessNotify } = useNotification();

  useEffect(() => {
    const fetch = async () => {
      setFetch(false);
      const provinces = await fetchProvincesReturn();

      const updatedData = await Promise.all(data?.map(async (item) => {
        const province = provinces?.find(province => province.ProvinceID === parseInt(item?.provinceId))?.ProvinceName;

        const districts = await fetchDistrictsByProvinceIdReturn(item?.provinceId);
        const district = districts.find(district => district.DistrictID === parseInt(item?.districtId))?.DistrictName;

        const wards = await fetchWardsByDistrictIdReturn(item?.districtId);
        const ward = wards.find(ward => ward.WardCode === item?.wardCode)?.WardName;

        return {
          ...item,
          province,
          district,
          ward,
        };
      }));
      setData(updatedData || []);
      setFetch(true);
    }

    if (firstFetch) {
      fetch();
    }
  }, [firstFetch])

  const fetchData = async (list) => {
    onOpenLoading();
    const provinces = await fetchProvincesReturn();

    const updatedData = await Promise.all(list?.map(async (item) => {
      const province = provinces?.find(province => province.ProvinceID === parseInt(item?.provinceId))?.ProvinceName;

      const districts = await fetchDistrictsByProvinceIdReturn(item?.provinceId);
      const district = districts.find(district => district.DistrictID === parseInt(item?.districtId))?.DistrictName;

      const wards = await fetchWardsByDistrictIdReturn(item?.districtId);
      const ward = wards.find(ward => ward.WardCode === item?.wardCode)?.WardName;

      return {
        ...item,
        province,
        district,
        ward,
      };
    }));
    setData(updatedData || []);
    onCloseLoading();
  }

  const AddressSchema = Yup.object().shape({
    fullName: Yup.string().trim().test(
      'max',
      'Họ và tên quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Họ và tên không được để trống'),
    address: Yup.string().trim().test(
      'max',
      'Địa chỉ cụ thể quá dài (tối đa 255 ký tự)',
      value => value.trim().length <= 255
    ).required('Địa chỉ cụ thể không được để trống'),
    phoneNumber: Yup.string().trim().test('is-vietnamese-phone-number', 'SĐT không hợp lệ', (value) => {
      return isVietnamesePhoneNumberValid(value);
    }),
    province: Yup.string().required('Bạn chưa chọn Tỉnh/Thành'),
    district: Yup.string().required('Bạn chưa chọn Quận/Huyện'),
    ward: Yup.string().required('Bạn chưa chọn Xã/Phường'),
  });

  useEffect(() => {
    reset(defaultValues);

    if (currentAddress?.provinceId) {
      fetchDistrictsByProvinceId(currentAddress?.provinceId);
    }

    if (currentAddress?.districtId) {
      fetchWardsByDistrictId(currentAddress?.districtId);
    }
  }, [currentAddress])


  const defaultValues = {
    fullName: currentAddress?.fullName || '',
    phoneNumber: currentAddress?.phoneNumber || '',
    address: currentAddress?.address || '',
    district: currentAddress?.districtId || '',
    province: currentAddress?.provinceId || '',
    ward: currentAddress?.wardCode || '',
  }

  const methods = useForm({
    resolver: yupResolver(AddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    watch,
    formState: { isSubmitted },
  } = methods;

  const onFinish = async (res) => {
    await fetchData(res);
    setOpen(false);
    reset();
    if (!isEdit) {
      onOpenSuccessNotify("Thêm địa chỉ thành công");
    }
    else {
      onOpenSuccessNotify("Cập nhật địa chỉ thành công");
    }
  }

  const onSubmit = async (data) => {
    const { ward, district, province, ...restData } = data;
    const body = {
      ...restData,
      districtId: data?.district,
      provinceId: data?.province,
      wardCode: data?.ward,
      id: currentAddress?.id
    }
    console.log(body);
    if (!isEdit) {
      post(CLIENT_API.account.address.post, body, (res) => onFinish(res), () => { });
    }
    else {
      put(CLIENT_API.account.address.put, body, (res) => onFinish(res), () => { });
    }
  }

  const { district, province, ward, fullName, phoneNumber, address } = watch();

  const isDefault = district === currentAddress?.districtId &&
    province === currentAddress?.provinceId &&
    ward === currentAddress?.wardCode &&
    fullName === currentAddress?.fullName &&
    phoneNumber === currentAddress?.phoneNumber &&
    address === currentAddress?.address;

  const onFinishDelete = async (res) => {
    await fetchData(res);
    if (res?.length === 0) {
      updateAddressDefault({});
    }
    onOpenSuccessNotify("Xóa địa chỉ thành công");
  }

  const handleDelete = (id) => {
    remove(CLIENT_API.account.address.delete(id), null, (res) => onFinishDelete(res));
  }

  const onFinishSetIsDefault = async (res) => {
    await fetchData(res);
    updateAddressDefault(res?.find((item) => item?.isDefault === 1));
    onOpenSuccessNotify("Đặt địa chỉ mặc định thành công");
  }

  const handleSetIsDefault = (id) => {
    put(CLIENT_API.account.address.putIsDefault, { id }, (res) => onFinishSetIsDefault(res));
  }

  const handleChangeCurrentAddress = (address) => {
    setCurrentAddress(address);
    setOpen(true);
    setIsEdit(true);
  }

  const handleOpen = () => {
    setCurrentAddress({});
    setOpen(true);
    setIsEdit(false);
  }

  const handleClose = () => {
    setIsEdit(false);
    setCurrentAddress({});
    setOpen(false);
  }

  const handleChangeProvince = (e) => {
    const value = e.target.value;

    setValue('district', "");
    setValue('ward', "");

    if (value !== "") {
      fetchDistrictsByProvinceId(value);
    }

    if (value === "") {
      setDistricts([]);
      setWards([]);
    }

    setValue('province', value);

    if (isSubmitted) {
      trigger(['district', 'ward', 'province']);
    }
  }

  const handleChangeDistrict = (e) => {
    const value = e.target.value;

    setValue('ward', "");

    if (value !== "") {
      fetchWardsByDistrictId(value);
    }

    if (value === "") {
      setWards([]);
    }

    setValue('district', value);

    if (isSubmitted) {
      trigger(['district', 'ward', 'province']);
    }
  }

  const handleChangeWard = (e) => {
    const value = e.target.value;

    setValue('ward', value);

    if (isSubmitted) {
      trigger(['district', 'ward', 'province']);
    }

  }

  const addresses = data?.map((address) => (
    <React.Fragment key={address?.id}>
      <div className="addresses-list__item card address-card">
        {address?.isDefault === 1 && <div className="address-card__badge">Mặc định</div>}

        <div className="address-card__body">
          <div className="address-card__name">{`${address?.fullName}`}</div>
          <div className="address-card__row">
            {address?.address},
            <br />
            {address?.ward}, {" "}
            {address.district}, {" "}
            {address.province}
          </div>
          <div className="address-card__row">
            <div className="address-card__row-title">Số điện thoại</div>
            <div className="address-card__row-content">{address?.phoneNumber}</div>
          </div>
          <div className="address-card__footer">
            <button onClick={() => handleChangeCurrentAddress(address)} className='btn btn-primary btn-sm'>Sửa</button>
            <button onClick={() => handleDelete(address?.id)} className='btn btn-primary btn-sm ml-2'>Xóa</button>
            {address?.isDefault === 0 &&
              <button onClick={() => handleSetIsDefault(address?.id)} className='btn btn-secondary btn-sm mt-2'>Đặt làm mặc định</button>
            }
          </div>
        </div>
      </div>
      <div className="addresses-list__divider" />
    </React.Fragment>
  ));

  return (
    <div className="addresses-list">
      <Helmet>
        <title>{`Danh sách địa chỉ — ${theme.name}`}</title>
      </Helmet>

      {fetch ?
        <>
          <div className="addresses-list__item addresses-list__item--new">
            <div className="addresses-list__plus" />
            <div onClick={handleOpen} className="btn btn-secondary btn-sm">Thêm mới</div>
          </div>
          <div className="addresses-list__divider" />
          {addresses}

          <Modal isOpen={open} fade={false} toggle={handleClose} centered size="lg">
            <div className="" style={{ padding: "20px 30px", height: "auto" }}>
              <div className=''>
                <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>{!isEdit ? "THÊM MỚI ĐỊA CHỈ" : "CẬP NHẬT ĐỊA CHỈ"}</span>
              </div>
              <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

              <div className='mt-3'>
                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">

                    <div className="col-12">
                      <div className="card mb-lg-0">
                        <div className="card-body">
                          <RHFInput name='fullName' topLabel='Họ và tên' placeholder="Nhập họ và tên" isRequired />
                          <RHFInput name='phoneNumber' topLabel='Số điện thoại' placeholder="Nhập số điện thoại" isRequired />

                          <Controller
                            name="province"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <div className="form-group">
                                <label>Tỉnh/Thành</label>
                                <span className="required">*</span>
                                <select
                                  {...field}
                                  id="checkout-country"
                                  className={`${error ? "input-border-error" : ""} form-control`}
                                  onChange={handleChangeProvince}
                                >
                                  <option value="">Chọn Tỉnh/Thành</option>
                                  {provinces?.map((province) => {
                                    return <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                  })}
                                </select>
                                <span className='text-error'>{error?.message}</span>
                              </div>
                            )}
                          />

                          <div className="form-row">
                            <Controller
                              name="district"
                              control={control}
                              render={({ field, fieldState: { error } }) => (
                                <div className="form-group col-md-6">
                                  <label>Quận/Huyện</label>
                                  <span className="required">*</span>
                                  <select
                                    {...field}
                                    id="checkout-country"
                                    className={`${error ? "input-border-error" : ""} form-control`}
                                    onChange={handleChangeDistrict}
                                  >
                                    <option value="">Chọn Quận/Huyện</option>
                                    {districts?.map((district) => {
                                      return <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                    })}
                                  </select>
                                  <span className='text-error'>{error?.message}</span>
                                </div>
                              )}
                            />
                            <Controller
                              name="ward"
                              control={control}
                              render={({ field, fieldState: { error } }) => (
                                <div className="form-group col-md-6">
                                  <label>Phường/Xã</label>
                                  <span className="required">*</span>
                                  <select
                                    {...field}
                                    className={`${error ? "input-border-error" : ""} form-control`}
                                    id="checkout-country"
                                    onChange={handleChangeWard}
                                  >
                                    <option value="">Chọn Phường/Xã</option>
                                    {wards?.map((ward) => {
                                      return <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                    })}
                                  </select>
                                  <span className='text-error'>{error?.message}</span>
                                </div>
                              )}
                            />
                          </div>

                          <RHFInput name='address' topLabel='Địa chỉ cụ thể' placeholder="Nhập địa chỉ" isRequired />
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="submit" className='btn mt-3 btn-primary btn-confirm-cancel' disabled={isEdit && isDefault}>Xác nhận</button>
                  </div>
                </FormProvider>
              </div>

            </div>
          </Modal>
        </>
        : <LoadingScreen />}

    </div>
  );
}
