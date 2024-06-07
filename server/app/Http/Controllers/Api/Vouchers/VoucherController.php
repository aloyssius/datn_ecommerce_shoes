<?php

namespace App\Http\Controllers\Api\Vouchers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Vouchers\VoucherResource;
use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function index()
    {
        return ApiResponse::responseObject(VoucherResource::collection(Voucher::all()));
    }
}
