// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// application
import Currency from './Currency';
import { cartAddItem } from '../../store/cart';
import { compareAddItem } from '../../store/compare';
import { quickviewOpen } from '../../store/quickview';
import { wishlistAddItem } from '../../store/wishlist';
import { PiShoppingCartDuotone } from "react-icons/pi";
import { FaCartPlus } from "react-icons/fa";

import { formatCurrencyVnd } from '../../utils/formatNumber';

function ProductCard(props) {
  const {
    product,
    layout,
    quickviewOpen,
    cartAddItem,
    wishlistAddItem,
    compareAddItem,
  } = props;
  const containerClasses = classNames('product-card', {
    'product-card--layout--grid product-card--size--sm': layout === 'grid-sm',
    'product-card--layout--grid product-card--size--nl': layout === 'grid-nl',
    'product-card--layout--grid product-card--size--lg': layout === 'grid-lg',
    'product-card--layout--list': layout === 'list',
    'product-card--layout--horizontal': layout === 'horizontal',
  });

  let badges = [];
  let image;
  let price;

  // if (product.badges.includes('sale')) {
  //   badges.push(<div key="sale" className="product-card__badge product-card__badge--sale">Sale</div>);
  // }
  // if (product.badges.includes('hot')) {
  //   badges.push(<div key="hot" className="product-card__badge product-card__badge--hot">Hot</div>);
  // }
  // if (product.badges.includes('new')) {
  //   badges.push(<div key="new" className="product-card__badge product-card__badge--new">New</div>);
  // }

  // badges = badges.length ? <div className="product-card__badges-list">{badges}</div> : null;

  if (product.pathUrl) {
    image = (
      <div className="product-card__image">
        <Link to={`/product-detail/${product?.sku}`}><img src={product?.pathUrl} alt="" /></Link>
        {/*
        <FaCartPlus title='Thêm vào giỏ hàng' className='icon-cart-plus' />
        */}
      </div>
    );
  }

  if (product.compareAtPrice) {
    price = (
      <div className="product-card__prices">
        <span className="product-card__new-price"><Currency value={product.price} /></span>
        {' '}
        <span className="product-card__old-price"><Currency value={product.compareAtPrice} /></span>
      </div>
    );
  } else {
    price = (
      <div className="product-card__prices">
        {`${formatCurrencyVnd(String(product?.price))}`}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/*badges*/}
      {image}
      <div className="product-card__info">
        <div className="product-card__name">
          <Link to={`/product-detail/${product?.sku}`}>{`${product?.name} ${product?.colorName}`}</Link>
        </div>
      </div>
      <div className="product-card__actions">
        {price}
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  /**
   * product object
   */
  product: PropTypes.object.isRequired,
  /**
   * product card layout
   * one of ['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']
   */
  layout: PropTypes.oneOf(['grid-sm', 'grid-nl', 'grid-lg', 'list', 'horizontal']),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
  quickviewOpen,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductCard);
