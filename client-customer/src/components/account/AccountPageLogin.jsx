// react
import React, { useEffect, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

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
import useAuth from '../../hooks/useAuth';

import { CLIENT_API } from '../../api/apiConfig'
import { PATH_PAGE } from '../../routes/path'
import useLoading from '../../hooks/useLoading';

import { useCookies } from 'react-cookie';
import bcrypt from 'bcryptjs';
import { LOCAL_STORAGE_CART_ITEMS_KEY } from '../../enum/enum';

export default function AccountPageLogin() {

  const history = useHistory();

  const { post } = useFetch(null, { fetch: false });

  const [cookies, setCookie, removeCookie] = useCookies(['account']);
  const { login } = useAuth();
  const { onOpenLoading, onCloseLoading } = useLoading();

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Tài khoản', url: '' },
  ];

  // login

  const [errorLogin, setErrorLogin] = useState("");
  const [showPassLogin, setShowPassLogin] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
    password: Yup.string().required('Bạn chưa nhập mật khẩu'),
  });

  const defaultValuesLogin = {
    email: cookies.account?.email || '',
    password: cookies.account?.password || '',
    remember: (cookies.account?.email && cookies.account?.password) || false,
  }

  const methodsLogin = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValuesLogin,
  });

  const {
    handleSubmit: handleSubmitLogin,
    watch: watchLogin,
    reset,
  } = methodsLogin;

  useEffect(() => {
    reset(defaultValuesLogin);
  }, [cookies.account])


  const valuesLogin = watchLogin();

  useEffect(() => {
    if (errorLogin !== "") {
      setErrorLogin("");
    }
  }, [valuesLogin.email, valuesLogin.password]);

  const onFinishLogin = () => {
    history.push(PATH_PAGE.root);
  }

  const onErrorLogin = (error) => {
    console.log(error?.message);
    setErrorLogin(error?.message || "");
  }

  const onSubmitLogin = async (data) => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_CART_ITEMS_KEY);
    const body = {
      ...data,
      remember: !data.remember ? false : true,
      cartItems: storedValue ? JSON.parse(storedValue) : [],
    }
    console.log(body);
    onOpenLoading();
    try {
      await login(body);
      onCloseLoading();
      onFinishLogin();
    } catch (error) {
      console.error(error);
      onErrorLogin(error);
      onCloseLoading();
    } finally {
      if (body?.remember) {
        setCookie('account', { email: body?.email, password: body?.password });
      }
      else {
        removeCookie('account');
      }
    }
  }

  // register

  const [errorRegister, setErrorRegister] = useState("");
  const [showPassRes, setShowPassRes] = useState(false);
  const [showPassConfirmRes, setShowPassConfirmRes] = useState(false);

  const passwordRegex = /^[^\s]{8,255}$/;

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
    password: Yup.string()
      .required('Bạn chưa nhập mật khẩu')
      .matches(passwordRegex, 'Mật khẩu phải có độ dài từ 8 đến 255 ký tự và không chứa khoảng trắng'),
    passwordConfirmation: Yup.string()
      .required('Bạn chưa nhập lại mật khẩu')
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
  });

  const defaultValuesRegister = {
    email: '',
    password: '',
    passwordConfirmation: '',
  }

  const methodsRegister = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValuesRegister,
  });

  const {
    handleSubmit: handleSubmitRegister,
    watch: watchRegister,
  } = methodsRegister;

  const valuesRegister = watchRegister();

  useEffect(() => {
    if (errorRegister !== "") {
      setErrorRegister("");
    }
  }, [valuesRegister.email]);

  const onFinishRegister = (data) => {
    history.push(PATH_PAGE.account.register_sucess(data?.id));
  }

  const onErrorRegister = (error) => {
    console.log(error?.message);
    setErrorRegister(error?.message || "");
  }

  const onSubmitRegister = async (data) => {
    const body = {
      email: data.email?.trim(),
      password: data.password?.trim(),
    }
    console.log(body);
    post(CLIENT_API.account.register, body, (res) => onFinishRegister(res), (res) => onErrorRegister(res), false);
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Đăng nhập | Đăng ký — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="Tài khoản" breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex">
              <div className="card flex-grow-1 mb-md-0">
                <div className="card-body">
                  <h3 className="card-title">Đăng nhập</h3>
                  <FormProvider methods={methodsLogin} onSubmit={handleSubmitLogin(onSubmitLogin)}>

                    <RHFInput
                      name='email'
                      topLabel='Email'
                      isRequired
                      placeholder="Nhập địa chỉ email"
                    />

                    <RHFInput
                      name='password'
                      type={!showPassLogin ? "password" : "text"}
                      topLabel='Mật khẩu'
                      isRequired
                      placeholder="Nhập mật khẩu"
                      inputGroup={
                        <div class="input-group-append" style={{ cursor: "pointer" }} onClick={() => setShowPassLogin(!showPassLogin)}>
                          <span class="input-group-text"><i style={{ width: 20 }} class={!showPassLogin ? "fa fa-eye-slash" : "fa fa-eye"}></i></span>
                        </div>
                      }
                      children={
                        <div className='forgot-password-container'>
                          <small className="form-text text-dark">
                            <Link to="/"><span className='forgot-password'> Quên mật khẩu</span></Link>
                          </small>
                        </div>
                      }
                    />

                    <RHFCheckbox label="Lưu mật khẩu" name="remember" />

                    <span className='text-error mt-2 d-block'>{errorLogin}</span>

                    <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block">
                      Đăng nhập
                    </button>
                  </FormProvider>
                </div>
              </div>
            </div>

            <div className="col-md-6 d-flex mt-4 mt-md-0">
              <div className="card flex-grow-1 mb-0">
                <div className="card-body">
                  <h3 className="card-title">Đăng ký</h3>
                  <FormProvider methods={methodsRegister} onSubmit={handleSubmitRegister(onSubmitRegister)}>
                    <RHFInput
                      name='email'
                      topLabel='Email'
                      isRequired
                      placeholder="Nhập địa chỉ email"
                      errorRes={errorRegister}
                    />

                    <RHFInput
                      name='password'
                      type={!showPassRes ? "password" : "text"}
                      topLabel='Mật khẩu'
                      isRequired
                      placeholder="Nhập mật khẩu"
                      inputGroup={
                        <div class="input-group-append" style={{ cursor: "pointer" }} onClick={() => setShowPassRes(!showPassRes)}>
                          <span class="input-group-text"><i style={{ width: 20 }} class={!showPassRes ? "fa fa-eye-slash" : "fa fa-eye"}></i></span>
                        </div>
                      }
                    />

                    <RHFInput
                      name='passwordConfirmation'
                      type={!showPassConfirmRes ? "password" : "text"}
                      topLabel='Nhập lại mật khẩu'
                      isRequired
                      placeholder="Nhập mật khẩu"
                      inputGroup={
                        <div class="input-group-append" style={{ cursor: "pointer" }} onClick={() => setShowPassConfirmRes(!showPassConfirmRes)}>
                          <span class="input-group-text"><i style={{ width: 20 }} class={!showPassConfirmRes ? "fa fa-eye-slash" : "fa fa-eye"}></i></span>
                        </div>
                      }
                    />

                    <button type="submit" className="btn btn-primary mt-2 mt-md-3 mt-lg-4 d-block">
                      Đăng ký
                    </button>

                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
