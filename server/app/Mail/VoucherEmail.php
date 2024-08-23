<?php

namespace App\Mail;

use App\Models\Voucher;
use App\Models\Account;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VoucherEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $voucher;
    protected $account;

    public function __construct(Voucher $voucher, Account $account)
    {
        $this->voucher = $voucher;
        $this->account = $account;
    }

    public function build()
    {
        return $this->subject('New Voucher Created')
                    ->view('emails.voucherCreated')
                    ->with([
                        'voucher' => $this->voucher,
                        'account' => $this->account,
                    ]);
    }
}