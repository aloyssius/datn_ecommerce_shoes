<?php

namespace App\Http\Controllers\Api\Accounts;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\AccountRequest;
use App\Http\Resources\Accounts\AccountResource;
use App\Models\Account;

class AccountController extends Controller {

    public function index(AccountRequest $req)
    {
        $accounts = Account::select(AccountResource::fields())
            ->orderBy('created_at', 'desc')
            ->paginate($req->pageSize, ['*'], 'page', $req->currentPage);

        return ApiResponse::responsePage(AccountResource::collection($accounts));
    }

}