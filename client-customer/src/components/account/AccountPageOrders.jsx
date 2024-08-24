// react
import React, { useState, useEffect } from 'react';

// third-party
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// application
import Pagination from '../shared/Pagination';

// data stubs
import theme from '../../data/theme';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';
import useAuth from '../../hooks/useAuth';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import { PATH_PAGE } from '../../routes/path';

export default function AccountPageOrders() {

  const { authUser } = useAuth();
  const { fetch, res, page } = useFetch(null, { fetch: false });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilter = () => {
    const params = {
      currentPage,
      accountId: authUser?.id
    };
    fetch(CLIENT_API.account.bills, params, () => { }, () => { }, false);
  }

  useEffect(() => {
    handleFilter();
  }, [currentPage])

  const ordersList = res?.map((order) => (
    <tr key={order.id}>
      <td><Link className="text-decoration" style={{ fontWeight: '500' }} to={PATH_PAGE.account.order_detail(order?.code)}>{`#${order?.code}`}</Link></td>
      <td>{order.createdAt}</td>
      <td>{convertOrderStatus(order.status)}</td>
      <td>{formatCurrencyVnd(String(order.totalMoney))}</td>
    </tr>
  ));

  return (
    <div className="card">
      <Helmet>
        <title>{`Lịch sử mua hàng — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header">
        <h5>Lịch sử mua hàng</h5>
      </div>
      <div className="card-divider" />
      <div className="card-table">
        <div className="table-responsive-sm">
          <table >
            <thead>
              <tr>
                <th className='text-dark'>Mã đơn hàng</th>
                <th className='text-dark'>Ngày tạo</th>
                <th className='text-dark'>Trạng thái</th>
                <th className='text-dark'>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {ordersList}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card-divider" />
      <div className="card-footer">
        <Pagination siblings={4} current={currentPage} total={page?.totalPages} onPageChange={(page) => setCurrentPage(page)} />
      </div>
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
      statusConverted = "Đã giao";
      break;
    default:
      statusConverted = "Đã hủy";
      break;
  }

  return statusConverted;
}
