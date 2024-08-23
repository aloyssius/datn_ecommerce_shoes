// react
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

// application
import Indicator from './Indicator';
import { Cart20Svg, Cross10Svg } from '../../svg';
import { formatCurrencyVnd } from '../../utils/formatNumber';
import useUser from '../../hooks/useUser';
import useAuth from '../../hooks/useAuth';
import { PATH_PAGE } from '../../routes/path';


function IndicatorCart() {
  const { cartItems, onRemoveCartItem } = useUser();
  const { authUser } = useAuth();

  let dropdown;

  const totalPrice = cartItems && cartItems.reduce((total, item) => total + (item?.price * item?.quantity), 0);

  const items = cartItems?.map((item, index) => {
    let image;

    if (item.pathUrl) {
      image = (
        <div className="dropcart__product-image">
          <Link to={`/product-detail/${item?.sku}`}>
            <img src={item?.pathUrl} alt="" />
          </Link>
        </div>
      );
    }

    const removeButton = (
      <button type="button" onClick={() => onRemoveCartItem(!authUser ? item?.id : item?.cartDetailId)} className='dropcart__product-remove btn btn-light btn-sm btn-svg-icon'>
        <Cross10Svg />
      </button>
    );

    return (
      <>
        <div key={item?.id} className="dropcart__product" style={{ paddingTop: "13px" }}>
          {image}
          <div className="dropcart__product-info">
            <div className="dropcart__product-name">
              <Link to={`/product-detail/${item?.sku}`}>
                <span className='dropcart__product-name'>{`${item?.name} ${item?.colorName}`}</span>
              </Link>
            </div>
            <div className="dropcart__product-meta">
              <span className="dropcart__product-price">{formatCurrencyVnd(String(item?.price))}</span>

              <div className='d-flex justify-content-between dropcart__product-size'>
                <span>Size:</span>
                <span>{item?.sizeName}</span>
              </div>
              <div className='d-flex justify-content-between dropcart__product-quantity'>
                <span>Số lượng:</span>
                <span>{item?.quantity}</span>
              </div>
            </div>
          </div>
          {removeButton}
        </div>
        {index !== cartItems?.length - 1 && <div className='border-bottom-product-cart' />}
      </>
    );
  });

  if (cartItems?.length > 0) {
    dropdown = (
      <div className="dropcart">
        <div className="dropcart__products-list-border-top">
          <span className='cart-name'>GIỎ HÀNG {`(${cartItems?.length})`}</span>
          <div className='border-top-cart' />
        </div>
        <div className="dropcart__products-list">
          {items}
        </div>
        <div className="dropcart__products-list-border-bottom">
          <div className='border-bottom-cart' />
        </div>

        <div className="dropcart__totals">
          <table>
            <tbody>
              <tr>
                <th className='cart-total-text'>Tổng cộng</th>
                <td className='cart-total'>{formatCurrencyVnd(String(totalPrice))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="dropcart__buttons">
          <Link className="btn btn-primary" to={PATH_PAGE.cart.root}>Thanh toán</Link>
        </div>
      </div>
    );
  } else {
    dropdown = (
      <div className="dropcart">
        <div className="dropcart__empty">
          Chưa có sản phẩm trong giỏ hàng!
        </div>
      </div>
    );
  }

  return (
    <Indicator dropdown={dropdown} value={cartItems?.length} icon={<Cart20Svg />} />
  );
}

export default IndicatorCart;
