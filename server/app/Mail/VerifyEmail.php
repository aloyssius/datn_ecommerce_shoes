<?php

namespace App\Mail;

use App\Models\Account;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

    protected $account;

    public function __construct(Account $account)
    {
        $this->account = $account;
    }

    public function build()
    {
        return $this->subject('Xác nhận địa chỉ email của bạn')
            ->view('emails.emailVerificationEmail')
            ->with([
                'user' => $this->account,
            ]);
    }
}
