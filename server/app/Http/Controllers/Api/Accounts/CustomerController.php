<?php

namespace App\Http\Controllers\Api\Accounts;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\AccountRequest;
use App\Http\Resources\Accounts\AccountResource;
use App\Models\Account;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Constants\Role as RoleEnum;
class CustomerController extends Controller {

    public function index(AccountRequest $req)
    {

        DB::enableQueryLog();

        $accounts = Account::join('roles', 'accounts.role_id', 'roles.id')
        ->select('accounts.id', 'accounts.full_name', 'accounts.code', 'accounts.phone_number','accounts.birth_date', 'accounts.gender', 'accounts.status', 'roles.code as role')
        ->where('roles.code', '=', RoleEnum::CUSTOMER);
        // $accounts = Account::select(AccountResource::fields())
        // ->where('accounts.role_id', '=', '4ce0d4c9-62cc-3f11-aa69-fda78821bbac');

        if( $req->filled('search') ){
            $search = $req->search;
            $searchFields = ['code', 'full_name', 'phone_number'];
            QueryHelper::buildQuerySearchContains($accounts, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($accounts, 'status', $req->status);
        }

        if ($req->filled('gender')) {
            QueryHelper::buildQueryEquals($accounts, 'gender', $req->gender);
        }

        if ($req->filled('role_id')) {
            QueryHelper::buildQueryEquals($accounts, 'role_id', $req->role_id);
        }

        $statusCounts = Account::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();
        
        

        QueryHelper::buildOrderBy($accounts, 'accounts.created_at', 'desc');
        $accounts = QueryHelper::buildPagination($accounts, $req);

        return ApiResponse::responsePage(AccountResource::collection($accounts), $statusCounts, null);
    }   

}