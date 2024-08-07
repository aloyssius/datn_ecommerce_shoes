// react
import React from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import { Check12x9Svg } from '../../svg';


function FilterColor(props) {
  const { items, onSelectAttributeIds, attribute } = props;

  const itemsList = items?.map((item) => (

    <div key={item.id} className="filter-color__item" title={item.name}>
      <span
        className={classNames('filter-color__check input-check-color', {
          'input-check-color--white': false,
          'input-check-color--light': isColorLight(item?.code),
        })}
        style={{ color: item?.code }}
      >
        <label className="input-check-color__body">
          <input className="input-check-color__input" type="checkbox" onClick={() => onSelectAttributeIds(attribute, item.id)} />
          <span className="input-check-color__box" />
          <Check12x9Svg className="input-check-color__icon" />
          <span className="input-check-color__stick" />
        </label>
      </span>
    </div>
  ));

  return (
    <div className="filter-color">
      <div className="filter-color__list">
        {itemsList}
      </div>
    </div>
  );
}

FilterColor.propTypes = {
  items: PropTypes.array,
  attribute: PropTypes.string,
  onSelectAttributeIds: PropTypes.func,
};

export default FilterColor;

const isColorLight = (colorCode) => {
  let r = parseInt(colorCode.substring(1, 3), 16);
  let g = parseInt(colorCode.substring(3, 5), 16);
  let b = parseInt(colorCode.substring(5, 7), 16);

  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
}
