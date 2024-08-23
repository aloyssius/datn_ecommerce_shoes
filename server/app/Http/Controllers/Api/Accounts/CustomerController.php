<?php

namespace App\Http\Controllers\Api\Accounts;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Accounts\AccountResource;
use App\Http\Resources\Accounts\AddressResource;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use App\Constants\Role as RoleEnum;
use App\Exceptions\NotFoundException;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Http\Requests\Account\AccountRequest;
use App\Http\Requests\Account\AccountRequestBody;
use App\Http\Requests\Address\AddressRequestBody;
use App\Models\Role;
use App\Constants\AddressDefault as AddressDefault;
use App\Constants\ConstantSystem;
use App\Exceptions\RestApiException;
use App\Models\Address;
use Carbon\Carbon;
use DateTime;

class CustomerController extends Controller
{

    public function index(AccountRequest $req)
    {

        $accounts = Account::join('roles', 'accounts.role_id', '=', 'roles.id')
            ->select('accounts.id', 'accounts.full_name', 'accounts.code', 'accounts.email', 'accounts.avatar_url', 'accounts.phone_number', 'accounts.birth_date', 'accounts.gender', 'accounts.status', 'accounts.created_at')
            ->where('roles.code', '=', RoleEnum::CUSTOMER);

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['accounts.code', 'accounts.full_name', 'accounts.phone_number'];
            QueryHelper::buildQuerySearchContains($accounts, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($accounts, 'accounts.status', $req->status);
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
        $account = Account::find($id);

        if (!$account) {
            throw new NotFoundException("Không tìm thấy khách hàng có id là " . $id);
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
        $account = Account::query();
        $prefix = ConstantSystem::CUSTOMER_CODE_PREFIX; // mã bắt đầu với 'KH'

        $roleCustomer = Role::where('code', RoleEnum::CUSTOMER)->first();

        $findEmailCustomer = Account::where('email', $req->email)
            ->where('role_id', $roleCustomer->id)->first();

        if ($findEmailCustomer) {
            throw new RestApiException("Địa chỉ email này đã tồn tại");
        }

        $findPhoneNumberCustomer = Account::where('phone_number', $req->phoneNumber)
            ->where('role_id', $roleCustomer->id)->first();

        if ($findPhoneNumberCustomer) {
            throw new RestApiException("SĐT này đã tồn tại");
        }

        $moreColumns = [
            'code' => CustomCodeHelper::generateCode($account, $prefix),
            'roleId' => $roleCustomer->id,
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
        Address::create($addressConverted);

        $addresses = Address::select(AddressResource::fields())
            ->where('account_id', '=', $req->accountId)
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::responseObject(AddressResource::collection($addresses));
    }

    public function storeAddressDefault(AddressRequestBody $req)
    {
        $address = Address::where('id', '=', $req->id)->first();

        if (!$address) {
            throw new NotFoundException("Không tìm thấy địa chỉ có id là " . $req->id);
        }

        $addressDefault = Address::where('account_id', '=', $req->accountId)
            ->where('is_default', '=', AddressDefault::IS_DEFAULT)
            ->first();

        if ($addressDefault) {
            $addressDefault['is_default'] = AddressDefault::UN_DEFAULT;
            $addressDefault->save();
        }

        $address['is_default'] = AddressDefault::IS_DEFAULT;
        $address->save();

        $addresses = Address::select(AddressResource::fields())
            ->where('account_id', '=', $req->accountId)
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::responseObject(AddressResource::collection($addresses));
    }
}
