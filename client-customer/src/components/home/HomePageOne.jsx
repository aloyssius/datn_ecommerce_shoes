// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';

// blocks
import BlockBanner from '../blocks/BlockBanner';
import BlockBrands from '../blocks/BlockBrands';
import BlockFeatures from '../blocks/BlockFeatures';
import BlockSlideShow from '../blocks/BlockSlideShow';

// data stubs
import ProductCard from '../shared/ProductCard';

import useFetch from '../../hooks/useFetch';
import { CLIENT_API } from '../../api/apiConfig';


function HomePageOne() {

  const { data } = useFetch(CLIENT_API.product.home);

  const productsList = data?.new?.map((product) => (
    <div
      key={product.id}
      className="products-list__item"
    >
      <ProductCard product={product} />
    </div>
  ));

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Trang chủ - ĐKN Shop`}</title>
      </Helmet>

      <BlockSlideShow />

      <BlockFeatures />

      <HeaderProductList title="SẢN PHẨM MỚI NHẤT" />

      <ProductList style={{ marginBottom: 30 }} data={productsList} />

      <ButtonViewMore />

      <BlockBanner />

      <HeaderProductList title="SẢN PHẨM BÁN CHẠY" />

      <ProductList style={{ marginBottom: 30 }} data={productsList} />

      <ButtonViewMore />

      <BlockBrands />
    </React.Fragment>
  );
}

const ProductList = ({ data, ...other }) => {
  return (
    <div
      className="products-view__list products-list container"
      data-layout='grid-4-full'
      {...other}
    >
      <div className="products-list__body">
        {data?.slice(0, 8)}
      </div>
    </div>
  )
}

const ButtonViewMore = () => {
  return (
    <div className='d-flex justify-content-center' style={{ marginBottom: 35 }}>
      <button className='btn btn-primary'>Xem thêm</button>
    </div>
  )
}

const HeaderProductList = ({ title }) => {
  return (
    <div className='d-flex justify-content-center' style={{ marginBottom: 30 }}>
      <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#ff6700' }}>{title}</span>
    </div>
  )
}

export default HomePageOne;
