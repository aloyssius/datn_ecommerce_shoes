<?php

namespace App\Jobs;

use App\Http\Resources\Bills\BillDetailEmailResource;
use App\Mail\PlaceOrderSuccessEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendEmailPlaceOrderSuccess implements ShouldQueue
{
    protected $bill;
    protected $totalFinal;
    protected $token;

    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct($bill, $totalFinal, $token)
    {
        $this->bill = $bill;
        $this->totalFinal = $totalFinal;
        $this->token = $token;
    }

    public function handle(): void
    {
        Mail::to($this->bill->email)->send(new PlaceOrderSuccessEmail($this->bill, $this->totalFinal, $this->token));
    }
}
