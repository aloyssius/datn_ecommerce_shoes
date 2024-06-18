<?php

namespace App\Http\Controllers\Api\Promotions;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Promotions\PromotionResource;
use App\Models\Promotion;
use Illuminate\Http\Request\Page;
use App\Http\Requests\PromotionRequest;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelper;

class PromotionController extends Controller
{
    public function index(PromotionRequest $req)
    {

        DB::enableQueryLog();

        $promotions = Promotion::select(PromotionResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['name'];
            QueryHelper::buildQuerySearchContains($promotions, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($promotions, 'status', $req->status);
        }

        $promotions->when($req->filled('start_time') && $req->filled('end_time'), function ($query) use ($req) {
            $startTime = Carbon::parse($req->startTime)->startOfDay();
            $endTime = Carbon::parse($req->endTime)->endOfDay();
            return $query->whereBetween('created_at', [$startTime, $endTime]);
        })
        ->when($req->filled('startTime') && !$req->filled('endTime'), function ($query) use ($req) {
            $startTime = Carbon::parse($req->startTime)->startOfDay();
            $query->where('created_at', '>=', $startTime);
        })
        ->when(!$req->filled('startTime') && $req->filled('endTime'), function ($query) use ($req) {
            $endTime = Carbon::parse($req->endTime)->endOfDay();
            $query->where('created_at', '<=', $endTime);
        });
        $statusCounts = Promotion::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($promotions, 'created_at', 'desc');
        $promotions = QueryHelper::buildPagination($promotions, $req);

            // ->orderBy('created_at', 'desc')
            // ->paginate($req->pageSize, ['*'], 'page', $req->currentPage);

        return ApiResponse::responsePage(PromotionResource::collection($promotions), $statusCounts, null);
    }
}
