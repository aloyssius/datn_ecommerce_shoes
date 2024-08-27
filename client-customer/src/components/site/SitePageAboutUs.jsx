// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageHeader from '../shared/PageHeader';
import { PATH_PAGE } from '../../routes/path';

// application
import SlickWithPreventSwipeClick from '../shared/SlickWithPreventSwipeClick';

// data stubs
import theme from '../../data/theme';
import Logo from '../Logo';


const slickSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  speed: 400,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 379,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const breadcrumb = [
  { title: 'Trang chủ', url: PATH_PAGE.root },
  { title: 'Giới thiệu', url: '' },
];

function SitePageAboutUs() {
  return (
    <div className="block about-us">
      <Helmet>
        <title>{`Giới thiệu — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      <div className="text-center">
        <Logo height={140} />
      </div>

      <div className='container mt-4' style={{ paddingInline: '190px' }}>
        <p style={{ fontSize: 20 }}>
          Chào mừng đến với <span style={{ fontWeight: '550' }}>[ĐKN Shop]</span> - điểm đến lý tưởng cho những ai đam mê thời trang và phong cách. Tại đây, chúng tôi tự hào mang đến cho bạn những sản phẩm giày dép chất lượng cao, đa dạng về mẫu mã và kiểu dáng để bạn có thể thoải mái lựa chọn.

          Với hơn 10 năm kinh nghiệm trong lĩnh vực bán giày dép, chúng tôi hiểu rõ nhu cầu và sở thích của khách hàng. Chính vì vậy, <span style={{ fontWeight: '550' }}>[ĐKN Shop]</span> luôn chú ý đến việc cập nhật những xu hướng thời trang mới nhất, đồng thời tìm kiếm và phân phối những sản phẩm giày dép ưu việt, đáp ứng mọi tiêu chí về chất lượng, thiết kế và cả giá.

          Ở rìa đó, chúng tôi kết nối với trải nghiệm mua sắm tuyệt vời cho khách hàng thông qua dịch vụ chăm sóc khách hàng chug, giao hàng nhanh chóng và chính sách mua hàng linh hoạt. Hãy cùng <span style={{ fontWeight: '550' }}>[ĐKN Shop]</span> khám phá những mẫu giày ưng ý và tạo nên phong cách riêng của bạn ngay hôm nay!
        </p>
      </div>

      {/*
            <div className="about-us__image" style={{ backgroundImage: 'url("images/aboutus.jpg")' }} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        <div className="about-us__body">
                            <h1 className="about-us__title">About Us</h1>
                            <div className="about-us__text typography">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Cras lacus metus, convallis ut leo nec, tincidunt
                                    eleifend justo. Ut felis orci, hendrerit a pulvinar et,
                                    gravida ac lorem. Sed vitae molestie sapien, at
                                    sollicitudin tortor.
                                </p>
                                <p>
                                    Duis id volutpat libero, id vestibulum purus.Donec euismod
                                    accumsan felis,egestas lobortis velit tempor vitae. Integer
                                    eget velit fermentum, dignissim odio non, bibendum velit.
                                </p>
                            </div>
                            <div className="about-us__team">
                                <h2 className="about-us__team-title">Meat Our Team</h2>
                                <div className="about-us__team-subtitle text-muted">
                                    Want to work in our friendly team?
                                    <br />
                                    <Link to="/site/contact-us">Contact us</Link>
                                    {' '}
                                    and we will consider your candidacy.
                                </div>
                                <div className="about-us__teammates teammates">
                                    <SlickWithPreventSwipeClick {...slickSettings}>
                                        <div className="teammates__item teammate">
                                            <div className="teammate__avatar">
                                                <img src="images/teammates/teammate-1.jpg" alt="" />
                                            </div>
                                            <div className="teammate__name">Michael Russo</div>
                                            <div className="teammate__position text-muted">Chief Executive Officer</div>
                                        </div>
                                        <div className="teammates__item teammate">
                                            <div className="teammate__avatar">
                                                <img src="images/teammates/teammate-2.jpg" alt="" />
                                            </div>
                                            <div className="teammate__name">Katherine Miller</div>
                                            <div className="teammate__position text-muted">Marketing Officer</div>
                                        </div>
                                        <div className="teammates__item teammate">
                                            <div className="teammate__avatar">
                                                <img src="images/teammates/teammate-3.jpg" alt="" />
                                            </div>
                                            <div className="teammate__name">Anthony Harris</div>
                                            <div className="teammate__position text-muted">Finance Director</div>
                                        </div>
                                    </SlickWithPreventSwipeClick>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      */}
    </div>
  );
}

export default SitePageAboutUs;
