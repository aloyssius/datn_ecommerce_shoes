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
use App\Exceptions\RestApiException;
use App\Helpers\ConvertHelper;
use App\Helpers\EmployeeCodeHelper;
use App\Http\Requests\Account\AccountRequest;
use App\Http\Requests\Account\AccountRequestBody;
use App\Http\Requests\Address\AddressRequestBody;
use App\Jobs\SendEmailCreateCustomer;
use App\Models\Role;
use App\Models\Address;
use Carbon\Carbon;
use DateTime;
use Illuminate\Support\Str;

class EmployeeController extends Controller
{

    public function index(AccountRequest $req)
    {

        $accounts = Account::join('roles', 'accounts.role_id', 'roles.id')
            ->select('accounts.id', 'accounts.full_name', 'accounts.email', 'accounts.avatar_url', 'accounts.code', 'accounts.phone_number', 'accounts.identity_card', 'accounts.birth_date', 'accounts.gender', 'accounts.status')
            ->whereIn('roles.code', [RoleEnum::EMPLOYEE]);

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['accounts.code', 'accounts.full_name', 'accounts.phone_number', 'accounts.email'];
            QueryHelper::buildQuerySearchContains($accounts, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($accounts, 'accounts.status', $req->status);
        }

        if ($req->filled('gender')) {
            QueryHelper::buildQueryEquals($accounts, 'accounts.gender', $req->gender);
        }

        $statusCounts = Account::join('roles', 'accounts.role_id', '=', 'roles.id')->select(DB::raw('count(status) as count, status'))
            ->whereIn('roles.code', [RoleEnum::EMPLOYEE])
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($accounts, 'accounts.created_at', 'desc');
        $accounts = QueryHelper::buildPagination($accounts, $req);

        return ApiResponse::responsePage(AccountResource::collection($accounts), $statusCounts);
    }

    public function show($id)
    {

        $account = Account::select('id', 'full_name', 'code', 'email', 'avatar_url', 'phone_number', 'birth_date', 'gender', 'status', 'created_at')
            ->where("id", $id)->first();

        if (!$account) {
            throw new NotFoundException("Không tìm thấy nhân viên có id là " . $id);
        }

        return ApiResponse::responseObject(new AccountResource($account));
    }

    public function update(AccountRequestBody $req)
    {
        $account = Account::find($req->id);

        if (!$account) {
            throw new RestApiException("Không tìm thấy nhân viên");
        }

        $roleEmployee = Role::where('code', RoleEnum::EMPLOYEE)->first();

        if ($req->phoneNumber !== $account->phone_number) {
            $findPhoneNumberAdmin = Account::where('phone_number', $req->phoneNumber)
                ->whereIn('role_id', [$roleEmployee->id])->first();

            if ($findPhoneNumberAdmin) {
                throw new RestApiException("SĐT này đã tồn tại");
            }
        }

        $birthDate = null;
        if ($req->birthDate !== null && DateTime::createFromFormat('d-m-Y', $req->birthDate)) {
            $birthDate = date('Y-m-d', strtotime($req->birthDate));
        }

        try {
            DB::beginTransaction();

            $account->full_name = $req->fullName;
            $account->phone_number = $req->phoneNumber;
            $account->birth_date = $birthDate === null ? null : $birthDate;
            $account->gender = $req->gender;
            $account->status = $req->status;
            $account->save();

            DB::commit();
        } catch (\Exception $e) {
            throw new RestApiException($e->getMessage());
        }

        return ApiResponse::responseObject(new AccountResource($account));
    }


    public function store(AccountRequestBody $req)
    {
        $account = Account::query();
        $prefix = 'NV';

        $roleEmployee = Role::where('code', RoleEnum::EMPLOYEE)->first();
        $roleAdmin = Role::where('code', RoleEnum::ADMIN)->first();

        $findEmailAdmin = Account::where('email', $req->email)
            ->whereIn('role_id', [$roleAdmin->id, $roleEmployee->id])->first();

        if ($findEmailAdmin) {
            throw new RestApiException("Địa chỉ email này đã tồn tại");
        }

        $findPhoneNumberAdmin = Account::where('phone_number', $req->phoneNumber)
            ->whereIn('role_id', [$roleEmployee->id])->first();

        if ($findPhoneNumberAdmin) {
            throw new RestApiException("SĐT này đã tồn tại");
        }

        $length = 12;
        $pass = Str::random($length, 'aA0');

        $moreColumns = [
            'code' => EmployeeCodeHelper::generateCode($account, $prefix),
            'roleId' => $roleEmployee->id,
            'password' => bcrypt($pass),
        ];

        // convert req
        $accountConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

        try {
            DB::beginTransaction();

            // save
            $accountCreated = Account::create($accountConverted);

            DB::commit();
        } catch (\Exception $e) {
            throw new RestApiException($e->getMessage());
        }

        SendEmailCreateCustomer::dispatch($accountCreated, $pass)->delay(now()->addSeconds(3));

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
