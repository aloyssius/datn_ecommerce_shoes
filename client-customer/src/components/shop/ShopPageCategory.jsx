// react
import React, { useState, useEffect } from 'react';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

// application
import CategorySidebar from './CategorySidebar';
import PageHeader from '../shared/PageHeader';
import ProductsView from './ProductsView';
import { sidebarClose } from '../../store/sidebar';

// data stubs
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import useFetch from '../../hooks/useFetch';
import useDebounce from '../../hooks/useDebounce';
import { CLIENT_API } from '../../api/apiConfig';
import { convertedtArr } from '../../utils/convert'


const MIN_PRICE = 299999;
const MAX_PRICE = 10000000;
const SORT_TYPE_DEFAULT = "isDefault";

function ShopPageCategory(props) {

  const { data, page, setParams, firstFetch, otherData, isLoading } = useFetch(CLIENT_API.product.all);

  const [currentPage, setCurrentPage] = useState(1);

  const [brandSelecteds, setBrandSelecteds] = useState([]);

  const [categorySelecteds, setCategorySelecteds] = useState([]);

  const [sizeSelecteds, setSizeSelecteds] = useState([]);

  const [colorSelecteds, setColorSelecteds] = useState([]);

  const [minPrice, setMinPrice] = useState(MIN_PRICE);

  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  const [price, setPrice] = useState({});

  const [sort, setSort] = useState({});

  const handleChangePage = (page) => {
    setCurrentPage(page);
  }

  const handleSelecteAttributeIds = (attribute, id) => {
    if (attribute === "categories") {
      setCategorySelecteds(getSelectAttribute(categorySelecteds, id));
    }
    if (attribute === "colors") {
      setColorSelecteds(getSelectAttribute(colorSelecteds, id));
    }
    if (attribute === "brands") {
      setBrandSelecteds(getSelectAttribute(brandSelecteds, id));
    }
    if (attribute === "sizes") {
      setSizeSelecteds(getSelectAttribute(sizeSelecteds, id));
    }
  }

  const handleChangeSort = (sort) => {
    setSort(sort);
  }

  const handleChangePrice = (min, max) => {
    setPrice({ min, max });
  }
  const debounceValue = useDebounce(price, 500);

  useEffect(() => {
    setMinPrice(debounceValue?.min);
    setMaxPrice(debounceValue?.max);
  }, [debounceValue]);

  const handleFilter = () => {
    const params = {
      currentPage,
      // search: filterSearch || null,
      brandIds: brandSelecteds.length === 0 ? null : convertedtArr(brandSelecteds),
      categoryIds: categorySelecteds.length === 0 ? null : convertedtArr(categorySelecteds),
      colorIds: colorSelecteds.length === 0 ? null : convertedtArr(colorSelecteds),
      sizeIds: sizeSelecteds.length === 0 ? null : convertedtArr(sizeSelecteds),
      minPrice,
      maxPrice,
      sortType: sort === SORT_TYPE_DEFAULT ? null : sort,
    };
    setParams(params);
  }

  useEffect(() => {
    if (firstFetch) {
      handleFilter();
    }
    console.log(sort);
  }, [currentPage, categorySelecteds, sizeSelecteds, colorSelecteds, brandSelecteds, minPrice, maxPrice, sort])

  const {
    columns,
    viewMode,
    sidebarPosition,
  } = props;

  const breadcrumb = [
    { title: 'Trang chủ', url: '/' },
    { title: 'Sản phẩm', url: '' },
  ];
  let content;

  const offcanvas = columns === 3 ? 'mobile' : 'always';

  if (columns > 3) {
    content = (
      <div className="container">
        <div className="block">
          <ProductsView
            products={data}
            layout={viewMode}
            grid={`grid-${columns}-full`}
            limit={15}
            offcanvas={offcanvas}
          />
        </div>
        {<CategorySidebar offcanvas={offcanvas} />}
      </div>
    );
  } else {
    const sidebar = (
      <div className="shop-layout__sidebar">
        {
          <CategorySidebar
            otherData={otherData}
            offcanvas={offcanvas}
            onSelectAttributeIds={handleSelecteAttributeIds}
            onChangePrice={handleChangePrice}
            isLoading={isLoading}
            dataPage={page}
          />
        }
      </div>
    );

    content = (
      <div className="container">
        <div className={`shop-layout shop-layout--sidebar--${sidebarPosition}`}>
          {sidebarPosition === 'start' && sidebar}
          <div className="shop-layout__content">
            <div className="block">
              <ProductsView
                onChangePage={handleChangePage}
                onSort={handleChangeSort}
                dataPage={page}
                products={data}
                layout={viewMode}
                grid="grid-3-sidebar"
                limit={15}
                offcanvas={offcanvas}
              />
            </div>
          </div>
          {sidebarPosition === 'end' && sidebar}
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Sản phẩm - ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      {content}
    </React.Fragment>
  );
}

ShopPageCategory.propTypes = {
  /**
   * number of product columns (default: 3)
   */
  columns: PropTypes.number,
  /**
   * mode of viewing the list of products (default: 'grid')
   * one of ['grid', 'grid-with-features', 'list']
   */
  viewMode: PropTypes.oneOf(['grid', 'grid-with-features', 'list']),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(['start', 'end']),
};

ShopPageCategory.defaultProps = {
  columns: 3,
  viewMode: 'grid',
  sidebarPosition: 'start',
};

const mapStateToProps = (state) => ({
  sidebarState: state.sidebar,
});

const mapDispatchToProps = {
  sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopPageCategory);

const getSelectAttribute = (attributeSelecteds, id) => {
  const index = attributeSelecteds.indexOf(id);
  let updatedAttributeSelecteds = [];

  if (index !== -1) {
    updatedAttributeSelecteds = attributeSelecteds.filter(attrId => attrId !== id);
  } else {
    updatedAttributeSelecteds = [...attributeSelecteds, id];
  }

  return updatedAttributeSelecteds;
}
