<?php

namespace App\Http\Controllers\Api\Bills;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\BillRequest;
use App\Http\Resources\Bills\BillResource;
use App\Models\Bill;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function index(BillRequest $req)
    {
        DB::enableQueryLog();

        $bills = Bill::select(BillResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'full_name', 'phone_number'];
            QueryHelper::buildQuerySearchContains($bills, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($bills, 'status', $req->status);
        }

        $bills->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
            $startDate = Carbon::parse($req->startDate)->startOfDay();
            $endDate = Carbon::parse($req->endDate)->endOfDay();
            return $query->whereBetween('created_at', [$startDate, $endDate]);
        })
            ->when($req->filled('startDate') && !$req->filled('endDate'), function ($query) use ($req) {
                $startDate = Carbon::parse($req->startDate)->startOfDay();
                $query->where('created_at', '>=', $startDate);
            })
            ->when(!$req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
                $endDate = Carbon::parse($req->endDate)->endOfDay();
                $query->where('created_at', '<=', $endDate);
            });

        $statusCounts = Bill::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($bills, 'created_at', 'desc');
        $bills = QueryHelper::buildPagination($bills, $req);

        return ApiResponse::responsePage(BillResource::collection($bills), $statusCounts, null);
    }

    public function show($id)
    {
        $bill = Bill::findOrFail($id);
        return ApiResponse::responseObject(new BillResource($bill));
    }
}
