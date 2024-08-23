import React, { useEffect } from 'react';
import theme from '../../data/theme';
import Helmet from "react-helmet";
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import { PATH_PAGE } from '../../routes/path';
import useConfirm from '../../hooks/useConfirm';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';
import useAuth from '../../hooks/useAuth';
import useLoading from '../../hooks/useLoading';

function ShopPageVnPayPayment() {

  const { fetch } = useFetch(null, { fetch: false });
  const { isAuthenticated, isInitialized } = useAuth();
  const { onOpenLoading, onCloseLoading } = useLoading();

  const { showModal } = useConfirm()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramsArray = [];

    for (const param of searchParams.entries()) {
      const [key, value] = param;
      paramsArray.push(`${key}=${value}`);
    }

    onOpenLoading();
    if (isInitialized) {
      onCloseLoading();
      const apiUrl = `${CLIENT_API.bill.vnpay}?${paramsArray.join('&')}`;
      fetch(apiUrl, null, (res) => showModalSuccess(res), (res) => showModalError(res), false);
    }
  }, [isInitialized])

  const showModalSuccess = (res) => {
    const pathRedirect = isAuthenticated ? PATH_PAGE.account.order_detail(res?.bill?.code) : `${PATH_PAGE.track_order.details}?token=${res?.bill?.token}`;
    if (res?.status === "00") {
      showModal("Thanh toán thành công", pathRedirect);
    }
  }

  const showModalError = (res) => {
    if (res?.status === 400) {
      showModal("Thanh toán thất bại", isAuthenticated ? PATH_PAGE.account.order_detail(res?.error?.code) : `${PATH_PAGE.track_order.details}?token=${res?.error?.token}`, 'error');
    }
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`${theme.name}`}</title>
      </Helmet>

      <div style={{ height: 400 }}></div>

    </React.Fragment>
  )
}

export default ShopPageVnPayPayment;
