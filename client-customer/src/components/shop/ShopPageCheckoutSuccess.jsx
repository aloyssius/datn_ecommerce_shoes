import React, { useEffect } from 'react';
import theme from '../../data/theme';
import Helmet from "react-helmet";
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { PATH_PAGE } from '../../routes/path';
import useAuth from '../../hooks/useAuth';

function ShopPageCheckoutSuccess() {

  const { isAuthenticated } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    const handleBeforeUnload = () => {
      history.replace(history.location.pathname, { order: {} });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [history]);

  // ko nhat thiet phai clear state

  if (!order?.code) {
    return <Redirect to='not-found' />
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Hoàn tất đặt hàng — ${theme.name}`}</title>
      </Helmet>

      <div className="checkout-success container-sm mt-5 text-center">

        <div className='pt-3'>
          <img src="https://ananas.vn/wp-content/themes/ananas/fe-assets/images/cart/title_success.jpg" alt="" />
        </div>
        <p className='mt-4' style={{ fontSize: 18, padding: "0px 40px" }}>
          Mã đơn hàng của bạn là {" "}
          <span className='text-main' style={{ fontWeight: 500 }}>{order?.code}</span>
          , hãy lưu lại để tra cứu đơn hàng khi cần thiết. Vui lòng check mail xác nhận để kiểm tra thông tin hoặc tra cứu tình trạng đơn hàng {" "}
          <Link to={`${PATH_PAGE.track_order.details}?token=${order?.token}`} className='text-decoration'>tại đây</Link>
          . Gọi ngay hotline {" "}
          <Link className='text-decoration'>0963 429 749</Link>
          {" "} trước khi đơn hàng được chuyển qua giao nhận nếu bạn muốn thay đổi thông tin.
        </p>

        <div className='pt-3'>
          <div style={{ border: "2px solid #333333" }}></div>
          <img width={600} className="mt-5" src="https://ananas.vn/wp-content/themes/ananas/fe-assets/images/svg/icon_dat_hang_thanh_cong.svg" alt="" />

          <p className='text-main mt-5' style={{ fontSize: 25, fontWeight: 'bold' }}>
            CUỘC SỐNG CÓ NHIỀU LỰA CHỌN. CẢM ƠN BẠN ĐÃ CHỌN ĐKN
          </p>

          <Link to={PATH_PAGE.root}>
            <button className='btn btn-primary btn-xl mt-4 w-50'>Tiếp tục mua hàng</button>
          </Link>
        </div>



      </div>
    </React.Fragment>
  )
}

export default ShopPageCheckoutSuccess;
