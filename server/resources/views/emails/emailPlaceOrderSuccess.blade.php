<!DOCTYPE html>
<html>

<head>
    <title>Thông báo đặt hàng thành công từ ĐKN Shop</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
    <style type="text/css">
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: 'Roboto';
            font-size: 35px;
        }


        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        @media screen and (max-width: 480px) {
            .mobile-hide {
                display: none !important;
            }

            .mobile-center {
                text-align: center !important;
            }
        }

        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>

<body style="margin: 0 !important; padding: 0 !important; background-color: #eeeeee" bgcolor="#eeeeee">


    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden">
        For what reason would it be advisable for me to think about business content? That might be little bit risky to
        have crew member like them.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="background-color: #eeeeee;" bgcolor="#eeeeee">

                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                    <tr>
                        <td align="center" valign="top" style="font-size:0; padding: 15px 15px 5px" bgcolor="#313130">

                            <div style="display:inline-block; min-width:100px; vertical-align:top; width:100%">
                                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px">
                                    <tr>
                                        <td align="center" valign="top" style="font-size: 36px; font-weight: 800; line-height: 48px" class="mobile-center">
                                            <img src="https://res.cloudinary.com/dgupbx2im/image/upload/v1721838403/products/ltxmvpgst73yvw1ikgfz.png" alt="" width="150">
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 35px 35px 20px 35px; background-color: #ffffff" bgcolor="#ffffff">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px">
                                <tr>
                                    <td align="center" style="font-size: 16px; font-weight: bold; line-height: 24px; padding-top: 25px">
                                        <h2 style="font-size: 30px; font-weight: bold; line-height: 36px; color: #333333; margin: 0">
                                            Cảm ơn bạn đã đặt hàng!
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px">
                                        <p style="font-size: 16px; font-weight: 400; line-height: 24px">
                                            Xin chào <span style="font-weight: bold">{{$bill->full_name}}</span> ,

                                            ĐKN xin thông báo đã nhận được đơn đặt hàng mang mã số
                                            <span style="color: #ff6700; font-weight: bold; text-decoration: underline">{{'#' . $bill->code}}</span>
                                            của bạn.

                                            Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lí.

                                            Dưới đây là thông tin đơn hàng của bạn. Để theo dõi trạng thái cũng như xem
                                            chi tiết đơn
                                            hàng của mình tại ĐKN Shop, bạn có thể nhấn
                                            <a href="{{ env('REACT_PATH_TRACKING_ORDER') . '?token=' . $token }}" style="font-weight: bold; color: #ff6700">vào đây</a>.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding-top: 20px">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="75%" align="left" bgcolor="#eeeeee" style="font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px">
                                                    Thông tin đơn hàng
                                                </td>
                                                <td width="25%" align="left" bgcolor="#eeeeee" style="font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px">
                                                    {{$bill->code}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="75%" align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px">
                                                    Tổng giá trị đơn hàng
                                                </td>
                                                <td width="25%" align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding: 15px 10px 5px 10px">
                                                    {{$totalMoney}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="75%" align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px">
                                                    Khuyến mãi
                                                </td>
                                                <td width="25%" align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px">
                                                    {{$discount}}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="75%" align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px">
                                                    Phí vận chuyển
                                                </td>
                                                <td width="25%" align="left" style="font-size: 16px; font-weight: 400; line-height: 24px; padding: 5px 10px">
                                                    {{$shipFee}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding-top: 20px">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="50%" align="left" style="color: #ff6700;font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #333333; border-bottom: 3px solid #333333">
                                                    Tổng thanh toán
                                                </td>
                                                <td width="50%" align="right" style="color: #ff6700; font-size: 16px; font-weight: 800; line-height: 24px; padding: 10px; border-top: 3px solid #333333; border-bottom: 3px solid #333333">
                                                    {{$totalFinal}}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>
                    <tr>
                        <td align="center" height="100%" valign="top" width="100%" style="padding: 0 35px 35px 35px; background-color: #ffffff" bgcolor="#ffffff">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:660px">
                                <tr>
                                    <td align="center" valign="top" style="font-size:0">
                                        <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%">

                                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px">
                                                <tr>
                                                    <td align="left" valign="top" style="font-size: 14px; font-weight: 400; line-height: 24px">
                                                        <p style="font-weight: 800">Thông tin giao hàng</p>
                                                        <p>
                                                            Họ tên: {{$bill->full_name}}
                                                            <br>Điện thoại: {{$bill->phone_number}}
                                                            <br>Email: {{$bill->email}}
                                                            <br>Địa chỉ: {{$bill->address}}
                                                        </p>

                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div style="display:inline-block; max-width:50%; min-width:240px; vertical-align:top; width:100%">
                                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:300px">
                                                <tr>
                                                    <td align="left" valign="top" style="font-size: 14px; font-weight: 400; line-height: 24px">
                                                        <p style="font-weight: 800">Phương thức thanh toán</p>
                                                        <p>{{$paymentMethod}}</p>
                                                        <p style="font-weight: 800">Phương thức vận chuyển</p>
                                                        <p>Tốc độ tiêu chuẩn (Đơn vị vận chuyển: Giao Hàng Nhanh)</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        <div style="min-width:240px; vertical-align:top; width:100%; max-width: 100%">
                                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" <tr>
                                                <td align="left" valign="top" style="font-size: 16px; font-weight: 400; line-height: 24px">
                                                    <p style="font-weight: 800">Tra cứu - Huỷ đơn hàng</p>
                                                    <p style="font-size: 14px">Bất cứ lúc nào, bạn có thể tra cứu trạng
                                                        thái các đơn hàng đã mua
                                                        <a href="{{ env('REACT_PATH_TRACK_ORDER')}}" style="color: #ff6700; font-weight: bold">tại
                                                            link</a>
                                                        bằng cách cung cấp thông tin về đơn hàng theo yêu cầu. Bạn cũng
                                                        có thể chủ động huỷ đơn hàng ngay tại trang tra cứu này khi
                                                        click vào
                                                        <span style="font-weight: bold">HUỶ ĐƠN HÀNG</span>
                                                        phía cuối trang, nhưng lưu ý là việc này chỉ có thể thực hiện
                                                        được trước khi đơn hàng của bạn được chuyển qua giao nhận.
                                                    </p>
                                                    <div style="border: 1px dashed #dcdcdc"></div>
                                                    <span style="font-size: 13.5px; color: gray; display: block; margin-top: 10px">Đây
                                                        là email được gửi tự động, vui lòng không phản hồi email này. Để
                                                        tìm hiểu thêm các quy định về đơn hàng hay các chính sách sau
                                                        bán hàng của ĐKN, vui lòng truy cập tại link hoặc gọi đến 096
                                                        3429749 (trong giờ hành chính) để được hướng dẫn.</span>
                                                </td>
                                </tr>
                            </table>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </td>
    </tr>
    </table>

</body>

</html>
