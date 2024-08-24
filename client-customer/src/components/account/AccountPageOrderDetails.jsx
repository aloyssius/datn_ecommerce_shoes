// react
import React, { useEffect, useState } from 'react';

// third-party
import { Link, useParams, useHistory, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Modal } from 'reactstrap';
import Collapse from '../shared/Collapse';

import theme from '../../data/theme';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';
import useAuth from '../../hooks/useAuth';
import useConfirm from '../../hooks/useConfirm';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import {
  FaTruck,
  FaRegCalendarCheck,
  FaRegFileAlt,
  FaRegCalendarTimes,
  FaBusinessTime,
} from "react-icons/fa";
import PageHeader from '../shared/PageHeader';
import { PATH_PAGE } from '../../routes/path';
import payments from '../../data/shopPayments';

export default function AccountPageOrderDetails({ trackOrder }) {

  const { authUser, isInitialized } = useAuth();
  const { showSuccess } = useConfirm();
  const { code } = useParams();
  const { fetch, res, put, post, setRes } = useFetch(null, { fetch: false });
  const [open, setOpen] = useState(false);
  const [openMethodPayment, setOpenMethodPayment] = useState(false);
  const [desc, setDesc] = useState("");
  const [errDesc, setErrDesc] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (trackOrder) {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");
      fetch(CLIENT_API.bill.details, { token, type: "queryToken" });
    }
  }, []);

  useEffect(() => {
    if (authUser && isInitialized && !trackOrder) {
      fetch(CLIENT_API.account.billDetail, { accountId: authUser?.id, code, })
    }
  }, [authUser, isInitialized])

  const breadcrumb = [
    { title: 'Trang chủ', url: PATH_PAGE.root },
    { title: 'Tài khoản', url: PATH_PAGE.account.root },
    { title: 'Lịch sử mua hàng', url: PATH_PAGE.account.orders },
    { title: `#${res?.code || ""}`, url: '' },
  ];

  const breadcrumbTrackOrder = [
    { title: 'Trang chủ', url: PATH_PAGE.root },
    { title: 'Tra cứu đơn hàng', url: PATH_PAGE.track_order.root },
    { title: `#${res?.code || ""}`, url: '' },
  ];

  const onFinish = (res) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setRes(res);
    setOpen(false);
    showSuccess("Hủy đơn hàng thành công!");
  }

  const handleCanceledOrder = () => {

    if (desc.trim() === "") {
      setErrDesc("Bạn chưa nhập lý do hủy dơn");
      return;
    }

    const body = {
      id: res?.id,
      desc,
    }

    if (authUser) {
      put(CLIENT_API.account.billStatus, body, (res) => onFinish(res), false, true);
    }
    else {
      put(CLIENT_API.bill.billStatus, body, (res) => onFinish(res), false, true);
    }
  }

  const hanleCreatePayment = () => {
    const body = {
      code: res?.code, totalFinal
    }
    post(CLIENT_API.bill.create_payment, body, (res) => window.location.href = res);
  }

  const onFinishUpdatePaymentMethod = (res) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setRes(res);
    setOpenMethodPayment(false);
    showSuccess("Thay đổi phương thức thanh toán thành công!");
  }

  const handleChangePaymentMethod = () => {
    const body = {
      id: res?.id,
    }

    if (authUser) {
      put(CLIENT_API.account.billPaymentMethod, body, (res) => onFinishUpdatePaymentMethod(res), false);
    }
    else {
      put(CLIENT_API.bill.paymentMethod, body, (res) => onFinishUpdatePaymentMethod(res), false);
    }
  }

  const isOrderNotPaymentTransfer = () => {
    if (res?.paymentMethod === "transfer" && res?.payment === null && res?.status === "pending_confirm") {
      return true;
    }

    return false;
  }

  const historiesFiltered = res?.histories?.filter((item, index, self) =>
    index === self.findIndex((t) => t.status === item.status)
  );

  const paymentList = payments.filter((item) => item.key === "cashMethod").map((payment) => {
    const renderPayment = ({ setItemRef, setContentRef }) => (
      <div className="payment-methods__item" ref={setItemRef}>
        <label className="payment-methods__item-header">
          <span className="payment-methods__item-radio input-radio">
            <span className="input-radio__body">
              <input
                type="radio"
                className="input-radio__input"
                name="checkout_payment_method"
                value={payment.key}
                checked={true}
              />
              <span className="input-radio__circle" />
            </span>
          </span>
          <span className="payment-methods__item-title">{payment.title}</span>
        </label>
        <div className="payment-methods__item-container" ref={setContentRef} style={{ maxHeight: '300px' }}>
          <div className="payment-methods__item-description text-dark">{payment.description}</div>
        </div>
      </div>
    );

    return (
      <Collapse
        key={payment.key}
        open={true}
        toggleClass="payment-methods__item--active"
        render={renderPayment}
      />
    );
  });

  const ship = res?.shipFee || 0;
  const totalMoney = res?.totalMoney || 0;
  const discount = res?.discount || 0;
  const totalFinal = parseInt(totalMoney) - parseInt(discount) + parseInt(ship);

  const billItems = res?.billItems?.map((item) => {
    return (
      <>
        <tr key={item?.billDetailId} className="cart-table__row">
          <td className="cart-table__column cart-table__column--image">
            <Link to={`/product-detail/${item?.sku}`}><img src={item?.pathUrl} alt="" /></Link>
          </td>
          <td className="cart-table__column cart-table__column--product" >
            <Link to={`/product-detail/${item?.sku}`} className="cart-table__product-name">
              <span className='' style={{ fontWeight: '500' }}>
                {`${item?.name} ${item?.colorName}`}
              </span>
            </Link>
          </td>
          <td className="cart-table__column cart-table__column--price text-center" data-title="Kích cỡ" >
            {item?.sizeName}
          </td>
          <td className="cart-table__column cart-table__column--price text-center" data-title="Số lượng">
            {item?.quantity}
          </td>
          <td className="cart-table__column cart-table__column--price" data-title="Đơn giá" style={{ fontWeight: '500' }}>
            {formatCurrencyVnd(String(item?.price))}
          </td>
          <td className="cart-table__column cart-table__column--total product__price" data-title="Thành tiền">
            {formatCurrencyVnd(String(item?.price * item?.quantity))}
          </td>
        </tr>
      </>
    )
  })

  return (
    <>
      <PageHeader breadcrumb={!trackOrder ? breadcrumb : breadcrumbTrackOrder} />
      <div className="container">
        {res?.id &&
          <React.Fragment>
            <Helmet>
              <title>{`Theo dõi đơn hàng — ${theme.name}`}</title>
            </Helmet>

            <div className="text-center">
              <h1>THÔNG TIN ĐƠN HÀNG</h1>
            </div>
            <div className='d-flex justify-content-between flex-column flex-md-row mt-3 mt-lg-4'>
              <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>TRẠNG THÁI ĐƠN HÀNG: <span className='text-main text-uppercase'>
                {isOrderNotPaymentTransfer() ? "Chờ thanh toán" : convertOrderStatus(res?.status)}
              </span>
              </span>
              <span className='text-secondary' style={{ fontSize: 16 }}> Đơn vị vận chuyển: Giao Hàng Nhanh </span>
            </div>
            {isOrderNotPaymentTransfer() &&
              <div className=''>
                <span className='text-main' style={{ fontSize: 16 }}>Vui lòng thanh toán đơn hàng sau 24h kể từ bây giờ nếu không đơn hàng sẽ tự động bị hủy bỏ</span>
              </div>
            }

            <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

            <div className='timeline-container'>
              <div className="timeline">
                <Timeline
                  minEvents={res?.histories?.length + 5}
                  placeholder
                >
                  {historiesFiltered?.map((item, index) => {
                    return (
                      <TimelineEvent
                        icon={
                          (item?.status === "created" && FaRegFileAlt) ||
                          (item?.status === "waitting_delivery" && FaBusinessTime) ||
                          (item?.status === "delivering" && FaTruck) ||
                          (item?.status === "completed" && FaRegCalendarCheck) ||
                          (item?.status === "canceled" && FaRegCalendarTimes)
                        }
                        title={
                          <div className="mt-3">
                            <span className={index === historiesFiltered?.length - 1 ? "text-main" : "text"} style={{ whiteSpace: "pre-line", fontSize: "18px", fontWeight: 'bold' }}>
                              {item?.action}
                            </span>
                          </div>
                        }
                        subtitle={
                          <>
                            <span className='mt-1 d-block' style={{ fontSize: 12 }}>
                              Vào lúc {item?.createdAt}
                            </span>
                          </>
                        }
                        color={
                          "#FF6700"
                        }
                      />
                    )
                  })}
                </Timeline>
              </div>
            </div>

            <div className='d-flex mt-4 justify-content-between flex-column flex-md-row'>
              <div className='d-flex  flex-column flex-md-row'>
                {isOrderNotPaymentTransfer() &&
                  <>
                    <button onClick={() => hanleCreatePayment()} className='btn btn-md btn-primary'>Thanh toán ngay</button>
                    <button onClick={() => setOpenMethodPayment(true)} className='btn btn-md btn-secondary-light ml-md-3 mt-md-0 mt-3'>Đổi phương thức thanh toán</button>
                  </>
                }
                {(res?.status === "pending_confirm" || res?.status === "waitting_delivery") &&
                  <button onClick={() => setOpen(true)} className={`btn btn-secondary-light btn-md ${res?.paymentMethod === "transfer" && res?.payment === null && "ml-md-3 mt-md-0 mt-3"}`}>Hủy đơn hàng</button>
                }
              </div>
            </div>

            <div className='mt-4 pt-3'>
              <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>DANH SÁCH SẢN PHẨM</span>
            </div>
            <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

            <table className="cart__table cart-table mt-3" style={{ fontSize: 15 }}>
              <thead className="cart-table__head">
                <tr className="cart-table__row">
                  <th className="cart-table__column cart-table__column--image">Hình ảnh</th>
                  <th className="cart-table__column cart-table__column--product">Tên sản phẩm</th>
                  <th className="cart-table__column cart-table__column--price text-center">Kích cỡ</th>
                  <th className="cart-table__column cart-table__column--price text-center">Số lượng</th>
                  <th className="cart-table__column cart-table__column--price">Đơn giá</th>
                  <th className="cart-table__column cart-table__column--total">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="cart-table__body">
                {billItems}
              </tbody>
            </table>

            <div className='row mb-4'>
              <div className='col-md-6 col-12'>
                <div className='mt-5'>
                  <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>THÔNG TIN GIAO HÀNG</span>
                </div>
                <div className='mt-2' style={{ border: "1px solid #333333" }}></div>
                <div className='mt-3'>
                  <span className='d-block' style={{ fontSize: 16 }}> <span>Họ tên: {res?.fullName}</span></span>
                  <span className='d-block mt-1' style={{ fontSize: 16 }}>Số điện thoại: {res?.phoneNumber}</span>
                  <span className='d-block mt-1' style={{ fontSize: 16 }}>Email: {res?.email}</span>
                  <span className='d-block mt-1' style={{ fontSize: 16 }}>Địa chỉ: {res?.address}</span>
                </div>
              </div>
              <div className='col-md-6 col-12'>
                <div className='mt-5'>
                  <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>THÔNG TIN THANH TOÁN</span>
                </div>
                <div className='mt-2' style={{ border: "1px solid #333333" }}></div>
                <div className='mt-3'>
                  <div>
                    <span style={{ fontSize: 16 }}>
                      Hình thức thanh toán: {" "}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {res?.paymentMethod === "transfer" ? "Thanh toán trực truyến" : "Thanh toán khi nhận hàng (COD)"}</span>
                  </div>

                  <div className='mt-1' >
                    <span style={{ fontSize: 16 }}>
                      Tổng tiền hàng: {" "}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {formatCurrencyVnd(String(totalMoney))}</span>
                  </div>

                  <div className='mt-1' >
                    <span style={{ fontSize: 16 }}>
                      Giảm giá: {" "}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {discount !== 0 ? `- ${formatCurrencyVnd(String(discount))}` : "0 VNĐ"}</span>
                  </div>

                  <div className='mt-1' >
                    <span style={{ fontSize: 16 }}>
                      Phí vận chuyển: {" "}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {formatCurrencyVnd(String(ship)) || "0 VNĐ"}</span>
                  </div>

                  <div className='mt-4' style={{ border: "1px dashed #dcdccd" }}></div>

                  <div className='mt-4' >
                    <span style={{ fontSize: 16, fontWeight: '500' }}>
                      Tổng thanh toán: {" "}
                    </span>
                    <span className='text-main' style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {formatCurrencyVnd(String(totalFinal))}</span>
                  </div>

                  <div className='mt-1' >
                    <span style={{ fontSize: 16, fontWeight: '500' }}>
                      Trạng thái thanh toán: {" "}
                    </span>
                    <span className='text-main' style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {res?.payment ? "Đã thanh toán" : "Chưa thanh toán"}</span>
                  </div>

                </div>
              </div>
            </div>
          </React.Fragment>
        }
      </div>
      <Modal isOpen={open} fade={false} toggle={() => setOpen(false)} centered size="lg">
        <div className="" style={{ padding: "20px 30px", height: "auto" }}>
          <div className=''>
            <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>HỦY ĐƠN HÀNG</span>
          </div>
          <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

          <textarea type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className='form-control mt-3' rows={5} placeholder="Nhập lý do hủy đơn hàng" />
          <span className='text-error d-block mt-2'>{errDesc}</span>
          <div className="d-flex justify-content-end">
            <button onClick={handleCanceledOrder} className='btn mt-3 btn-primary btn-confirm-cancel' >Xác nhận</button>
          </div>

        </div>
      </Modal>

      <Modal isOpen={openMethodPayment} fade={false} toggle={() => setOpenMethodPayment(false)} centered size="lg">
        <div className="" style={{ padding: "20px 30px", height: "auto" }}>
          <div className=''>
            <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>THAY ĐỔI PHƯƠNG THỨC THANH TOÁN</span>
          </div>
          <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

          <div className='mt-3'>
            {paymentList}
          </div>
          <div className="d-flex justify-content-end">
            <button onClick={handleChangePaymentMethod} className='btn mt-3 btn-primary btn-confirm-cancel' >Xác nhận</button>
          </div>

        </div>
      </Modal>
    </>
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

