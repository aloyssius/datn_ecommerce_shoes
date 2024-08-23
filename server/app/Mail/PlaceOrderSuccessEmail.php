<?php

namespace App\Mail;

use App\Constants\TransactionType;
use App\Helpers\ConvertHelper;
use App\Http\Resources\Bills\BillDetailEmailResource;
use App\Models\Bill;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Crypt;

class PlaceOrderSuccessEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

    protected $bill;
    protected $shipFee;
    protected $discount;
    protected $totalMoney;
    protected $totalFinal;
    protected $paymentMethod;
    protected $token;

    public function __construct($bill, $totalFinal, $token)
    {
        $this->bill = $bill;
        $this->shipFee = $this->formatCurrencyOrZeroVnd($bill->money_ship);
        $this->discount = $this->formatCurrencyOrZeroVnd($bill->discount_amount);
        $this->totalMoney = $this->formatCurrencyOrZeroVnd($bill->total_money);
        $this->totalFinal = $this->formatCurrencyOrZeroVnd($totalFinal);
        $this->paymentMethod = $bill->payment_method === TransactionType::CASH ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán trực tuyến (VNPAY)";
        $this->token = $token;
    }

    public function build()
    {
        return $this->subject('#' . $this->bill->code . ' - Thông báo đặt hàng thành công từ ĐKN Shop')
            ->view('emails.emailPlaceOrderSuccess')
            ->with([
                'bill' => $this->bill,
                'paymentMethod' => $this->paymentMethod,
                'shipFee' => $this->shipFee,
                'discount' => $this->discount,
                'totalMoney' => $this->totalMoney,
                'totalFinal' => $this->totalFinal,
                'token' => $this->token,
            ]);
    }

    private function formatCurrencyOrZeroVnd($value)
    {
        return $value ? ConvertHelper::formatCurrencyVnd($value) . " VNĐ" : '0 VNĐ';
    }
}
