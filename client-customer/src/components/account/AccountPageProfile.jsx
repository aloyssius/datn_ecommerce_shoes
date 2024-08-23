// react
import React, { useEffect } from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { CLIENT_API } from '../../api/apiConfig';

// data stubs
import theme from '../../data/theme';
import useFetch from '../../hooks/useFetch';
import useNotification from '../../hooks/useNotification';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import {
  FormProvider,
  RHFCheckbox,
  RHFInput,
} from '../../components/hook-form';
import { isVietnamesePhoneNumberValid } from '../../utils/validate';


export default function AccountPageProfile() {

  const { data, post, setData } = useFetch(CLIENT_API.account.details);
  const { onOpenSuccessNotify } = useNotification();

  const AccountSchema = Yup.object().shape({
    fullName: Yup.string().trim().test(
      'max',
      'Họ và tên quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Họ và tên không được để trống'),
    phoneNumber: Yup.string().trim().test('is-vietnamese-phone-number', 'SĐT không hợp lệ', (value) => {
      return isVietnamesePhoneNumberValid(value);
    }),
  });

  const defaultValues = {
    fullName: data?.fullName || '',
    phoneNumber: data?.phoneNumber || '',
    email: data?.email || '',
    // gender: null,
    // dateBirth: null,
  }

  const methods = useForm({
    resolver: yupResolver(AccountSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [data])

  const onFinish = (data) => {
    onOpenSuccessNotify("Cập nhật thông tin thành công");
    setData(data);
  }

  const onSubmit = async (data) => {
    const body = {
      fullName: data?.fullName?.trim(),
      phoneNumber: data?.phoneNumber?.trim(),
    }
    console.log(body);

    post(CLIENT_API.account.put, body, (res) => onFinish(res));
  }

  // const getCurrentDate = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   let month = today.getMonth() + 1;
  //   let day = today.getDate();
  //
  //   if (month < 10) {
  //     month = `0${month}`;
  //   }
  //   if (day < 10) {
  //     day = `0${day}`;
  //   }
  //
  //   return `${year}-${month}-${day}`;
  // };

  return (
    <>
      <div className="card">
        <Helmet>
          <title>{`Tài khoản của bạn — ${theme.name}`}</title>
        </Helmet>

        <div className="card-header">
          <h5>Thông tin tài khoản</h5>
        </div>
        <div className="card-divider" />
        <div className="card-body">
          <div className="row no-gutters">
            <div className="col-12 col-lg-7 col-xl-6">
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

                <RHFInput
                  name='fullName'
                  topLabel='Họ và tên'
                  placeholder="Nhập họ và tên"
                />

                <RHFInput
                  name='email'
                  type="email"
                  topLabel='Email'
                  disabled
                  placeholder="Email của bạn"
                />

                <RHFInput
                  name='phoneNumber'
                  type="text"
                  topLabel='Số điện thoại'
                  placeholder="Nhập số điện thoại"
                />

                <div className="form-group mt-5 mb-0">
                  <button type="submit" className="btn btn-primary">Lưu</button>
                </div>
              </FormProvider>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
