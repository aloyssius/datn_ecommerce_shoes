<?php

namespace App\Http\Controllers\Api\Vouchers;

use App\Exceptions\NotFoundException;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\Vouchers\VoucherResource;
use App\Models\Voucher;
use Illuminate\Http\Request\Page;
use App\Http\Requests\Voucher\VoucherRequest;
use App\Http\Requests\Voucher\VoucherRequestBody;
use App\Helpers\ConvertHelper;
use Illuminate\Support\Facades\DB;
use App\Helpers\QueryHelper;
use Carbon\Carbon;
use App\Jobs\SendVoucherCreatedEmail;
use App\Models\Account;
use Illuminate\Support\Facades\Mail;
use App\Mail\VoucherEmail;

class VoucherController extends Controller
{
//     public function index(VoucherRequest $req)
// {
//     DB::enableQueryLog();

//     $vouchers = Voucher::select(VoucherResource::fields());

//     if ($req->filled('search')) {
//         $search = $req->search;
//         $searchFields = ['code', 'name'];
//         QueryHelper::buildQuerySearchContains($vouchers, $search, $searchFields);
//     }

//     if ($req->filled('status')) {
//         QueryHelper::buildQueryEquals($vouchers, 'status', $req->status);
//     }

//     // Lọc theo type nếu có
//     if ($req->filled('type')) {
//         QueryHelper::buildQueryEquals($vouchers, 'type', $req->type);
//     }

//     $vouchers->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
//         $startDate = Carbon::parse($req->startDate)->startOfDay();
//         $endDate = Carbon::parse($req->endDate)->endOfDay();
//         return $query->whereBetween('created_at', [$startDate, $endDate]);
//     })
//     ->when($req->filled('startDate') && !$req->filled('endDate'), function ($query) use ($req) {
//         $startDate = Carbon::parse($req->startDate)->startOfDay();
//         $query->where('created_at', '>=', $startDate);
//     })
//     ->when(!$req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
//         $endDate = Carbon::parse($req->endDate)->endOfDay();
//         $query->where('created_at', '<=', $endDate);
//     });

//     $statusCounts = Voucher::select(DB::raw('count(status) as count, status'))
//         ->groupBy('status')
//         ->get();

//     QueryHelper::buildOrderBy($vouchers, 'created_at', 'desc');
//     $vouchers = QueryHelper::buildPagination($vouchers, $req);

//     return ApiResponse::responsePage(VoucherResource::collection($vouchers), $statusCounts, NULL);
// }

public function index(VoucherRequest $req)
{
    DB::enableQueryLog();

    $vouchers = Voucher::select(VoucherResource::fields());

    // Lọc theo search
    if ($req->filled('search')) {
        $search = $req->search;
        $searchFields = ['code', 'name'];
        QueryHelper::buildQuerySearchContains($vouchers, $search, $searchFields);
    }

    // Lọc theo status
    if ($req->filled('status')) {
        QueryHelper::buildQueryEquals($vouchers, 'status', $req->status);
    }

    // Lọc theo type nếu có
    if ($req->filled('type')) {
        QueryHelper::buildQueryEquals($vouchers, 'type', $req->type);
    }

    // Lọc theo startDate và endDate
    $vouchers->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
        $startDate = Carbon::parse($req->startDate)->startOfDay();
        $endDate = Carbon::parse($req->endDate)->endOfDay();
        return $query->whereDate('start_time', '>=', $startDate->format('Y-m-d'))
                     ->whereDate('end_time', '<=', $endDate->format('Y-m-d'));
    })
    ->when($req->filled('startDate') && !$req->filled('endDate'), function ($query) use ($req) {
        $startDate = Carbon::parse($req->startDate)->startOfDay();
        $query->whereDate('start_time', '>=', $startDate->format('Y-m-d'));
    })
    ->when(!$req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
        $endDate = Carbon::parse($req->endDate)->endOfDay();
        $query->whereDate('end_time', '<=', $endDate->format('Y-m-d'));
    });

    $statusCounts = Voucher::select(DB::raw('count(status) as count, status'))
        ->groupBy('status')
        ->get();

    QueryHelper::buildOrderBy($vouchers, 'created_at', 'desc');
    $vouchers = QueryHelper::buildPagination($vouchers, $req);

    

    return ApiResponse::responsePage(VoucherResource::collection($vouchers), $statusCounts, NULL);
}

    public function show($id)
{
    // Lấy voucher từ cơ sở dữ liệu theo id
    $voucher = Voucher::select(VoucherResource::fields())
                    ->where('id', $id)
                    ->first(); // Sử dụng first() để lấy ra một bản ghi đầu tiên nếu có

    // Kiểm tra nếu không tìm thấy voucher
    if (!$voucher) {
        throw new NotFoundException("Không tìm thấy voucher có id là " . $id);
    }

    // Trả về thông tin voucher dưới dạng ApiResponse
    return ApiResponse::responseObject(new VoucherResource($voucher));
}


public function store(VoucherRequestBody $req)
{
    // Chuyển đổi dữ liệu yêu cầu thành dạng snake_case
    $voucherConverted = ConvertHelper::convertColumnsToSnakeCase($req->all());

    // Lấy ngày và giờ hiện tại
    $currentDate = Carbon::now();

    // Kiểm tra `end_time` và cập nhật trạng thái
    if (isset($voucherConverted['end_time'])) {
        $endTime = Carbon::parse($voucherConverted['end_time']);
        if ($endTime <= $currentDate) {
            $voucherConverted['status'] = 'finished';
        }
    }

    // Nếu trạng thái chưa được gán thành `finished`, kiểm tra `start_time`
    if (!isset($voucherConverted['status'])) {
        if (isset($voucherConverted['start_time'])) {
            $startTime = Carbon::parse($voucherConverted['start_time']);
            if ($startTime > $currentDate) {
                $voucherConverted['status'] = 'up_comming';
            } else {
                $voucherConverted['status'] = 'on_going';
            }
        }
    }

    // Lưu voucher vào cơ sở dữ liệu
    $voucherCreated = Voucher::create($voucherConverted);

    // Lấy tất cả các email từ bảng accounts
    $accounts = Account::all(); // Lấy tất cả đối tượng Account

    // Gửi email đến từng địa chỉ
    foreach ($accounts as $account) {
        SendVoucherCreatedEmail::dispatch($voucherCreated, $account);
    }

    // Trả về phản hồi với voucher đã tạo
    return ApiResponse::responseObject(new VoucherResource($voucherCreated));
}

public function update($id, VoucherRequestBody $req)
{
    // Lấy voucher từ cơ sở dữ liệu theo id
    $voucher = Voucher::find($id);

    // Kiểm tra nếu không tìm thấy voucher
    if (!$voucher) {
        throw new NotFoundException("Không tìm thấy voucher có id là " . $id);
    }

    // Chuyển đổi dữ liệu từ request
    $voucherConverted = ConvertHelper::convertColumnsToSnakeCase($req->all());

    // Lấy ngày hiện tại
    $currentDate = Carbon::now();

    // Kiểm tra end_time và cập nhật status
    if (isset($voucherConverted['end_time'])) {
        $endTime = Carbon::parse($voucherConverted['end_time']);

        if ($endTime <= $currentDate) {
            $voucherConverted['status'] = 'finished';
        }
    }

    // Nếu status chưa được gán thành finished, kiểm tra start_time
    if (!isset($voucherConverted['status'])) {
        if (isset($voucherConverted['start_time'])) {
            $startTime = Carbon::parse($voucherConverted['start_time']);

            if ($startTime > $currentDate) {
                $voucherConverted['status'] = 'up_comming';
            } elseif ($startTime <= $currentDate) {
                $voucherConverted['status'] = 'on_going';
            }
        }
    }

    // Cập nhật thông tin voucher
    $voucher->update($voucherConverted);

    // Trả về thông tin voucher đã cập nhật dưới dạng ApiResponse
    return ApiResponse::responseObject(new VoucherResource($voucher));
}

public function endVoucher($id)
{
    // Lấy voucher từ cơ sở dữ liệu theo id
    $voucher = Voucher::find($id);

    // Kiểm tra nếu không tìm thấy voucher
    if (!$voucher) {
        return response()->json(['message' => 'Không tìm thấy voucher có id là ' . $id], 404);
    }

    // Cập nhật trạng thái voucher thành 'finished'
    $voucher->status = 'finished';
    $voucher->save();

    // Trả về phản hồi với voucher đã cập nhật
    return response()->json(['message' => 'Voucher đã được kết thúc']);
}

public function restoreVoucher($id)
{
    // Lấy voucher từ cơ sở dữ liệu theo id
    $voucher = Voucher::find($id);

    // Kiểm tra nếu không tìm thấy voucher
    if (!$voucher) {
        return response()->json(['message' => 'Không tìm thấy voucher có id là ' . $id], 404);
    }

    // Lấy ngày hiện tại
    $currentDate = Carbon::now();

    // Lấy start_time của voucher
    $startTime = Carbon::parse($voucher->start_time);

    // Kiểm tra và cập nhật trạng thái dựa trên start_time và ngày hiện tại
    if ($startTime > $currentDate) {
        // Nếu start_time lớn hơn ngày hiện tại, thiết lập trạng thái là 'up_comming'
        $voucher->status = 'up_comming';
    } elseif($startTime <= $currentDate) {
        // Nếu start_time nhỏ hơn hoặc bằng ngày hiện tại, thiết lập trạng thái là 'on_going'
        $voucher->status = 'on_going';
    }

    // Lưu thông tin voucher đã cập nhật vào cơ sở dữ liệu
    $voucher->save();

    // Trả về phản hồi với voucher đã khôi phục
    return response()->json(['message' => 'Voucher đã được khôi phục', 'voucher' => new VoucherResource($voucher)]);
}

}

