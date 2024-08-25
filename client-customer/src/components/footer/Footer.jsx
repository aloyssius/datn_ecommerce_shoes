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
    { title: 'Tuyển dụng', url: '' },
    { title: 'Liên hệ nhượng quyền', url: '' },
    { title: 'Về ĐKN Shop', url: '' },
    // { title: 'Brands', url: '' },
    // { title: 'Contact Us', url: '' },
    // { title: 'Returns', url: '' },
    // { title: 'Site Map', url: '' },
  ];

  const accountLinks = [
    { title: 'FAQs', url: '' },
    { title: 'Bảo mật thông tin', url: '' },
    { title: 'Chính sách chung', url: '' },
    { title: 'Tra cứu đơn hàng', url: '' },
    // { title: 'Specials', url: '' },
    // { title: 'Gift Certificates', url: '' },
    // { title: 'Affiliate', url: '' },
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
              <FooterLinks title="Về Công Ty" items={informationLinks} />
            </div>
            <div className="col-6 col-md-3 col-lg-2">
              <FooterLinks title="Hỗ Trợ" items={accountLinks} />
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
