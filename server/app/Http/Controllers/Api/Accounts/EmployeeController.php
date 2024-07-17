<?php

namespace App\Http\Controllers\Api\Accounts;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Accounts\AddressResource;
use App\Http\Resources\Accounts\AccountResource;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use App\Constants\Role as RoleEnum;
use App\Exceptions\NotFoundException;
use App\Helpers\ConvertHelper;
use App\Helpers\EmployeeCodeHelper;
use App\Http\Requests\Account\AccountRequest;
use App\Http\Requests\Account\AccountRequestBody;
use App\Http\Requests\Address\AddressRequestBody;
use App\Models\Role;
use App\Models\Address;
use Carbon\Carbon;
use DateTime;

class EmployeeController extends Controller
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

    public function show($id)
    {

        $account = Account::join('roles', 'accounts.role_id', 'roles.id')
            ->select('accounts.id', 'accounts.full_name', 'accounts.code', 'accounts.email', 'accounts.avatar_url', 'accounts.phone_number', 'accounts.birth_date', 'accounts.gender', 'accounts.status', 'accounts.created_at')
            ->where('roles.code', '=', RoleEnum::EMPLOYEE)->find($id);

        if (!$account) {
            throw new NotFoundException("Không tìm thấy nhân viên có id là " . $id);
        }

        $addresses = Address::select(AddressResource::fields())
                    ->where('account_id', '=', $account->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
        $account['addresses'] = AddressResource::collection($addresses);

        return ApiResponse::responseObject(new AccountResource($account));
    }

    public function store(AccountRequestBody $req)
    {
        $account = Account::query(); // tạo instance query
        $prefix = 'NV'; // mã bắt đầu với 'KH'

        // tìm role employee
        $roleEmployee = Role::where('code', RoleEnum::EMPLOYEE)->first();

        $moreColumns = [
            'code' => EmployeeCodeHelper::generateCode($account, $prefix), // tạo code tự tăng
            'roleId' => $roleEmployee->id, // lấy id của role employee
        ];

        // convert req
        $accountConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

        // save
        $accountCreated = Account::create($accountConverted);
        return ApiResponse::responseObject(new AccountResource($accountCreated));
    }

    public function storeAddress(AddressRequestBody $req)
    {
        $addressConverted = ConvertHelper::convertColumnsToSnakeCase($req->all());
        $addressCreated = Address::create($addressConverted);
        
        $addresses = Address::select(AddressResource::fields())
        ->where('account_id', '=', $req->accountId)
        ->orderBy('created_at', 'desc')
        ->get();
         
        return ApiResponse::responseObject(AddressResource::collection($addresses));
    }
}

