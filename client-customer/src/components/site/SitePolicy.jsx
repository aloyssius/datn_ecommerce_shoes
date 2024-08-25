// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import PageHeader from '../shared/PageHeader';
import { PATH_PAGE } from '../../routes/path';


// data stubs
import theme from '../../data/theme';
import Logo from '../Logo';



const breadcrumb = [
  { title: 'Trang chủ', url: PATH_PAGE.root },
  { title: 'Chính sách', url: '' },
];

function SitePolicy() {
  return (
    <div className="block about-us">
      <Helmet>
        <title>{`Giới thiệu — ${theme.name}`}</title>
      </Helmet>

      <PageHeader breadcrumb={breadcrumb} />

      <div className="text-center">
        <Logo height={140} />
      </div>

      <div className='container mt-4' style={{ paddingInline: '10px' }}>
        <p style={{ fontSize: 20 }}>
          <p style={{ fontWeight: 'bold', fontSize: 25 }}>
            1. QUY ĐỊNH VỀ TRUY CẬP VÀ SỬ DỤNG WEBSITE
          </p>
          <p>
            Khi truy cập vào website của chúng tôi, bạn cần đảm bảo việc bạn có đủ hành vi dân sự để thực hiện các giao dịch mua hàng theo quy định hiện hành của pháp luật Việt Nam. Hãy đảm bảo rằng bạn đã đủ 16 tuổi hoặc truy cập dưới sự giám sát của các thành viên trong gia đình hay người giám hộ hợp pháp.
            Trong suốt quá trình đăng ký, sử dụng website,… bạn có toàn quyền quyết định mình sẽ được nhận thư quảng cáo, tin tức về các chương trình khuyến mãi thông qua Email mà bạn đã đăng ký hay không. Nếu không muốn tiếp tục nhận Email từ ĐKN-Shop, bạn cũng có toàn quyền từ chối bằng cách nhấp vào đường dẫn ở dưới cùng trong thư điện tử được gửi đến bất kỳ.
            ĐKN-Shop không mong muốn bạn sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào nội dung, hệ thống hay làm thay đổi cấu trúc dữ liệu của website chúng tôi. Các hình thức phát tán, truyền bá, cổ vũ không được phép hay can thiệp, thay đổi, xóa bỏ nội dung, cấu trúc dữ liệu hệ thống của chúng tôi một cách bất hợp pháp đều sẽ có hình thức xử lý từ ĐKN-Shop. Mọi cá nhân hoặc tổ chức nếu vi phạm sẽ chịu truy tố trước pháp luật và phải bồi thường thiệt hại đã gây ra.
          </p>

          <p style={{ fontWeight: 'bold', fontSize: 25 }}>
            2. QUY ĐỊNH VỀ BẢO MẬT THÔNG TIN
          </p>
          <p>
            ĐKN-Shop luôn coi trọng việc bảo mật thông tin và cam kết sẽ sử dụng mọi biện pháp tốt nhất nhằm bảo vệ thông tin bạn đã cung cấp cho chúng tôi.
            Ở một mặt khác, bạn hoàn toàn có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. Thông tin của bạn, nếu có, cũng đều sẽ được mã hóa để đảm bảo an toàn trong suốt quá trình giao dịch tại website ĐKN-Shop. Riêng trường hợp được cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.
            ĐKN-Shop tuân thủ các biện pháp đảm bảo an toàn/ bảo mật thông tin tài khoản thanh toán cá nhân theo quy định của pháp luật cũng như các quy định và các khuyến nghị về giám sát của Ngân hàng Nhà nước.
          </p>

          <p style={{ fontWeight: 'bold', fontSize: 25 }}>
            3. ĐIỀU KHOẢN VỀ THÔNG TIN SẢN PHẨM, GIÁ CẢ, DỊCH VỤ VÀ CÁC NỘI DUNG KHÁC
          </p>
          <p>
            Chúng tôi cam kết sẽ cung cấp thông tin sản phẩm, giá cả, dịch vụ và nội dung khác chính xác nhất đến người dùng. Tuy nhiên, đôi lúc vẫn có sai sót xảy ra, ví dụ như trường hợp giá cả sản phẩm, phí vận chuyển, hình ảnh sản phẩm,… không hiển thị chính xác ở một vài thời điểm và trên một số thiết bị. Tùy theo từng trường hợp cụ thể, ĐKN-Shop sẽ liên hệ trực tiếp nhằm hướng dẫn hoặc thông báo đến bạn để khắc phục và xử lý.
          </p>
          <p style={{ fontWeight: 'bold', fontSize: 25 }}>
            4. ĐIỀU KHOẢN VỀ HỦY BỎ ĐƠN HÀNG VỚI HÌNH THỨC THANH TOÁN TRỰC TUYẾN
          </p>
          <p>
            Đối với các đơn hàng đã được thanh toán thành công qua hình thức thanh toán trực truyến, nếu khách hàng yêu cầu hủy đơn hàng và muốn hoàn tiền hay thay thế một sản phẩm khác có cùng đơn giá thì phải liên hệ trực tiếp cho cửa hàng để xử lý.
          </p>

        </p>
      </div>

    </div>
  );
}

export default SitePolicy;
