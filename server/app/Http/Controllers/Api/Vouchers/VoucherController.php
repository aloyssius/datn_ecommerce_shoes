<?php

namespace App\Http\Controllers\Api\Vouchers;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Vouchers\VoucherResource;
use App\Models\Voucher;
use Illuminate\Http\Request\Page;
use App\Http\Requests\VoucherRequest;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelper;

class VoucherController extends Controller
{
    public function index(VoucherRequest $req)
    {

        DB::enableQueryLog();

        $vouchers = Voucher::select(VoucherResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'name'];
            QueryHelper::buildQuerySearchContains($vouchers, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($vouchers, 'status', $req->status);
        }

        if ($req->filled('type')) {
            QueryHelper::buildQueryEquals($vouchers, 'type', $req->type);
        }

        $vouchers->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
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

        $statusCounts = Voucher::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($vouchers, 'created_at', 'desc');
        $vouchers = QueryHelper::buildPagination($vouchers, $req);

            // ->orderBy('created_at', 'desc')
            // ->paginate($req->pageSize, ['*'], 'page', $req->currentPage);

        return ApiResponse::responsePage(VoucherResource::collection($vouchers), $statusCounts,NULL);
    }
}
