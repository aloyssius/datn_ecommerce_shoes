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

    public function __construct(Account $account, $pass)
    {
        $this->account = $account;
        $this->pass = $pass;
    }

    public function build()
    {
        return $this->subject('Tài khoản mới tại ĐKN Shop')
            ->view('emails.emailCreateCustomer')
            ->with([
                'user' => $this->account,
                'pass' => $this->pass,
            ]);
    }
}
