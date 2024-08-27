// react
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// third-party
import { Helmet } from 'react-helmet';

// application
import PageHeader from '../shared/PageHeader';

// data stubs
import theme from '../../data/theme';
import { PATH_PAGE } from '../../routes/path';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';

const MESSAGE_SUCCESS = "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Vui lòng kiểm tra email được liên kết.";

export default function AccountForgotPassword() {
  const breadcrumb = [
    { title: 'Trang chủ', url: PATH_PAGE.root },
    { title: 'Quên mật khẩu', url: '' },
  ];

  const { fetch } = useFetch(null, { fetch: false });

  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  const onFinish = (res) => {
    setErr(MESSAGE_SUCCESS)
  }

  const onErr = (err) => {
    setErr(err?.message);
  }

  const handleSubmit = () => {
    if (email.trim() !== "") {
      const params = {
        email,
      }
      fetch(CLIENT_API.reset_pass, params, (res) => onFinish(res), (res) => onErr(res), false);
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Quên mật khẩu — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8">
              <div className="card flex-grow-1 mb-0 mt-lg-4 mt-md-3 mt-2">
                <div className="card-body">
                  <div className="card-title text-center text-uppercase"><h1 className="pt-lg-0 pt-2">Quên mật khẩu</h1></div>
                  <form>
                    <div className="form-group">
                      <label htmlFor="track-order-id">Email của bạn</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Nhập email"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // handleSubmit();
                          }
                        }}
                      />

                      {err !== "" &&
                        <div className="mt-4 notify-error">
                          <p className='text-main'>{err}</p>
                        </div>
                      }
                    </div>
                    <div className="">
                      <button type="button" onClick={handleSubmit} className="btn btn-primary btn-lg btn-block">Quên mật khẩu</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
