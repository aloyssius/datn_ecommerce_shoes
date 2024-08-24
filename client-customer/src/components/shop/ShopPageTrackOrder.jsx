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

const MESSAGE_ERROR = "Xin lỗi! Hệ thống không tìm thấy đơn hàng bạn muốn tra cứu. Vui lòng kiểm tra lại các thông tin đã nhập.";

function ShopPageTrackOrder() {
  const breadcrumb = [
    { title: 'Trang chủ', url: PATH_PAGE.root },
    { title: 'Tra cứu đơn hàng', url: PATH_PAGE.track_order.root },
  ];

  const { fetch } = useFetch(null, { fetch: false });
  const history = useHistory();

  const [inputCode, setInputCode] = useState("");
  const [inputPhone, setInputPhone] = useState("");
  const [err, setErr] = useState("");

  const onFinish = (res) => {
    history.push(`${PATH_PAGE.track_order.details}?token=${res}`);
  }

  const onErr = () => {
    setErr(MESSAGE_ERROR);
  }

  const handleSubmit = () => {
    if (inputCode.trim() !== "" && inputPhone.trim() !== "") {
      const params = {
        code: inputCode,
        phoneNumber: inputPhone,
        type: "createToken",
      }
      fetch(CLIENT_API.bill.details, params, (res) => onFinish(res), (res) => onErr(res), false);
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Tra cứu đơn hàng — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-lg-6 col-md-8">
              <div className="card flex-grow-1 mb-0 mt-lg-4 mt-md-3 mt-2">
                <div className="card-body">
                  <div className="card-title text-center text-uppercase"><h1 className="pt-lg-0 pt-2">Tra Cứu Đơn Hàng</h1></div>
                  <form>
                    <div className="form-group">
                      <label htmlFor="track-order-id">Mã đơn hàng</label>
                      <input
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã đơn hàng"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // handleSubmit();
                          }
                        }}
                      />

                      <label htmlFor="track-order-id1" className='mt-3'>Số điện thoại</label>
                      <input
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Nhập số điện thoại"
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
                      <button type="button" onClick={handleSubmit} className="btn btn-primary btn-lg btn-block">Tra cứu đơn hàng</button>
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

export default ShopPageTrackOrder;
