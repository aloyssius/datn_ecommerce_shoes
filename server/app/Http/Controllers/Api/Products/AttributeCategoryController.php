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
use App\Http\Requests\Product\CategoryRequestBody;
use App\Http\Resources\Products\AttributeResource;
use App\Models\Category;
use App\Models\ProductCategory;

class AttributeCategoryController extends Controller
{

    public function index(AttributeRequest $req)
    {

        $categories = Category::leftJoin('product_categories', 'categories.id', '=', 'product_categories.category_id')
            ->select('categories.id as id', 'categories.code as code', 'categories.name as name', 'categories.status as status', DB::raw('count(product_categories.product_id) as countProduct'))
            ->groupBy('categories.id', 'categories.code', 'categories.name', 'categories.status');

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['categories.code', 'categories.name'];
            QueryHelper::buildQuerySearchContains($categories, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($categories, 'categories.status', $req->status);
        }

        $statusCounts = Category::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($categories, 'categories.created_at', 'desc');
        $categories = QueryHelper::buildPagination($categories, $req);

        return ApiResponse::responsePage(AttributeResource::collection($categories), $statusCounts);
    }

    public function storeCategory(AttributeRequestBody $req)
    {
        $category = Category::query();
        $prefix = 'DM';

        $moreColumns = [
            'code' => CustomCodeHelper::generateCode($category, $prefix),
        ];

        // convert req
        $categoryConverted = ConvertHelper::convertColumnsToSnakeCase($req->all(), $moreColumns);

        Category::create($categoryConverted);

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function update(AttributeRequestBody $req)
    {
        $category = Category::find($req->id);

        if (!$category) {
            throw new NotFoundException("Không tìm thấy danh mục có id là " . $req->id);
        }

        if ($req->name !== $category->name) {
            $existingCategory = Category::where('name', '=', $req->name)->first();

            if ($existingCategory) {
                throw new RestApiException("Tên danh mục này đã tồn tại!");
            }
        }

        $category->name = $req->name;
        $category->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function updateStatus(AttributeRequestBody $req)
    {
        $category = Category::find($req->id);

        if (!$category) {
            throw new NotFoundException("Không tìm thấy danh mục có id là " . $req->id);
        }

        $category->status = $req->status;
        $category->update();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    public function destroy(AttributeRequest $req)
    {
        $category = Category::find($req->id);

        if (!$category) {
            throw new NotFoundException("Không tìm thấy danh mục có id là " . $req->id);
        }

        $categoryInProduct = ProductCategory::where('category_id', $req->id)->first();

        if ($categoryInProduct) {
            throw new RestApiException("Không thể xóa danh mục này!");
        }

        $category->delete();

        $response = $this->findAllPage($req);

        return ApiResponse::responseObject($response);
    }

    private function findAllPage($req)
    {
        $categories = Category::leftJoin('product_categories', 'categories.id', '=', 'product_categories.category_id')
            ->select('categories.id as id', 'categories.code as code', 'categories.name as name', 'categories.status as status', DB::raw('count(product_categories.product_id) as countProduct'))
            ->groupBy('categories.id', 'categories.code', 'categories.name', 'categories.status');

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['categories.code', 'categories.name'];
            QueryHelper::buildQuerySearchContains($categories, $search, $searchFields);
        }

        if ($req->filled('filterStatus')) {
            QueryHelper::buildQueryEquals($categories, 'categories.status', $req->filterStatus);
        }

        QueryHelper::buildOrderBy($categories, 'categories.created_at', 'desc');
        $categories = QueryHelper::buildPagination($categories, $req);

        $statusCounts = Category::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        $result['statusCounts'] = $statusCounts;
        $result['categories'] = $categories->items();
        $result['totalPages'] = $categories->lastPage();

        return $result;
    }
}
