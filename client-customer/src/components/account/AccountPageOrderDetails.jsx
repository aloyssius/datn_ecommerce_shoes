// react
import React, { Component } from 'react';

// third-party
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// application
import Pagination from '../shared/Pagination';

// data stubs
import dataOrders from '../../data/accountOrders';
import theme from '../../data/theme';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';
import useAuth from '../../hooks/useAuth';
import { formatCurrencyVnd } from '../../utils/formatNumber';

export default function AccountPageOrderDetails() {

  const { authUser } = useAuth();
  const { data } = useFetch(CLIENT_API.account.bills(authUser?.id));

  const ordersList = data?.map((order) => (
    <tr key={order.id}>
      <td><Link className="text-decoration" style={{ fontWeight: '500' }} to="/">{`#${order?.code}`}</Link></td>
      <td>{order.createdAt}</td>
      <td>{convertOrderStatus(order.status)}</td>
      <td>{formatCurrencyVnd(String(order.totalMoney))}</td>
    </tr>
  ));

  return (
    <div className="container">
      <Helmet>
        <title>{`Theo dõi đơn hàng — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header mt-4 text-center">
        <h3>THÔNG TIN ĐƠN HÀNG</h3>
      </div>
      <div className='mt-3' style={{ border: "1px solid #333333" }}></div>
    </div>
  );
}
const convertOrderStatus = (status) => {
  let statusConverted = "";
  switch (status) {
    case "pending_confirm":
      statusConverted = "Chờ xác nhận";
      break;
    case "waitting_delivery":
      statusConverted = "Chờ giao hàng";
      break;
    case "delivering":
      statusConverted = "Đang giao hàng";
      break;
    case "completed":
      statusConverted = "Hoàn thành";
      break;
    default:
      statusConverted = "Đã hủy";
      break;
  }

  return statusConverted;
}
