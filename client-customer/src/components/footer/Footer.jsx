// react
import React from 'react';

// application
import FooterContacts from './FooterContacts';
import FooterLinks from './FooterLinks';
import FooterNewsletter from './FooterNewsletter';

// data stubs
import theme from '../../data/theme';


export default function Footer() {
  const informationLinks = [
    { title: 'About Us', url: '' },
    { title: 'Delivery Information', url: '' },
    { title: 'Privacy Policy', url: '' },
    { title: 'Brands', url: '' },
    { title: 'Contact Us', url: '' },
    { title: 'Returns', url: '' },
    { title: 'Site Map', url: '' },
  ];

  const accountLinks = [
    { title: 'Store Location', url: '' },
    { title: 'Order History', url: '' },
    { title: 'Wish List', url: '' },
    { title: 'Newsletter', url: '' },
    { title: 'Specials', url: '' },
    { title: 'Gift Certificates', url: '' },
    { title: 'Affiliate', url: '' },
  ];

  return (
    <div className="site-footer">
      <div className="container">
        <div className="site-footer__widgets">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <FooterContacts />
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <FooterLinks title="Information" items={informationLinks} />
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <FooterLinks title="My Account" items={accountLinks} />
            </div>
            <div className="col-12 col-md-12 col-lg-4">
              <FooterNewsletter />
            </div>
          </div>
        </div>

        <div className="site-footer__bottom d-flex justify-content-center">
          <div className="site-footer__copyright">
            Copyright © 2024 ĐKN Shop. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
