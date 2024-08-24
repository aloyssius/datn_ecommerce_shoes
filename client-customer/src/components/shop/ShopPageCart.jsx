// react
import React, { useState } from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';

// application
import InputNumber from '../shared/InputNumber';
import PageHeader from '../shared/PageHeader';
import { Cross12Svg } from '../../svg';
import Logo from '../Logo'

// data stubs
import theme from '../../data/theme';
import { PATH_PAGE } from '../../routes/path';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';
import { parse, isBefore } from 'date-fns';

const ARR_QUANTITY = [1, 2, 3];

const CartItem = ({ item, onRemove, user, onUpdateCartSize, onUpdateCartQuantity, cartItems, onCheckVoucherIsValid }) => {
  const [size, setSize] = useState(item?.id);
  const [quantity, setQuantity] = useState(item?.quantity);

  const existingSizes = cartItems?.filter((cartItem) => cartItem?.sku === item?.sku && cartItem?.id !== item.id)?.map(cartItem => cartItem?.id);

  const totalPrice = item?.price * item?.quantity;
  let image;

  let sizes = item?.sizes;

  const handleChangeSize = (e) => {
    const value = e.target.value;
    if (user) {
      onUpdateCartSize(item?.cartDetailId, value);
    }
    else {
      onUpdateCartSize(item?.id, value);
    }
    setSize(value);
    console.log(value);
  }

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (user) {
      onUpdateCartQuantity(item?.cartDetailId, value, (res) => onCheckVoucherIsValid(res));
    }
    else {
      onUpdateCartQuantity(item?.id, value, (res) => onCheckVoucherIsValid(res));
    }
    setQuantity(value);
    console.log(value);
  }

  if (item.pathUrl) {
    image = <Link to={`/product-detail/${item?.sku}`}><img src={item?.pathUrl} alt="" /></Link>;
  }

  const removeButton = (
    <button type="button" onClick={() => onRemove(!user ? item?.id : item?.cartDetailId, (res) => onCheckVoucherIsValid(res))} className='btn btn-light btn-sm btn-svg-icon'>
      <Cross12Svg />
    </button>
  );

  return (
    <>
      <tr key={item?.cartDetailId} className="cart-table__row">
        <td className="cart-table__column cart-table__column--image">
          {image}
        </td>
        <td className="cart-table__column cart-table__column--product" >
          <Link to={`/product-detail/${item?.sku}`} className="cart-table__product-name">
            <span className='' style={{ fontWeight: '500' }}>
              {`${item?.name} ${item?.colorName}`}
            </span>
          </Link>
        </td>
        <td className="cart-table__column cart-table__column--quantity" data-title="Kích cỡ" >
          <select
            className="form-control form-control-sm view-options-custom"
            id="view-options-sizes"
            value={size}
            onChange={handleChangeSize}
          >
            {sizes?.map(option => (
              <option key={option?.id} value={option?.id} disabled={existingSizes.includes(option.id) || option?.quantity <= 0}>
                {option?.name} {option?.quantity <= 0 && `(Hết hàng)`}
              </option>
            ))}
          </select>
        </td>
        <td className="cart-table__column cart-table__column--quantity" data-title="Số lượng">
          {/*
          <InputNumber
            // onChange={(quantity) => this.handleChangeQuantity(item, quantity)}
            value={item?.quantity}
            min={1}
          />
          */}
          <select
            className="form-control form-control-sm view-options-custom"
            id="view-options-sizes"
            value={quantity}
            onChange={handleChangeQuantity}
          >
            {ARR_QUANTITY.map(option => (
              <option key={option} value={option} disabled={option > item?.stock}>
                {option}
              </option>
            ))}
          </select>
        </td>
        <td className="cart-table__column cart-table__column--price" data-title="Đơn giá" style={{ fontWeight: '500' }}>
          {formatCurrencyVnd(String(item?.price))}
        </td>
        <td className="cart-table__column cart-table__column--total product__price" data-title="Thành tiền">
          {formatCurrencyVnd(String(totalPrice))}
        </td>
        <td className="cart-table__column cart-table__column--remove">
          {removeButton}
        </td>
      </tr>
      {item?.stock <= 0 ?
        <tr key={item?.id} className="cart-table__row">
          <td colSpan={7} className="cart-table__column text-center" style={{ padding: 10 }}>
            <span className='text-main' style={{ fontSize: 15 }}>Sản phẩm đã hết hàng. Vui lòng chọn sản phẩm khác</span>
          </td>
        </tr>
        :
        item?.quantity > item?.stock ?
          <tr key={item?.id} className="cart-table__row">
            <td colSpan={7} className="cart-table__column text-center" style={{ padding: 10 }}>
              <span className='text-main' style={{ fontSize: 15 }}>Hiện tại trong hệ thống chỉ còn {item?.stock} sản phẩm. Vui lòng cập nhật lại số lượng</span>
            </td>
          </tr> : null
      }
    </>
  );
}

function ShopPageCart() {

  const [inputVoucher, setInputVoucher] = useState("");
  const [errorVoucher, setErrorVoucher] = useState("");
  const [voucher, setVoucher] = useState({});
  const history = useHistory();
  const { cartItems, onRemoveCartItem, onUpdateCartSize, onUpdateCartQuantity, totalCart } = useUser();
  const { authUser } = useAuth();
  const { fetch } = useFetch(null, { fetch: false });

  const isErrorCart = cartItems?.some((item) => item?.quantity > item?.stock);

  const handleRedirectCheckout = () => {

    // const parsedEndTime = parse(voucher?.endTime, 'HH:mm:ss dd-MM-yyyy', new Date());
    // const currentDateTime = new Date();
    //
    // if (voucher?.code && isBefore(parsedEndTime, currentDateTime)) {
    //   setErrorVoucher("Mã khuyến mãi đã hết hạn sử dụng")
    //   return;
    // }

    if (!isErrorCart) {

      if (voucher?.code) {
        const getVoucher = {
          ...voucher,
          discountValue: caculatorVoucher(),
        }
        history.push(PATH_PAGE.checkout.root, { getVoucher, isDeleted: false });
      }
      else {
        history.push(PATH_PAGE.checkout.root);
      }
    }

  }

  const onFinishVoucher = (res) => {
    setVoucher(res);
    setErrorVoucher("");
  }

  const onErrorVoucher = (res) => {
    setVoucher({});
    setErrorVoucher(res?.message);
  }

  const handleGetVoucher = () => {
    if (inputVoucher?.trim() !== "") {
      const body = {
        code: inputVoucher,
        totalCart,
      }
      fetch(CLIENT_API.voucher.details, body, (res) => onFinishVoucher(res), (res) => onErrorVoucher(res), false);
    }
    else {
      setVoucher({});
      setErrorVoucher("");
    }
  }

  const caculatorVoucher = () => {
    if (voucher?.code) {

      if (voucher?.typeDiscount === "percent") {
        const discountValue = parseInt(totalCart) * (parseInt(voucher.value) / 100);
        return discountValue > voucher?.maxDiscountValue ? parseInt(voucher?.maxDiscountValue) : parseInt(discountValue);
      }

      return parseInt(voucher?.value);
    }

    return 0;
  }

  const totalFinal = () => {
    if (parseInt(caculatorVoucher()) >= parseInt(totalCart)) {
      return 0;
    }

    return parseInt(totalCart) - parseInt(caculatorVoucher());
  }

  const handleCheckVoucherIsValid = (total) => {
    console.log(123)
    console.log(total);
    console.log(voucher?.minOrderValue);
    if (voucher?.code && total < voucher?.minOrderValue) {
      setVoucher({});
    }
    setErrorVoucher("");
  }

  const items = cartItems?.map((item) => {
    return <CartItem
      key={item?.cartDetailId}
      user={authUser}
      onRemove={onRemoveCartItem}
      onUpdateCartSize={onUpdateCartSize}
      onUpdateCartQuantity={onUpdateCartQuantity}
      onCheckVoucherIsValid={handleCheckVoucherIsValid}
      item={item}
      cartItems={cartItems}
    />
  });

  const cart = (
    <div className="cart block">
      <div className="container">
        <table className="cart__table cart-table">
          <thead className="cart-table__head">
            <tr className="cart-table__row">
              <th className="cart-table__column cart-table__column--image">Hình ảnh</th>
              <th className="cart-table__column cart-table__column--product">Tên sản phẩm</th>
              <th className="cart-table__column cart-table__column--quantity">Kích cỡ</th>
              <th className="cart-table__column cart-table__column--quantity">Số lượng</th>
              <th className="cart-table__column cart-table__column--price">Đơn giá</th>
              <th className="cart-table__column cart-table__column--total">Thành tiền</th>
              <th className="cart-table__column cart-table__column--remove" aria-label="Remove" />
            </tr>
          </thead>
          <tbody className="cart-table__body">
            {items}
          </tbody>
        </table>
        <div className="cart__actions">
          <form className="cart__coupon-form">
            <label htmlFor="input-coupon-code" className="sr-only">Password</label>
            <input
              type="text"
              value={inputVoucher}
              onChange={(e) => setInputVoucher(e.target.value)}
              className="form-control"
              id="input-coupon-code"
              placeholder="Nhập mã khuyến mãi"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // handleGetVoucher();
                }
              }}
            />
            <button type="button" onClick={handleGetVoucher} className="btn btn-primary">Áp dụng</button>
          </form>
          <div className="cart__buttons">
            <Link to={PATH_PAGE.root} className="btn btn-light text-dark">Tiếp tục mua hàng</Link>
          </div>
        </div>
        <p className='mt-3 text-main'>{errorVoucher}</p>
        {voucher?.id &&
          <div class="coupon mt-3">
            <div class="price">
              <Logo height={90} />
            </div>
            <div class="info">
              <h3 className='text-main'>{`Giảm ${voucher?.typeDiscount === 'percent' ? voucher?.value : formatCurrencyVnd(String(voucher?.value), "đ")}${voucher?.typeDiscount === 'percent' ? '%' : ''}`}</h3>

              <p>
                {voucher?.typeDiscount === 'percent' && `Giảm tối đa ${formatCurrencyVnd(String(voucher?.maxDiscountValue), "đ")}`}
              </p>
              <p>
                {`Đơn tối thiểu ${voucher?.minOrderValue === 0 ? "0đ" : formatCurrencyVnd(String(voucher?.minOrderValue), "đ")}`}
              </p>

              <p className='mt-2'>Mã:
                <span style={{ fontWeight: 'bold' }}>{` ${voucher?.code}`}</span>
              </p>
              <p>HSD: {voucher?.endTime}</p>
            </div>
          </div>
        }

        <div className="row justify-content-end pt-md-5 pt-4">
          <div className="col-12 col-md-7 col-lg-6 col-xl-5">
            <div className="card">
              <div className="card-body-cart">
                <h4 className="text-uppercase">Thông tin đơn hàng</h4>
                <div className='border-top-cart-page' />
                <table className="cart__totals">
                  <tfoot className="cart__totals-footer">
                    <tr>
                      <th className='total-cart' style={{ fontWeight: 'bold' }}>Tổng tiền hàng</th>
                      <td className='total-cart' style={{ fontWeight: 'bold' }}>{formatCurrencyVnd(totalCart)}</td>
                    </tr>
                    <tr>
                      <th className='total-discount' style={{ fontWeight: 'bold' }}>Giảm giá</th>
                      <td className='total-discount' style={{ fontWeight: 'bold' }}>{caculatorVoucher() > 0 ? `- ${formatCurrencyVnd(parseInt(caculatorVoucher()))}` : `${caculatorVoucher()} VNĐ`}</td>
                    </tr>
                  </tfoot>
                </table>
                <div className='border-bottom-cart-page' />
                <table className="cart__totals">
                  <tfoot className="cart__totals-footer">
                    <tr>
                      <th className='total-final' style={{ fontWeight: 'bold' }}>Tạm tính</th>
                      <td className='total-final product__price'>{totalFinal() !== 0 ? formatCurrencyVnd(String(totalFinal())) : "0 VNĐ"}</td>
                    </tr>
                  </tfoot>
                </table>
                <button onClick={handleRedirectCheckout} className="btn btn-primary btn-xl btn-block cart__checkout-button">
                  Tiếp tục thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const breadcrumb = [
    { title: 'Trang chủ', url: PATH_PAGE.root },
    { title: 'Giỏ hàng', url: PATH_PAGE.cart.root },
  ];

  let content;

  if (cartItems.length > 0) {
    content = cart;
  } else {
    content = (
      <div className="block block-empty">
        <div className="container">
          <div className="block-empty__body">
            <div className="block-empty__message">Chưa có sản phẩm trong giỏ hàng!</div>
            <div className="block-empty__actions">
              <Link to={PATH_PAGE.root} className="btn btn-primary btn-sm">Tiếp tục mua hàng!</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Giỏ hàng của bạn — ${theme.name}`}</title>
      </Helmet>

      <PageHeader header="Giỏ hàng của bạn" breadcrumb={breadcrumb} />

      {content}
    </React.Fragment>
  );
}

export default ShopPageCart;
