<?php

namespace App\Http\Controllers\Api\Products;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Http\Requests\Product\AttributeRequest;
use App\Http\Requests\Product\AttributeRequestBody;
use App\Http\Requests\Product\ColorRequestBody;
use App\Http\Resources\Products\AttributeResource;
use App\Models\Color;
use App\Models\ProductDetails;
use App\Models\Size;

class AttributeSizeController extends Controller
{

    public function index(AttributeRequest $req)
    {

        $sizes = Size::select(AttributeResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'name'];
            QueryHelper::buildQuerySearchContains($sizes, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($sizes, 'status', $req->status);
        }

        $statusCounts = Size::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($sizes, 'created_at', 'desc');
        $sizes = QueryHelper::buildPagination($sizes, $req);

        return ApiResponse::responsePage(AttributeResource::collection($sizes), $statusCounts);
    }

    public function storeSize(AttributeRequestBody $req)
    {

        $size = Size::query();
        $prefix = 'KC';

        $moreColumns = [
            'code' => CustomCodeHelper::generateCode($size, $prefix),
        ];

        // convert req
        $categoryConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

        Size::create($categoryConverted);

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function update(AttributeRequestBody $req)
    {
        $size = Size::find($req->id);

        if (!$size) {
            throw new NotFoundException("Không tìm thấy kích cỡ có id là " . $req->id);
        }

        if ($req->name !== $size->name) {
            $existingSize = Size::where('name', '=', $req->name)->first();

            if ($existingSize) {
                throw new RestApiException("Tên kích cỡ này đã tồn tại!");
            }
        }

        $size->name = $req->name;
        $size->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function updateStatus(AttributeRequestBody $req)
    {
        $size = Size::find($req->id);

        if (!$size) {
            throw new NotFoundException("Không tìm thấy kích cỡ có id là " . $req->id);
        }

        $size->status = $req->status;
        $size->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function destroy(AttributeRequest $req)
    {
        $size = Size::find($req->id);

        if (!$size) {
            throw new NotFoundException("Không tìm thấy kích cỡ có id là " . $req->id);
        }

        $productItem = ProductDetails::where('size_id', $req->id)->first();

        if ($productItem) {
            throw new NotFoundException("Không thể xóa kích cỡ này!");
        }

        $size->delete();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    private function findAllPage($req)
    {
        $sizes = Size::select(AttributeResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'name'];
            QueryHelper::buildQuerySearchContains($sizes, $search, $searchFields);
        }

        if ($req->filled('filterStatus')) {
            QueryHelper::buildQueryEquals($sizes, 'status', $req->filterStatus);
        }

        QueryHelper::buildOrderBy($sizes, 'created_at', 'desc');
        $sizes = QueryHelper::buildPagination($sizes, $req);

        $statusCounts = Size::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        $result['statusCounts'] = $statusCounts;
        $result['sizes'] = $sizes->items();
        $result['totalPages'] = $sizes->lastPage();

        return $result;
    }
}
