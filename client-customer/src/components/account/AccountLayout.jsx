// react
import React from 'react';

// third-party
import classNames from 'classnames';
import {
  Link,
  matchPath,
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';

// application
import PageHeader from '../shared/PageHeader';

// pages
import AccountPageAddresses from './AccountPageAddresses';
import AccountPageOrders from './AccountPageOrders';
import AccountPagePassword from './AccountPagePassword';
import AccountPageProfile from './AccountPageProfile';
import { PATH_PAGE } from '../../routes/path';


export default function AccountLayout(props) {
  const { match, location } = props;

  const breadcrumb = [
    { title: 'Trang chủ', url: PATH_PAGE.root },
    { title: 'Tài khoản', url: '' },
  ];

  const links = [
    { title: 'Thông tin tài khoản', url: 'info' },
    { title: 'Lịch sử mua hàng', url: 'orders' },
    { title: 'Danh sách địa chỉ', url: 'addresses' },
    { title: 'Đổi mật khẩu', url: 'change-password' },
  ].map((link) => {
    const url = `${match.url}/${link.url}`;
    const isActive = matchPath(location.pathname, { path: url });
    const classes = classNames('account-nav__item', {
      'account-nav__item--active': isActive,
    });

    return (
      <li key={link.url} className={classes}>
        <Link className="link" to={url}>{link.title}</Link>
      </li>
    );
  });

  return (
    <React.Fragment>
      <PageHeader header="Tài khoản" breadcrumb={breadcrumb} />

      <div className="block">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-3 d-flex">
              <div className="account-nav flex-grow-1">
                <ul className='mt-4'>{links}</ul>
              </div>
            </div>
            <div className="col-12 col-lg-9 mt-4 mt-lg-0">
              <Switch>
                <Redirect exact from={match.path} to={`${match.path}/info`} />
                <Route exact path={`${match.path}/info`} component={AccountPageProfile} />
                <Route exact path={`${match.path}/orders`} component={AccountPageOrders} />
                <Route exact path={`${match.path}/addresses`} component={AccountPageAddresses} />
                <Route exact path={`${match.path}/change-password`} component={AccountPagePassword} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
