<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Voucher</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #333;
            text-align: center;
            padding-bottom: 10px;
        }

        .voucher {
            background-color: #4caf50;
            color: #fff;
            font-weight: bold;
            font-size: 24px;
            padding: 12px 24px;
            display: inline-block;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 20px;
        }

        .voucher-container {
            text-align: center;
            padding: 20px;
            margin-top: 20px;
            border-radius: 8px;
        }

        .voucher-img {
            display: block;
            margin: 20px auto;
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }

        .mid {
            border: 2px dashed #4caf50;
            padding: 20px;
            background-color: #e8f5e9;
        }

        .message {
            margin-top: 20px;
            text-align: justify;
        }

        .voucher-info {
            padding: 20px;
            background-color: #d0f2d0;
            border-radius: 8px;
            border: 2px solid #4caf50;
            margin-top: 20px;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            color: #666;
        }

        .highlight {
            font-weight: bold;
            color: #4caf50;
            font-size: 18px;
        }
    </style>
</head>

<body>
    <div class="container">
        <div>
            <p>Dear {{ $account->full_name }},</p>
            <p>Chúng tôi rất vui mừng được tặng bạn một phiếu mua hàng cho lần mua hàng tiếp theo của bạn.</p>
            <p>Hãy tận hưởng mua sắm với chúng tôi và đảm bảo sử dụng mã phiếu thưởng bên dưới:</p>
        </div>
        <div class="mid">
            <h1>Your Voucher</h1>
            <div class="voucher-container">
                <a href="#" class="voucher">{{ $voucher->code }}</a>
            </div>
        </div>
        <div class="message">
            <p>Xin chào {{ $account->full_name }},</p>
            <p>Chúc mừng! Bạn đã nhận được một phiếu giảm giá đặc biệt cho phép bạn được giảm giá cho lần mua hàng tiếp theo.</p>
            <p>Hãy truy cập trang web của chúng tôi và sử dụng mã phiếu thưởng khi thanh toán để đổi lấy khoản giảm giá của bạn.</p>
            <p>Chúc bạn mua sắm vui vẻ!</p>
        </div>
        <div class="voucher-info">
            <p class="highlight">Giá trị giảm giá: 
                @if($voucher->type_discount == 'vnd')
                    {{ number_format($voucher->value, 0, ',', '.') }} VNĐ.
                @elseif($voucher->type_discount == 'percent')
                    {{ $voucher->value }}%.
                @endif
            </p>
            @if($voucher->max_discount_value > 0)
                <p class="highlight">Giảm tối đa: {{ number_format($voucher->max_discount_value, 0, ',', '.') }} VNĐ.</p>
            @endif
            <p class="highlight">Áp dụng cho giá trị đơn hàng tối thiểu là: {{ number_format($voucher->min_order_value, 0, ',', '.') }} VNĐ.</p>
            <p class="highlight">Thời gian diễn ra từ {{ \Carbon\Carbon::parse($voucher->start_time)->format('d-m-Y H:i:s') }} đến {{ \Carbon\Carbon::parse($voucher->end_time)->format('d-m-Y H:i:s') }}.</p>
        </div>
        <div class="footer">
            <p>Trân trọng,<br>DKNSHOP</p>
        </div>
    </div>
</body>

</html>