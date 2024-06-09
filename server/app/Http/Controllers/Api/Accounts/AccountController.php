<?php

namespace App\Http\Controllers\Api\Accounts;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\AccountRequest;
use App\Http\Resources\Accounts\AccountResource;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AccountController extends Controller {

    public function index(AccountRequest $req)
    {

        DB::enableQueryLog();

        $accounts = Account::select(AccountResource::fields());

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

        QueryHelper::buildOrderBy($accounts, 'created_at', 'desc');
        $accounts = QueryHelper::buildPagination($accounts, $req);

        return ApiResponse::responsePage(AccountResource::collection($accounts));
    }

}