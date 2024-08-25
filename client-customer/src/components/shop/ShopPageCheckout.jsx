// react
import React, { useEffect, useState } from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link, useLocation, useHistory } from 'react-router-dom';

// application
import Collapse from '../shared/Collapse';
import PageHeader from '../shared/PageHeader';

// data stubs
import payments from '../../data/shopPayments';
import deliverys from '../../data/shopDelivery';
import theme from '../../data/theme';
import { PATH_PAGE } from '../../routes/path';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { formatCurrencyVnd } from '../../utils/formatNumber';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import {
  FormProvider,
  RHFInput,
} from '../../components/hook-form';
import { isVietnamesePhoneNumberValid } from '../../utils/validate';
import useDeliveryApi from '../../hooks/useDelivery';
import { CLIENT_API } from '../../api/apiConfig';
import { Modal } from 'reactstrap';

const FREE_SHIP_AMOUNT = 1000000;

function ShopPageCheckout() {


  const { provinces, districts, wards, fetchDistrictsByProvinceId, fetchWardsByDistrictId, setDistricts, setWards, fetchShipFee, shipFee, setShipFee } = useDeliveryApi();
  const { cartItems, totalCart, resetCart } = useUser();
  const { authUser, isAuthenticated, addressDefault } = useAuth();
  const { post } = useFetch(null, { fetch: false });
  const [currentPayment, setCurrentPayment] = useState("cash");
  const [currentDelivery, setCurrentDelivery] = useState("ghn");
  const [errorProduct, setErrorProduct] = useState([]);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      history.replace(history.location.pathname, { isDeleted: true });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [history]);

  const locationState = location.state;
  const getVoucher = locationState && !locationState.isDeleted ? locationState.getVoucher : null;

  const caculatorShipFee = () => {
    if (totalCart >= FREE_SHIP_AMOUNT) {
      return "Miễn phí";
    }

    if (shipFee === 0) {
      return "-";
    }

    return formatCurrencyVnd(String(shipFee));
  }

  const total = (
    <React.Fragment>
      <tbody className="checkout__totals-subtotals">
        <tr>
          <th>Tổng tiền hàng</th>
          <td>{formatCurrencyVnd(String(totalCart))}</td>
        </tr>
        <tr>
          <th>Giảm giá</th>
          <td>{getVoucher?.discountValue ? `- ${formatCurrencyVnd(String(getVoucher?.discountValue))}` : "0 VNĐ"}</td>
        </tr>
        <tr>
          <th>Phí vận chuyển</th>
          <td>{caculatorShipFee()}</td>
        </tr>
      </tbody>
    </React.Fragment>
  );

  const getErrorMessage = (item) => {
    const errorItem = errorProduct?.find((err) => err.id === item.id);
    if (errorItem && errorItem.quantity === 0) {
      return (
        <p className='text-error mt-2'>
          Sản phẩm này hiện tại đã hết hàng, vui lòng cập nhật lại sản phẩm trong giỏ hàng
        </p>
      );
    } else if (errorItem) {
      return (
        <p className='text-error mt-2'>
          Sản phẩm này hiện tại số lượng chỉ còn {errorItem.quantity}, vui lòng cập nhật lại số lượng trong giỏ hàng
        </p>
      );
    }
    return null;
  };

  const items = cartItems?.map((item) => (
    <tr key={item?.cartDetailId}>
      <td>
        {`${item?.name} ${item?.colorName} - Size: ${item?.sizeName} × ${item?.quantity}`}
        {getErrorMessage(item)}
      </td>
      <td>{formatCurrencyVnd(String(parseInt(item?.price) * parseInt(item?.quantity)))}</td>
    </tr>
  ));

  const totalFinal = () => {
    if (getVoucher?.discountValue) {

      if (parseInt(getVoucher?.discountValue) >= parseInt(totalCart)) {
        return 0 + parseInt(totalCart >= FREE_SHIP_AMOUNT ? 0 : shipFee);
      }

      return parseInt(totalCart) - parseInt(getVoucher?.discountValue) + parseInt(totalCart >= FREE_SHIP_AMOUNT ? 0 : shipFee);
    }

    return parseInt(totalCart) + parseInt(totalCart >= FREE_SHIP_AMOUNT ? 0 : shipFee);
  }

  const cart = (
    <>
      <table className="checkout__totals">
        <thead className="checkout__totals-header">
          <tr>
            <th>Sản phẩm</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody className="checkout__totals-products">
          {items}
        </tbody>
        {total}
        <tfoot className="checkout__totals-footer">
          <tr>
            <th style={{ fontWeight: 'bold' }} className='total-final'>Tổng cộng</th>
            <td className='total-final product__price'>{totalFinal() !== 0 ? formatCurrencyVnd(String(totalFinal())) : "0 VNĐ"}</td>
          </tr>
        </tfoot>
      </table>
    </>
  );

  const deliveryList = deliverys.map((delivery) => {
    const renderDelivery = ({ setItemRef, setContentRef }) => (
      <li className="delivery-methods__item" ref={setItemRef}>
        <label className="delivery-methods__item-header">
          <span className="delivery-methods__item-radio input-radio">
            <span className="input-radio__body">
              <input
                type="radio"
                className="input-radio__input"
                name="checkout_delivery_method"
                value={delivery.key}
                checked={currentDelivery === delivery.key}
                onChange={(e) => setCurrentDelivery(e.target.value)}
              />
              <span className="input-radio__circle" />
            </span>
          </span>
          <span className="delivery-methods__item-title">{delivery.title}</span>
        </label>
        <div className="delivery-methods__item-container" ref={setContentRef} style={{ maxHeight: '300px' }}>
          <div className="delivery-methods__item-description text-dark">{delivery.shipping}</div>
          <div className="delivery-methods__item-description text-dark">{delivery.description}</div>
        </div>
      </li>
    );

    return (
      <Collapse
        key={delivery.key}
        open={currentDelivery === delivery.key}
        toggleClass="delivery-methods__item--active"
        render={renderDelivery}
      />
    );
  });

  const paymentList = payments.filter((item) => item.key !== "cashMethod").map((payment) => {
    const renderPayment = ({ setItemRef, setContentRef }) => (
      <li className="payment-methods__item" ref={setItemRef}>
        <label className="payment-methods__item-header">
          <span className="payment-methods__item-radio input-radio">
            <span className="input-radio__body">
              <input
                type="radio"
                className="input-radio__input"
                name="checkout_payment_method"
                value={payment.key}
                checked={currentPayment === payment.key}
                onChange={(e) => setCurrentPayment(e.target.value)}
              />
              <span className="input-radio__circle" />
            </span>
          </span>
          <span className="payment-methods__item-title">{payment.title}</span>
        </label>
        <div className="payment-methods__item-container" ref={setContentRef} style={{ maxHeight: '300px' }}>
          <div className="payment-methods__item-description text-dark">{payment.description}</div>
        </div>
      </li>
    );

    return (
      <Collapse
        key={payment.key}
        open={currentPayment === payment.key}
        toggleClass="payment-methods__item--active"
        render={renderPayment}
      />
    );
  });

  const breadcrumb = [
    { title: 'Trang chủ', url: PATH_PAGE.checkout.root },
    { title: 'Giỏ hàng', url: PATH_PAGE.cart.root },
    { title: 'Thanh toán đơn hàng', url: PATH_PAGE.checkout.root },
  ];

  const OrderSchema = Yup.object().shape({
    email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
    fullName: Yup.string().trim().test(
      'max',
      'Họ và tên quá dài (tối đa 50 ký tự)',
      value => value.trim().length <= 50
    ).required('Họ và tên không được để trống'),
    address: Yup.string().trim().test(
      'max',
      'Địa chỉ cụ thể quá dài (tối đa 255 ký tự)',
      value => value.trim().length <= 255
    ).required('Địa chỉ cụ thể không được để trống'),
    phoneNumber: Yup.string().trim().test('is-vietnamese-phone-number', 'SĐT không hợp lệ', (value) => {
      return isVietnamesePhoneNumberValid(value);
    }),
    province: Yup.string().required('Bạn chưa chọn Tỉnh/Thành'),
    district: Yup.string().required('Bạn chưa chọn Quận/Huyện'),
    ward: Yup.string().required('Bạn chưa chọn Xã/Phường'),
  });

  useEffect(() => {
    reset(defaultValues);

    if (addressDefault) {
      if (addressDefault?.provinceId) {
        fetchDistrictsByProvinceId(addressDefault?.provinceId);
      }

      if (addressDefault?.districtId) {
        fetchWardsByDistrictId(addressDefault?.districtId);
      }

      if (addressDefault?.wardCode && parseInt(totalCart) < FREE_SHIP_AMOUNT) {
        fetchShipFee(addressDefault?.districtId, addressDefault?.wardCode);
      }
    }

  }, [authUser, addressDefault])

  const defaultValues = {
    fullName: addressDefault?.fullName || '',
    email: authUser?.email || '',
    phoneNumber: addressDefault?.phoneNumber || '',
    note: '',
    address: addressDefault?.address || '',
    district: addressDefault?.districtId || '',
    province: addressDefault?.provinceId || '',
    ward: addressDefault?.wardCode || '',
  }

  const methods = useForm({
    resolver: yupResolver(OrderSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    reset,
    formState: { isSubmitted },
  } = methods;

  const onFinish = (res) => {
    if (res?.id) {
      history.push(PATH_PAGE.checkout.success, { order: res });
    }
    else {
      window.location.href = res;
    }
    resetCart();
  }

  const onError = (err) => {
    setErrorProduct(err?.error)
  }

  const onSubmit = async (data) => {
    const provinceName = provinces?.find(province => province.ProvinceID === parseInt(data?.province))?.ProvinceName;
    const districtName = districts?.find(district => district.DistrictID === parseInt(data?.district))?.DistrictName;
    const wardName = wards?.find(ward => ward.WardCode === data?.ward)?.WardName;

    const address = `${data?.address}, ${wardName}, ${districtName}, ${provinceName}`;
    const { ward, district, province, ...restData } = data;

    const body = {
      ...restData,
      address,
      moneyShip: shipFee,
      totalMoney: totalCart,
      discountAmount: getVoucher?.discountValue || null,
      cartItems,
      customerId: isAuthenticated ? authUser?.id : null,
      voucherId: getVoucher?.id || null,
      totalFinal: totalFinal(),
      paymentMethod: currentPayment,
    }
    console.log(body);
    post(CLIENT_API.bill.post, body, (res) => onFinish(res), (res) => onError(res), false);
  }

  const handleChangeProvince = (e) => {
    const value = e.target.value;

    setValue('district', "");
    setValue('ward', "");

    if (value !== "") {
      fetchDistrictsByProvinceId(value);
    }

    if (value === "") {
      setDistricts([]);
      setWards([]);
    }

    setShipFee(0);
    setValue('province', value);

    if (isSubmitted) {
      trigger(['district', 'ward', 'province']);
    }
  }

  const handleChangeDistrict = (e) => {
    const value = e.target.value;

    setValue('ward', "");

    if (value !== "") {
      fetchWardsByDistrictId(value);
    }

    if (value === "") {
      setWards([]);
    }

    setValue('district', value);
    setShipFee(0);

    if (isSubmitted) {
      trigger(['district', 'ward', 'province']);
    }
  }

  const handleChangeWard = (e) => {
    const value = e.target.value;

    setValue('ward', value);

    if (isSubmitted) {
      trigger(['district', 'ward', 'province']);
    }

    if (value !== "" && parseInt(totalCart) < FREE_SHIP_AMOUNT) {
      fetchShipFee(getValues('district'), getValues('ward'));
    }

    if (value === "") {
      setShipFee(0);
    }
  }

  return (
    <React.Fragment>
      {cartItems?.length > 0 ?
        <>
          <Helmet>
            <title>{`Thanh toán đơn hàng — ${theme.name}`}</title>
          </Helmet>

          <PageHeader header="Thanh toán đơn hàng" breadcrumb={breadcrumb} />

          <div className="checkout block">
            <div className="container">
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  {!isAuthenticated &&
                    <div className="col-12 mb-3">
                      <div className="alert alert-primary alert-lg">
                        Bạn đã có tài khoản?
                        {' '}
                        <Link to={PATH_PAGE.account.login_register}>Nhấn vào đây để đăng nhập</Link>
                      </div>
                    </div>
                  }

                  <div className="col-12 col-lg-6 col-xl-7">
                    <div className="card mb-lg-0">
                      <div className="card-body">
                        {/*
                        <div className='d-flex justify-content-between'>
                          <button onClick={() => setOpen(true)} type='button' className='btn btn-secondary-light btn-sm mt-1'>Chọn địa chỉ</button>
                        </div>
                        */}
                        <h3 className="card-title">Thông tin giao hàng</h3>
                        <RHFInput name='fullName' topLabel='Họ và tên' placeholder="Nhập họ và tên" isRequired />
                        <RHFInput name='phoneNumber' topLabel='Số điện thoại' placeholder="Nhập số điện thoại" isRequired />
                        <RHFInput name='email' topLabel='Email' placeholder="Nhập email" isRequired />

                        <Controller
                          name="province"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <div className="form-group">
                              <label>Tỉnh/Thành</label>
                              <span className="required">*</span>
                              <select
                                {...field}
                                id="checkout-country"
                                className={`${error ? "input-border-error" : ""} form-control`}
                                onChange={handleChangeProvince}
                              >
                                <option value="">Chọn Tỉnh/Thành</option>
                                {provinces?.map((province) => {
                                  return <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceName}</option>
                                })}
                              </select>
                              <span className='text-error'>{error?.message}</span>
                            </div>
                          )}
                        />

                        <div className="form-row">
                          <Controller
                            name="district"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <div className="form-group col-md-6">
                                <label>Quận/Huyện</label>
                                <span className="required">*</span>
                                <select
                                  {...field}
                                  id="checkout-country"
                                  className={`${error ? "input-border-error" : ""} form-control`}
                                  onChange={handleChangeDistrict}
                                >
                                  <option value="">Chọn Quận/Huyện</option>
                                  {districts?.map((district) => {
                                    return <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
                                  })}
                                </select>
                                <span className='text-error'>{error?.message}</span>
                              </div>
                            )}
                          />
                          <Controller
                            name="ward"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <div className="form-group col-md-6">
                                <label>Phường/Xã</label>
                                <span className="required">*</span>
                                <select
                                  {...field}
                                  className={`${error ? "input-border-error" : ""} form-control`}
                                  id="checkout-country"
                                  onChange={handleChangeWard}
                                >
                                  <option value="">Chọn Phường/Xã</option>
                                  {wards?.map((ward) => {
                                    return <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
                                  })}
                                </select>
                                <span className='text-error'>{error?.message}</span>
                              </div>
                            )}
                          />
                        </div>

                        <RHFInput name='address' topLabel='Địa chỉ cụ thể' placeholder="Nhập địa chỉ" isRequired />

                        <RHFInput
                          name='note'
                          topLabel='Ghi chú đơn hàng'
                          placeholder="Nhập ghi chú"
                          optional="Không bắt buộc"
                          textarea
                          row={4}
                        />

                      </div>
                      <div className="card-divider" />

                      <div className="card-body">
                        <h3 className="card-title">Phương thức giao hàng</h3>

                        <div className="delivery-methods">
                          <ul className="delivery-methods__list">
                            {deliveryList}
                          </ul>
                        </div>

                      </div>
                      <div className="card-divider" />

                      <div className="card-body">
                        <h3 className="card-title">Phương thức thanh toán</h3>

                        <div className="payment-methods">
                          <ul className="payment-methods__list">
                            {paymentList}
                          </ul>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0">
                    <div className="card mb-0">
                      <div className="card-body">
                        <h3 className="card-title">Đơn hàng
                          <div className='border-top-cart-page mt-2' />
                        </h3>
                        {cart}
                        {totalCart >= FREE_SHIP_AMOUNT &&
                          <p className='text-main' style={{ fontSize: 13.5 }}>Miễn phí vận chuyển đối với các đơn hàng từ 1,000,000đ trở lên</p>
                        }
                        <button type="submit" className="btn btn-primary btn-xl btn-block">Hoàn Tất Đặt Hàng</button>
                      </div>
                    </div>
                  </div>
                </div>
              </FormProvider>
            </div>
          </div>
        </>
        :
        <div className="block block-empty mt-5">
          <div className="container">
            <div className="block-empty__body">
              <div className="block-empty__message">Chưa có sản phẩm trong giỏ hàng!</div>
              <div className="block-empty__actions">
                <Link to={PATH_PAGE.root} className="btn btn-primary btn-sm">Tiếp tục mua hàng!</Link>
              </div>
            </div>
          </div>
        </div>
      }

      <Modal isOpen={open} fade={false} toggle={() => setOpen(false)} centered size="lg">
        <div className="" style={{ padding: "20px 30px", height: "auto" }}>
          <div className=''>
            <span style={{ fontWeight: 'bold', fontSize: 17.5 }}>{"DANH SÁCH ĐỊA CHỈ"}</span>
          </div>
          <div className='mt-2' style={{ border: "1px solid #333333" }}></div>

          <div className='mt-3'>
          </div>

        </div>
      </Modal>
    </React.Fragment>
  );
}


export default ShopPageCheckout;
