<?php

namespace App\Jobs;

use App\Mail\CreateCustomerEmail;
use App\Mail\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailCreateCustomer implements ShouldQueue
{
    protected $account;
    protected $pass;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($account, $pass)
    {
        $this->account = $account;
        $this->pass = $pass;
    }

    public function handle(): void
    {
        Mail::to($this->account->email)->send(new CreateCustomerEmail($this->account, $this->pass));
    }
}
