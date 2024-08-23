<?php

namespace App\Jobs;

use App\Mail\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailVerification implements ShouldQueue
{
    protected $details;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($details)
    {
        $this->details = $details;
    }

    public function handle(): void
    {
        $data = $this->details;
        Mail::to($data['email'])->send(new VerifyEmail($data['user']));
    }
}
