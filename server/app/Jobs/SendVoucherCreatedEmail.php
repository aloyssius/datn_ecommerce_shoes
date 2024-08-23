<?php

namespace App\Jobs;

use App\Mail\VoucherEmail; // Cập nhật tên lớp ở đây
use App\Models\Voucher;
use App\Models\Account;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendVoucherCreatedEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $voucher;
    protected $account;

    public function __construct(Voucher $voucher, Account $account)
    {
        $this->voucher = $voucher;
        $this->account = $account;
    }

    public function handle(): void
    {
        Mail::to($this->account->email)->send(new VoucherEmail($this->voucher, $this->account));
    }
}