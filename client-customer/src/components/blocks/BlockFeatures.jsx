// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';

// application
import {
  FiFreeDelivery48Svg,
  FiPaymentSecurity48Svg,
  FiTag48Svg,

} from '../../svg';

export default function BlockFeatures(props) {
  const { layout } = props;

  return (
    <div className={`block block-features block-features--layout--${layout}`}>
      <div className="container">
        <div className="block-features__list">
          <div className="block-features__item">
            <div className="block-features__icon">
              <FiFreeDelivery48Svg />
            </div>
            <div className="block-features__content">
              <div className="block-features__title">Miễn phí vận chuyển</div>
              <div className="block-features__subtitle">Cho đơn hàng từ 1,000,000 trở đi</div>
            </div>
          </div>
          <div className="block-features__divider" />
          <div className="block-features__item">
            <div className="block-features__icon">
              <FiTag48Svg />
            </div>
            <div className="block-features__content">
              <div className="block-features__title">Ưu đãi hấp dẫn</div>
              <div className="block-features__subtitle">Được tặng voucher lên đến 90%</div>
            </div>
          </div>
          <div className="block-features__divider" />
          <div className="block-features__item">
            <div className="block-features__icon">
              <FiPaymentSecurity48Svg />
            </div>
            <div className="block-features__content">
              <div className="block-features__title">Sản phẩm chính hãng</div>
              <div className="block-features__subtitle">Cam kết 100% hàng chính hãng</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

BlockFeatures.propTypes = {
  layout: PropTypes.oneOf(['classic', 'boxed']),
};

BlockFeatures.defaultProps = {
  layout: 'classic',
};
