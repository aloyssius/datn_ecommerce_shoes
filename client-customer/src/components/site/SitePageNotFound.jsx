// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// data stubs
import theme from '../../data/theme';
import { PATH_PAGE } from '../../routes/path';


function SitePageNotFound() {
  return (
    <div className="block">
      <Helmet>
        <title>{`404 Page Not Found — ${theme.name}`}</title>
      </Helmet>

      <div className="container">
        <div className="not-found">

          <div className='text-center mt-5 pt-4'>
            <img width={500} src="https://ananas.vn/wp-content/themes/ananas/assets/images/page_not_found.png" alt="" />
          </div>

          <Link to={PATH_PAGE.root} className="btn btn-primary btn-xl mt-5">Quay lại trang chủ</Link>
        </div>
      </div>
    </div>
  );
}

export default SitePageNotFound;
