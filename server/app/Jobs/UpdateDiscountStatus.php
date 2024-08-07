<?php

namespace App\Jobs;

use App\Models\Discount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use App\Console\Kernel;

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

        // Cập nhật trạng thái cho các bản ghi khuyến mãi
        Discount::query()
            ->where('end_time', '<=', $now)
            ->update(['status' => 'FINISHED']);

        Discount::query()
            ->where('start_time', '>', $now)
            ->update(['status' => 'UP_COMMING']);

        Discount::query()
            ->where('start_time', '<=', $now)
            ->where('end_time', '>', $now)
            ->update(['status' => 'ON_GOING']);
    }
}
