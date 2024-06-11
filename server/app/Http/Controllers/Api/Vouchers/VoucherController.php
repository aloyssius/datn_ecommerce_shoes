<?php

namespace App\Http\Controllers\Api\Vouchers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Vouchers\VoucherResource;
use App\Models\Voucher;
use Illuminate\Http\Request\Page;
use App\Http\Requests\VoucherRequest;

class VoucherController extends Controller
{
    public function index(VoucherRequest $req)
    {
        $vouchers = Voucher::select(VoucherResource::fields())
            ->orderBy('created_at', 'desc')
            ->paginate($req->pageSize, ['*'], 'page', $req->currentPage);

        return ApiResponse::responseObject(VoucherResource::collection($vouchers));
    }
}
