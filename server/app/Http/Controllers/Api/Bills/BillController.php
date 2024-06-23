<?php

namespace App\Http\Controllers\Api\Bills;

use App\Constants\Role;
use App\Helpers\ApiResponse;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bill\BillRequest;
use App\Http\Requests\Bill\BillRequestBody;
use App\Http\Resources\Bills\BillResource;
use App\Models\Account;
use App\Models\Bill;
use App\Models\Role as ModelsRole;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function index(BillRequest $req)
    {

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

        return ApiResponse::responsePage(BillResource::collection($bills), $statusCounts);
    }

    public function show($id)
    {
        $account = Account::findOrFail($id);
        return ApiResponse::responseObject($account);
    }

    public function store(BillRequestBody $req)
    {
        $account = Account::query();
        $prefix = 'KH';

        $roleCustomer = ModelsRole::where('code', Role::CUSTOMER)->first();
        $moreColumns = [
            'code' => CustomCodeHelper::generateCode($account, $prefix),
            'roleId' => $roleCustomer->id,
        ];
        $accountConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);
        $accountCreated = Account::create($accountConverted);

        return ApiResponse::responseObject($accountCreated);
    }
}
