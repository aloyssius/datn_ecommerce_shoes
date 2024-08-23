<?php

namespace App\Jobs;

use App\Models\Voucher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class UpdateDiscountStatus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        //
    }

    public function handle()
{
    $now = Carbon::now();
    Log::info('UpdateDiscountStatus job started at: ' . $now);
    
    // Cập nhật trạng thái cho các bản ghi voucher đã hết hạn (trừ những cái đã có trạng thái là FINISHED)
    $finished = Voucher::query()
        ->where('end_time', '<=', $now)
        ->where('status', '!=', 'FINISHED') // Không cập nhật các voucher đã có trạng thái FINISHED
        ->update(['status' => 'FINISHED']);
    Log::info('Số lượng voucher được cập nhật thành FINISHED: ' . $finished);
    
    // Cập nhật trạng thái cho các bản ghi voucher chưa bắt đầu (trừ những cái đã có trạng thái là FINISHED)
    $upComing = Voucher::query()
        ->where('start_time', '>', $now)
        ->where('status', '!=', 'FINISHED') // Không cập nhật các voucher đã có trạng thái FINISHED
        ->update(['status' => 'UP_COMMING']);
    Log::info('Số lượng voucher được cập nhật thành UP_COMMING: ' . $upComing);
    
    // Cập nhật trạng thái cho các bản ghi voucher đang diễn ra (trừ những cái đã có trạng thái là FINISHED)
    $onGoing = Voucher::query()
        ->where('start_time', '<=', $now)
        ->where('end_time', '>', $now)
        ->where('status', '!=', 'FINISHED') // Không cập nhật các voucher đã có trạng thái FINISHED
        ->update(['status' => 'ON_GOING']);
    Log::info('Số lượng voucher được cập nhật thành ON_GOING: ' . $onGoing);
    
    Log::info('UpdateDiscountStatus job finished at: ' . $now);
}
}