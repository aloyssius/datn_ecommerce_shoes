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

class VoucherController extends Controller
{
    public function index(VoucherRequest $req)
    {

        DB::enableQueryLog();

        $vouchers = Voucher::select(VoucherResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'name'];
            QueryHelper::buildQuerySearchContains($vouchers, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($vouchers, 'status', $req->status);
        }

        $vouchers->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
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

        $statusCounts = Voucher::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($vouchers, 'created_at', 'desc');
        $vouchers = QueryHelper::buildPagination($vouchers, $req);

        // ->orderBy('created_at', 'desc')
        // ->paginate($req->pageSize, ['*'], 'page', $req->currentPage);

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

    // public function updateStatus(ProductRequestBody $req)
    // {
    //     $product = Product::find($req->id);

    //     if (!$product) {
    //         throw new NotFoundException("Không tìm thấy sản phẩm có id là " . $req->id);
    //     }

    //     $product->status = $req->statusProduct;
    //     $product->update();

    //     $products = Product::getProducts($req);

    //     $statusCounts = Product::select(DB::raw('count(status) as count, status'))
    //         ->groupBy('status')
    //         ->get();

    //     $response['products'] = $products['data'];
    //     $response['statusCounts'] = $statusCounts;
    //     $response['totalPages'] = $products['totalPages'];

    //     return ApiResponse::responseObject($response);
    // }

    public function store(VoucherRequestBody $req)
    {
        // convert req
        $voucherConverted = ConvertHelper::convertColumnsToSnakeCase($req->all());

        // kiểm tra startTime và cập nhật status
        $currentDate = $currentDateTime = Carbon::now(); // Lấy ngày hiện tại

        if (isset($voucherConverted['start_time'])) {
            $startTime = $voucherConverted['start_time'];
    
            if ($startTime > $currentDate) {
                $voucherConverted['status'] = 'up_comming';
            } elseif ($startTime < $currentDate) {
                $voucherConverted['status'] = 'on_going';
            }
        }

        // save
        $voucherCreated = Voucher::create($voucherConverted);
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

        // Kiểm tra và cập nhật status dựa trên startTime
        $currentDate = $currentDateTime = Carbon::now(); // Lấy ngày hiện tại

        if (isset($voucherConverted['start_time'])) {
            $startTime = $voucherConverted['start_time'];

            if ($startTime > $currentDate) {
                $voucherConverted['status'] = 'up_comming'; 
            } elseif ($startTime < $currentDate) {
                $voucherConverted['status'] = 'on_going';
            }
        }

        // Cập nhật thông tin voucher
        $voucher->update($voucherConverted);

        // Trả về thông tin voucher đã cập nhật dưới dạng ApiResponse
        return ApiResponse::responseObject(new VoucherResource($voucher));
    }
}
