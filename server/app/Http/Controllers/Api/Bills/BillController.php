<?php

namespace App\Http\Controllers\Api\Bills;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\BillRequest;
use App\Http\Resources\Bills\BillResource;
use App\Models\Bill;

class BillController extends Controller
{
    public function index(BillRequest $req)
    {
        $bills = Bill::select(BillResource::fields())
            ->orderBy('created_at', 'desc')
            ->paginate($req->pageSize, ['*'], 'page', $req->currentPage);

        return ApiResponse::responsePage(BillResource::collection($bills));
    }

    public function show($id)
    {
        $bill = Bill::findOrFail($id);
        return ApiResponse::responseObject(new BillResource($bill));
    }
}
