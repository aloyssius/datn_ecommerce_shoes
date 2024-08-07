<?php

namespace App\Mail;

use App\Models\Account;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CreateCustomerEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

    protected $account;
    protected $pass;
    protected $type;
    public $subject;

    public function __construct(Account $account, $pass, $type)
    {
        $this->account = $account;
        $this->pass = $pass;
        $this->type = $type;
        $this->subject = $type === 'reset' ? "Đặt lại mật khẩu của bạn" : "Tài khoản mới tại ĐKN Shop";
    }

    public function build()
    {
        return $this->subject($this->subject)
            ->view('emails.emailCreateCustomer')
            ->with([
                'user' => $this->account,
                'pass' => $this->pass,
                'type' => $this->type,
            ]);
    }
}
