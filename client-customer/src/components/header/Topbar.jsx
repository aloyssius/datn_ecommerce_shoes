// react
import React from 'react';
import { FaUser } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";

import { Link, useParams } from 'react-router-dom';

// application
import Dropdown from './Dropdown';
import useAuth from '../../hooks/useAuth';
import useLoading from '../../hooks/useLoading';


function Topbar() {

  const { logout, authUser, isAuthenticated } = useAuth();

  const accountLinks = [
    // { title: 'Dashboard', url: '/account/dashboard' },
    // { title: 'Edit Profile', url: '/account/profile' },
    // { title: 'Order History', url: '/account/orders' },
    // { title: 'Addresses', url: '/account/addresses' },
    // { title: 'Password', url: '/account/password' },
    { title: 'Tài khoản của tôi', url: `/account` },
    { title: 'Đăng xuất', action: () => logout() },
  ];

  return (
    <div className="site-header__topbar topbar">
      <div className="topbar__container container">
        <div className="topbar__row topbar-container">
          <div className="topbar__spring" />
          <Link to={'/track-order'} className="topbar-link">
            <div className="topbar-item">
              <BsFillBoxSeamFill className='topbar-item-icon' />
              <span className='topbar-item-name'>Tra cứu đơn hàng</span>
            </div>
          </Link>
          {!isAuthenticated &&
            <Link to={'/account/login'} className="topbar-link">
              <div className="topbar-item">
                <FaUser className='topbar-item-icon' />
                <span className='topbar-item-name'>Đăng nhập
                  <span className='divide'>|</span>
                  Đăng ký</span>
              </div>
            </Link>
          }

          {isAuthenticated &&
            <Dropdown
              title={authUser?.email}
              items={accountLinks}
              icon={<FaUser className='topbar-item-icon' />}
            />
          }

        </div>
      </div>
    </div>
  );
}

export default Topbar;
