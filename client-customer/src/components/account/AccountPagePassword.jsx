// react
import React, { useState } from 'react';

// third-party
import { Helmet } from 'react-helmet';

// data stubs
import theme from '../../data/theme';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFCheckbox,
  RHFInput,
} from '../../components/hook-form';
import useFetch from '../../hooks/useFetch';
import useNotification from '../../hooks/useNotification';

import { CLIENT_API } from '../../api/apiConfig'
import { PATH_PAGE } from '../../routes/path'
import useAuth from '../../hooks/useAuth';


export default function AccountPagePassword() {

  const { put } = useFetch(null, { fetch: false });
  const { authUser, logout } = useAuth();
  const { onOpenSuccessNotify } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const passwordRegex = /^[^\s]{8,255}$/;

  const NewPassSchema = Yup.object().shape({
    password: Yup.string().required('Mật khẩu hiện tại không được để trống'),
    newPassword: Yup.string()
      .required('Mật khẩu mới không được để trống')
      .matches(passwordRegex, 'Mật khẩu mới phải có độ dài từ 8 đến 255 ký tự và không chứa khoảng trắng'),
  });

  const defaultValues = {
    password: '',
    newPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(NewPassSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
  } = methods;

  const onFinish = () => {
    onOpenSuccessNotify("Đổi mật khẩu thành công")
    logout();
  }
  const onSubmit = async (data) => {
    const body = {
      ...data,
      id: authUser?.id,
    }
    console.log(body);
    put(CLIENT_API.account.change_pass, body, () => onFinish());
  };

  return (
    <div className="card">
      <Helmet>
        <title>{`Đổi mật khẩu — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header">
        <h5>Đổi mật khẩu</h5>
      </div>
      <div className="card-divider" />
      <div className="card-body">
        <div className="row no-gutters">
          <div className="col-12 col-lg-7 col-xl-6">

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFInput
                name='password'
                type={!showPassword ? "password" : "text"}
                topLabel='Mật khẩu hiện tại'
                isRequired
                placeholder="Nhập mật khẩu hiện tại"
                inputGroup={
                  <div class="input-group-append" style={{ cursor: "pointer" }} onClick={() => setShowPassword(!showPassword)}>
                    <span class="input-group-text"><i style={{ width: 20 }} class={!showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i></span>
                  </div>
                }
              />

              <RHFInput
                name='newPassword'
                type={!showNewPassword ? "password" : "text"}
                topLabel='Nhập mật khẩu mới'
                isRequired
                placeholder="Nhập mật khẩu mới"
                inputGroup={
                  <div class="input-group-append" style={{ cursor: "pointer" }} onClick={() => setShowNewPassword(!showNewPassword)}>
                    <span class="input-group-text"><i style={{ width: 20 }} class={!showNewPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i></span>
                  </div>
                }
              />

              <div className="form-group mt-5 mb-0">
                <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
              </div>

            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
