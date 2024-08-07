// react
import React, { useEffect, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';

// application

// data stubs
import theme from '../../data/theme';

import useFetch from '../../hooks/useFetch';

import { CLIENT_API } from '../../api/apiConfig'

export default function AccountVerify() {

  const { id } = useParams();

  const { data, post, setData } = useFetch(null, { fetch: false });

  const [error, setError] = useState("");

  const onError = (data) => {
    setError(data);
  }

  const onFinish = (data) => {
    setData(data);
  }

  useEffect(() => {
    post(CLIENT_API.account.verify(id), {}, (res) => onFinish(res), (res) => onError(res));
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <title>{`${data?.id ? "Xác thực tài khoản thành công - " : ""} ${theme.name}`}</title>
      </Helmet>

      {data?.id &&
        <div className="block mt-5">
          <div className="container text-center">
            <img style={{ width: 150 }} src="images/tick-mark.png" alt="123" />

            <p className='text-success' style={{ fontSize: 30, fontWeight: '500' }}>
              Xác thực tài khoản thành công
            </p>

            <Link to='/account/login'>
              <button className='btn btn-primary btn-lg mt-3'>Đăng nhập ngay</button>
            </Link>

          </div>
        </div>
      }

      {error?.message && error?.status === 400 &&
        <div className="block mt-5">
          <div className="container text-center">

            <p className='text-error' style={{ fontSize: 25, fontWeight: '500' }}>
              {error.message}
            </p>

          </div>
        </div>
      }


    </React.Fragment>
  );
}
