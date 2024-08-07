// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// application
import Pagination from '../shared/Pagination';
import ProductCard from '../shared/ProductCard';
import {
  Filters16Svg,
  LayoutGrid16x16Svg,
  LayoutGridWithDetails16x16Svg,
  LayoutList16x16Svg,
} from '../../svg';
import { sidebarOpen } from '../../store/sidebar';

class ProductsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      selectedSortOption: '',
    };
  }

  handleSortChange = (e) => {
    this.setState({
      selectedSortOption: e.target.value,
    });
    this.props?.onSort(e.target.value);
  };

  setLayout = (layout) => {
    this.setState(() => ({ layout }));
  };

  handlePageChange = (page) => {
    this.setState(() => ({ page }));
    this.props?.onChangePage(page);
  };

  render() {
    const {
      products,
      grid,
      offcanvas,
      layout: propsLayout,
      sidebarOpen,
      dataPage,
      onSort,
    } = this.props;

    const sortOptions = [
      { value: 'isDefault', label: 'Mặc định' },
      { value: 'lowToHigh', label: 'Giá thấp đến cao' },
      { value: 'highToLow', label: 'Giá cao xuống thấp' },
      // { value: 'nameAZ', label: 'Tên (A-Z)' }
    ];

    const { page, layout: stateLayout } = this.state;
    const layout = stateLayout || propsLayout;

    let viewModes = [
      { key: 'grid', title: 'Grid', icon: <LayoutGrid16x16Svg /> },
      { key: 'grid-with-features', title: 'Grid With Features', icon: <LayoutGridWithDetails16x16Svg /> },
      { key: 'list', title: 'List', icon: <LayoutList16x16Svg /> },
    ];

    viewModes = viewModes.map((viewMode) => {
      const className = classNames('layout-switcher__button', {
        'layout-switcher__button--active': layout === viewMode.key,
      });

      return (
        <button
          key={viewMode.key}
          title={viewMode.title}
          type="button"
          className={className}
          onClick={() => this.setLayout(viewMode.key)}
        >
          {viewMode.icon}
        </button>
      );
    });

    const productsList = products.map((product) => (
      <div key={product.id} className="products-list__item">
        <ProductCard product={product} />
      </div>
    ));

    const viewOptionsClasses = classNames('view-options', {
      'view-options--offcanvas--always': offcanvas === 'always',
      'view-options--offcanvas--mobile': offcanvas === 'mobile',
    });

    return (
      <div className="products-view">
        <div className="products-view__options">
          <div className={viewOptionsClasses}>
            <div className="view-options__filters-button">
              <button type="button" className="filters-button" onClick={() => sidebarOpen()}>
                <Filters16Svg className="filters-button__icon" />
                <span className="filters-button__title">Bộ lọc</span>
                {/*
                <span className="filters-button__counter">{dataPage?.totalElements || 0}</span>
                */}
              </button>
            </div>
            {products.length > 0 &&
              <>
                <div className="view-options__legend">Hiển thị {((dataPage?.currentPage - 1) * dataPage?.pageSize) + 1} – {dataPage?.pageSize * dataPage?.currentPage} trên {dataPage?.totalElements} sản phẩm</div>
                <div className="view-options__divider" />
                <div className="view-options__control">
                  <label htmlFor="view-options-sort">Sắp xếp theo</label>
                  <div>
                    <select
                      className="form-control form-control-sm"
                      id="view-options-sort"
                      value={this.state.selectedSortOption}
                      onChange={this.handleSortChange}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            }
          </div>
        </div>
        {products.length > 0 &&
          <>
            <div
              className="products-view__list products-list"
              data-layout={'grid-3-sidebar'}
              data-with-features={layout === 'grid-with-features' ? 'true' : 'false'}
            >
              <div className="products-list__body">
                {productsList}
              </div>
            </div>

            <div className="products-view__pagination">
              <Pagination
                current={page}
                siblings={4}
                total={dataPage?.totalPages}
                onPageChange={this.handlePageChange}
              />
            </div>
          </>
        }
      </div>
    );
  }
}

ProductsView.propTypes = {
  /**
   * array of product objects
   */
  products: PropTypes.array,
  /**
   * products list layout (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  layout: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
  /**
   * products list layout (default: 'grid')
   * one of ['grid-3-sidebar', 'grid-4-full', 'grid-5-full']
   */
  grid: PropTypes.oneOf(['grid-3-sidebar', 'grid-4-full', 'grid-5-full']),
  /**
   * indicates when sidebar bar should be off canvas
   */
  offcanvas: PropTypes.oneOf(['always', 'mobile']),
  dataPage: PropTypes.object,
  onChangePage: PropTypes.func,
};

ProductsView.defaultProps = {
  products: [],
  layout: 'grid',
  grid: 'grid-3-sidebar',
  offcanvas: 'mobile',
  dataPage: {},
  onChangePage: () => { },
  onSort: () => { },
};

const mapDispatchToProps = {
  sidebarOpen,
};

export default connect(
  () => ({}),
  mapDispatchToProps,
)(ProductsView);
