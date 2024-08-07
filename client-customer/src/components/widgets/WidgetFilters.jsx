// react
import React, { useState } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';

// application
import Collapse from '../shared/Collapse';
import FilterCategories from '../filters/FilterCategories';
import FilterCheckbox from '../filters/FilterCheckbox';
import FilterColor from '../filters/FilterColor';
import FilterPrice from '../filters/FilterPrice';
import FilterRadio from '../filters/FilterRadio';
import { ArrowRoundedDown12x7Svg } from '../../svg';


function WidgetFilters(props) {
  const {
    title,
    filters,
    otherData,
    offcanvas,
    onSelectAttributeIds,
    onChangePrice,
    isLoading,
    dataPage,
    gender,
  } = props;

  console.log(gender);

  const filtersList = filters.filter(item => {
    if (gender === null) {
      return true;
    }
    else if (gender !== null) {
      return item.attribute !== 'categories';
    }
  }).map((filter) => {
    let filterView;
    let items;
    let attribute = filter?.attribute;
    if (attribute && otherData) {
      items = getValueFromOtherData(attribute, otherData);
    }

    if (filter.type === 'categories') {
      filterView = <FilterCategories key={gender} categories={filter.options.items} />;
    } else if (filter.type === 'checkbox') {
      filterView =
        <FilterCheckbox
          onSelectAttributeIds={onSelectAttributeIds}
          attribute={attribute || ""}
          items={items || []}
        />;
    }
    // else if (['checkbox', 'radio'].includes(filter.type)) {
    //   filterView = (
    //     <FilterRadio
    //       items={filter.options.items}
    //       name={filter.options.name}
    //     />
    //   );
    // } 
    else if (filter.type === 'color') {
      filterView = <FilterColor
        items={items || []}
        attribute={attribute || ""}
        onSelectAttributeIds={onSelectAttributeIds}
      />;
    } else if (filter.type === 'price') {
      filterView = (
        <FilterPrice
          isLoading={isLoading}
          otherData={otherData}
          onChangePrice={onChangePrice}
          from={filter.options.from}
          to={filter.options.to}
          min={filter.options.min}
          max={filter.options.max}
          step={1}
        />
      );
    }

    return (
      <div key={filter.id} className="widget-filters__item">
        <Collapse
          toggleClass="filter--opened"
          render={({ toggle, setItemRef, setContentRef }) => (
            <div className="filter filter--opened" ref={setItemRef}>
              <button type="button" className="filter__title" onClick={toggle}>
                {filter.name}
                <ArrowRoundedDown12x7Svg className="filter__arrow" />
              </button>
              <div className="filter__body" ref={setContentRef}>
                <div className="filter__container">
                  {filterView}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    );
  });

  const classes = classNames('widget-filters widget', {
    'widget-filters--offcanvas--always': offcanvas === 'always',
    'widget-filters--offcanvas--mobile': offcanvas === 'mobile',
  });

  return (
    <div className={classes} style={{ paddingBottom: 0 }}>
      <h4 className="widget-filters__title widget__title">{title}</h4>

      <div className="widget-filters__list" >
        {filtersList}
      </div>

      {/*
      <div className="widget-filters__actions d-flex">
        <button type="button" className="btn btn-primary btn-sm">Lọc</button>
        <button type="button" className="btn btn-secondary btn-sm ml-2">Làm mới</button>
      </div>
      */}
    </div>
  );
}

WidgetFilters.propTypes = {
  /**
   * widget title
   */
  title: PropTypes.node,
  /**
   * array of filters
   */
  filters: PropTypes.array,
  /**
   * indicates when sidebar bar should be off canvas
   */
  offcanvas: PropTypes.oneOf(['always', 'mobile']),
  otherData: PropTypes.object,
  onSelectAttributeIds: PropTypes.func,
  onChangePrice: PropTypes.func,
  isLoading: PropTypes.bool,
};

WidgetFilters.defaultProps = {
  filters: [],
  offcanvas: 'mobile',
};

export default WidgetFilters;


function getValueFromOtherData(attribute, otherData) {
  for (let key in otherData) {
    if (key === attribute) {
      return otherData[key];
    }
  }
  return null;
}

