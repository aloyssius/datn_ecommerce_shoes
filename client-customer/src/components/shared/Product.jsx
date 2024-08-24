// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// application
import AsyncAction from './AsyncAction';
import Currency from './Currency';
import InputNumber from './InputNumber';
import ProductGallery from './ProductGallery';
import { cartAddItem } from '../../store/cart';
import { compareAddItem } from '../../store/compare';
import { wishlistAddItem } from '../../store/wishlist';

import { formatCurrencyVnd } from '../../utils/formatNumber';
import { ProductStatus } from '../../enum/enum';
import { object } from 'yup';

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submit: false,
    };
  }

  handleChangeSubmit = (submit) => {
    this.setState({ submit });
  };

  componentDidUpdate(prevProps) {
    if (this.props.key !== prevProps.key) {
      this.handleChangeSubmit(false);
    }
  }

  render() {
    const {
      product,
      layout,
      onChangeSizeId,
      sizeId,
      fetch,
    } = this.props;

    const handleAddProductToCart = () => {
      this.handleChangeSubmit(true);

      if (sizeId === null) {
        return;
      }

      fetch(false);
    }

    const handleAddProductToCartByBuyNow = () => {
      this.handleChangeSubmit(true);

      if (sizeId === null) {
        return;
      }

      fetch(true);
    }

    let prices;

    let convertedPrice = parseInt(product?.price);

    product?.colors?.sort((a, b) => {
      if (a.sku === product.sku) return -1;
      if (b.sku === product.sku) return 1;
      return 0;
    });

    if (product.compareAtPrice) {
      prices = (
        <React.Fragment>
          <span className="product__new-price"><Currency value={product.price} /></span>
          {' '}
          <span className="product__old-price"><Currency value={product.compareAtPrice} /></span>
        </React.Fragment>
      );
    } else {
      prices = <span className='product__price'>{formatCurrencyVnd(convertedPrice)}</span>;
    }

    return (
      <div className={`product product--layout--${layout}`}>
        <div className="product__content">
          <ProductGallery layout={layout} images={product?.images} />

          <div className="product__info">
            <h1 className="product__name">{`${product?.name} ${product?.colorName}`}</h1>
            <ul className="product__meta">
              <li >
                Thương hiệu:
                {' '}
                <Link to="/"><span style={{ fontWeight: '500' }}> {product?.brandName}</span></Link>
              </li>
              <li >Mã sản phẩm: <span style={{ fontWeight: '500' }}>{product?.sku}</span></li>
            </ul>
          </div>

          <div className="product__sidebar">
            <div className="product__prices">
              {prices}
            </div>

            <div className='divide-product' />

            <form className="product__options">
              {product?.colors?.length > 1 &&
                <div className="form-group product__option">
                  <div className="product__option-label">Màu sắc</div>
                  <div className="input-radio-color">
                    <div className="input-radio-color__list">
                      {product?.colors?.map((item) => {
                        return (
                          <Link to={`/product-detail/${item?.sku}`}>
                            <label
                              className={`input-radio-color__item ${!isColorLight(item?.code) ? "" : "input-radio-color__item--white"}`}
                              style={{ color: item?.code }}
                              data-toggle="tooltip"
                              title={item?.name}
                            >
                              <input type="radio" name="color" checked={item?.colorId === product?.colorId} />
                              <span />
                            </label>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              }
              <div className="form-group product__option">
                <div className="product__option-label">Kích cỡ</div>
                <div className="input-radio-label">
                  <div className="input-radio-label__list">
                    {product?.sizes?.map((item) => {
                      if (item?.status === ProductStatus.IS_ACTIVE) {
                        return (
                          <label>
                            <input
                              className='input-radio-label__item'
                              onClick={() => onChangeSizeId(item?.id)}
                              type="radio"
                              name="size"
                              disabled={item?.quantity <= 0}
                              checked={sizeId === item.id}
                            />
                            <span style={{ cursor: 'pointer' }}>{item?.name}</span>
                          </label>
                        )
                      }
                    })}
                  </div>

                  {/* dataQuantity?.quantity &&
                    <div className='mt-3 h6 text-secondary'>{`${dataQuantity.quantity} sản phẩm có sẵn`} </div>
                  */}
                </div>
              </div>
              <div className='divide-product' />
              <div className="form-group product__option mt-4">
                <div className="product__actions">
                  {/*
                <label htmlFor="product-quantity" className="product__option-label">Số lượng</label>
                  <div className="product__actions-item">
                    <InputNumber
                      id="product-quantity"
                      aria-label="Quantity"
                      className="product__quantity"
                      size="lg"
                      min={1}
                      value={quantity}
                      onChange={this.handleChangeQuantity}
                    />
                  </div>
                  */}
                  <div className="product__actions-item product__actions-item--addtocart">
                    <button
                      onClick={() => handleAddProductToCart()}
                      type="button"
                      className='btn btn-secondary-light btn-lg'
                    >
                      THÊM VÀO GIỎ HÀNG
                    </button>
                  </div>
                  <div className="product__actions-item product__actions-item--addtocart">
                    <button
                      onClick={() => handleAddProductToCartByBuyNow()}
                      type="button"
                      className='btn btn-primary btn-lg'                        >
                      MUA NGAY
                    </button>
                  </div>
                </div>
                <p className='text-error-main mt-3'>{this.state.submit && sizeId === null && "Vui lòng chọn kích cỡ phù hợp"}</p>
              </div>
            </form>
          </div>

          <div className="product__footer">
            {/*
            <div className="product__tags tags">
              <div className="tags__list">
                <Link to="/">Nike</Link>
                <Link to="/">Nike 1</Link>
                <Link to="/">Nike 2</Link>
              </div>
            </div>
            */}

            <div className="product__share-links share-links">
              <ul className="share-links__list">
                <li className="share-links__item share-links__item--type--like"><Link to="/">Like</Link></li>
                <li className="share-links__item share-links__item--type--tweet"><Link to="/">Tweet</Link></li>
                <li className="share-links__item share-links__item--type--pin"><Link to="/">Pin It</Link></li>
                <li className="share-links__item share-links__item--type--counter"><Link to="/">4K</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Product.propTypes = {
  /** product object */
  product: PropTypes.object.isRequired,
  /** one of ['standard', 'sidebar', 'columnar', 'quickview'] (default: 'standard') */
  layout: PropTypes.oneOf(['standard', 'sidebar', 'columnar', 'quickview']),
};

Product.defaultProps = {
  layout: 'standard',
};

const mapDispatchToProps = {
  cartAddItem,
  wishlistAddItem,
  compareAddItem,
};

export default connect(
  () => ({}),
  mapDispatchToProps,
)(Product);

const isColorLight = (colorCode) => {
  let r = parseInt(colorCode.substring(1, 3), 16);
  let g = parseInt(colorCode.substring(3, 5), 16);
  let b = parseInt(colorCode.substring(5, 7), 16);

  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
}
