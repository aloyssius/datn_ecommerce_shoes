// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

// application

// data stubs
import theme from '../../data/theme';

import useFetch from '../../hooks/useFetch';

import { CLIENT_API } from '../../api/apiConfig'

export default function AccountRegisterSuccess() {

  const { id } = useParams();

  const { data } = useFetch(CLIENT_API.account.register_success(id));

  return (
    <React.Fragment>
      <Helmet>
        <title>{`${data?.email ? "Đăng ký thành công - " : ""} ${theme.name}`}</title>
      </Helmet>

      {data?.email &&
        <div className="block mt-5">
          <div className="container text-center">
            <img style={{ width: 300 }} src="images/email-vefify.jpg" alt="123" />

            <p className='text-success' style={{ fontSize: 30, fontWeight: '500' }}>
              Đăng ký tài khoản thành công
            </p>

            <p className='text-dark mt-4' style={{ fontSize: 15, fontWeight: '500' }}>
              Chúng tôi đã gửi một thư kích hoạt tài khoản tới <span style={{ fontWeight: 'bold' }}>{data?.email || ""}</span> <br />
              Vui lòng mở email và tiến hành xác thực tài khoản của bạn.
            </p>

          </div>
        </div>
      }

    </React.Fragment>
  );
}
