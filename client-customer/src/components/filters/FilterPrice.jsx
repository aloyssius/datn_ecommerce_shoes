// react
import React, { Component } from 'react';

// third-party
import InputRange from 'react-input-range';
import PropTypes from 'prop-types';

// application
import Currency from '../shared/Currency';
import { formatCurrencyVnd } from '../../utils/formatNumber';


export default class FilterPrice extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange = (value) => {
    this.setState(() => ({
      from: value.min,
      to: value.max,
    }));
    this.props?.onChangePrice(value?.min, value?.max);
  };

  render() {
    const { from: stateFrom, to: stateTo } = this.state;
    const {
      min,
      max,
      step,
      from: propsFrom,
      to: propsTo,
      otherData,
    } = this.props;

    const from = Math.max(stateFrom || propsFrom || min, min);
    const to = Math.min(stateTo || propsTo || max, max);

    return (
      <div className="filter-price">
        {otherData?.brands &&
          <>
            <div className="filter-price__slider" >
              <InputRange
                minValue={min}
                maxValue={max}
                value={{ min: from, max: to }}
                step={step}
                onChange={this.handleChange}
              />
            </div>
            <div className="filter-price__title">
              <span className="filter-price__min-value">{formatCurrencyVnd(String(from))}</span>
              {' – '}
              <span className="filter-price__max-value">{formatCurrencyVnd(String(to))}</span>
            </div>
          </>
        }
      </div>
    );
  }
}

FilterPrice.propTypes = {
  from: PropTypes.number,
  to: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  isLoading: PropTypes.bool,
};

FilterPrice.defaultProps = {
  from: undefined,
  to: undefined,
  min: 0,
  max: 100,
  step: 1,
  isLoading: false,
};
