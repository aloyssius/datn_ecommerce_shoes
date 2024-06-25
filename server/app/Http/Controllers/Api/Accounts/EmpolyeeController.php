<?php

namespace App\Http\Controllers\Api\Accounts;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Accounts\AccountResource;
use App\Models\Account;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Constants\Role as RoleEnum;
use App\Http\Requests\Account\AccountRequest;

class EmpolyeeController extends Controller
{

    public function index(AccountRequest $req)
    {

        $accounts = Account::join('roles', 'accounts.role_id', 'roles.id')
            ->select('accounts.id', 'accounts.full_name', 'accounts.email', 'accounts.avatar_url', 'accounts.code', 'accounts.phone_number', 'accounts.identity_card', 'accounts.birth_date', 'accounts.gender', 'accounts.status')
            ->where('roles.code', '=', RoleEnum::EMPLOYEE);

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['accounts.code', 'accounts.full_name', 'accounts.phone_number'];
            QueryHelper::buildQuerySearchContains($accounts, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($accounts, 'account.status', $req->status);
        }

        if ($req->filled('gender')) {
            QueryHelper::buildQueryEquals($accounts, 'accounts.gender', $req->gender);
        }

        $statusCounts = Account::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($accounts, 'accounts.created_at', 'desc');
        $accounts = QueryHelper::buildPagination($accounts, $req);

        return ApiResponse::responsePage(AccountResource::collection($accounts), $statusCounts);
    }
}

