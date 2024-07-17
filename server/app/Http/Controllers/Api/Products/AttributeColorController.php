<?php

namespace App\Http\Controllers\Api\Products;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Http\Requests\Product\AttributeRequest;
use App\Http\Requests\Product\ColorRequestBody;
use App\Http\Resources\Products\AttributeResource;
use App\Models\Color;
use App\Models\ProductDetails;

class AttributeColorController extends Controller
{

    public function index(AttributeRequest $req)
    {

        $colors = Color::select(AttributeResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'name'];
            QueryHelper::buildQuerySearchContains($colors, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($colors, 'status', $req->status);
        }

        $statusCounts = Color::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($colors, 'created_at', 'desc');
        $colors = QueryHelper::buildPagination($colors, $req);

        return ApiResponse::responsePage(AttributeResource::collection($colors), $statusCounts);
    }

    public function store(ColorRequestBody $req)
    {
        Color::create($req->all());

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function update(ColorRequestBody $req)
    {
        $color = Color::find($req->id);

        if (!$color) {
            throw new NotFoundException("Không tìm thấy màu sắc có id là " . $req->id);
        }

        if ($req->code !== $color->code) {
            $existingColor = Color::where('code', '=', $req->code)->first();

            if ($existingColor) {
                throw new RestApiException("Mã màu sắc này đã tồn tại!");
            }
        }

        $color->name = $req->name;
        $color->code = $req->code;
        $color->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function updateStatus(ColorRequestBody $req)
    {
        $color = Color::find($req->id);

        if (!$color) {
            throw new NotFoundException("Không tìm thấy màu sắc có id là " . $req->id);
        }

        $color->status = $req->status;
        $color->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function destroy(AttributeRequest $req)
    {
        $color = Color::find($req->id);

        if (!$color) {
            throw new NotFoundException("Không tìm thấy màu sắc có id là " . $req->id);
        }

        $productItem = ProductDetails::where('color_id', $req->id)->first();

        if ($productItem) {
            throw new NotFoundException("Không thể xóa màu sắc này!");
        }

        $color->delete();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    private function findAllPage($req)
    {
        $colors = Color::select(AttributeResource::fields());

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'name'];
            QueryHelper::buildQuerySearchContains($colors, $search, $searchFields);
        }

        if ($req->filled('filterStatus')) {
            QueryHelper::buildQueryEquals($colors, 'status', $req->filterStatus);
        }

        QueryHelper::buildOrderBy($colors, 'created_at', 'desc');
        $colors = QueryHelper::buildPagination($colors, $req);

        $statusCounts = Color::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        $result['statusCounts'] = $statusCounts;
        $result['colors'] = $colors->items();
        $result['totalPages'] = $colors->lastPage();

        return $result;
    }
}
