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
use App\Http\Resources\Products\AttributeResource;
use App\Models\Brand;
use App\Models\Product;

class AttributeBrandController extends Controller
{

    public function index(AttributeRequest $req)
    {

        $brands = Brand::leftJoin('products', 'brands.id', '=', 'products.brand_id')
            ->select('brands.id as id', 'brands.code as code', 'brands.name as name', 'brands.status as status', DB::raw('count(products.id) as countProduct'))
            ->groupBy('brands.id', 'brands.code', 'brands.name', 'brands.status');

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['brands.code', 'brands.name'];
            QueryHelper::buildQuerySearchContains($brands, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($brands, 'brands.status', $req->status);
        }

        $statusCounts = Brand::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($brands, 'brands.created_at', 'desc');
        $brands = QueryHelper::buildPagination($brands, $req);

        return ApiResponse::responsePage(AttributeResource::collection($brands), $statusCounts);
    }

    public function storeBrand(AttributeRequestBody $req)
    {
        $brand = Brand::query();
        $prefix = 'TH';

        $moreColumns = [
            'code' => CustomCodeHelper::generateCode($brand, $prefix),
        ];

        // convert req
        $brandConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

        Brand::create($brandConverted);

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function update(AttributeRequestBody $req)
    {
        $brand = Brand::find($req->id);

        if (!$brand) {
            throw new NotFoundException("Không tìm thấy thương hiệu có id là " . $req->id);
        }

        if ($req->name !== $brand->name) {
            $existingBrand = Brand::where('name', '=', $req->name)->first();

            if ($existingBrand) {
                throw new RestApiException("Tên thương hiệu này đã tồn tại!");
            }
        }

        $brand->name = $req->name;
        $brand->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function updateStatus(AttributeRequestBody $req)
    {
        $brand = Brand::find($req->id);

        if (!$brand) {
            throw new NotFoundException("Không tìm thấy thương hiệu có id là " . $req->id);
        }

        $brand->status = $req->status;
        $brand->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function destroy(AttributeRequest $req)
    {
        $brand = Brand::find($req->id);

        if (!$brand) {
            throw new NotFoundException("Không tìm thấy thương hiệu có id là " . $req->id);
        }

        $brandInProduct = Product::where('brand_id', $req->id)->first();

        if ($brandInProduct) {
            throw new RestApiException("Không thể xóa thương hiệu này!");
        }

        $brand->delete();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    private function findAllPage($req)
    {
        $brands = Brand::leftJoin('products', 'brands.id', '=', 'products.brand_id')
            ->select('brands.id as id', 'brands.code as code', 'brands.name as name', 'brands.status as status', DB::raw('count(products.id) as countProduct'))
            ->groupBy('brands.id', 'brands.code', 'brands.name', 'brands.status');

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['brands.code', 'brands.name'];
            QueryHelper::buildQuerySearchContains($brands, $search, $searchFields);
        }

        if ($req->filled('filterStatus')) {
            QueryHelper::buildQueryEquals($brands, 'brands.status', $req->filterStatus);
        }

        QueryHelper::buildOrderBy($brands, 'brands.created_at', 'desc');
        $brands = QueryHelper::buildPagination($brands, $req);

        $statusCounts = Brand::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        $result['statusCounts'] = $statusCounts;
        $result['brands'] = $brands->items();
        $result['totalPages'] = $brands->lastPage();

        return $result;
    }
}
