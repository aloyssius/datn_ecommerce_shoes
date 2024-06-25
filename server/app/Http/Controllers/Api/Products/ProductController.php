<?php

namespace App\Http\Controllers\Api\Products;

use App\Helpers\ApiResponse;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\Products\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(ProductRequest $req)
    {
        $products = Product::join('product_details', 'products.id', '=', 'product_details.product_id')
            ->join('brands', 'product_details.brand_id', '=', 'brands.id')
            ->join('categories', 'product_details.category_id', '=', 'categories.id')
            ->select('products.id', 'products.sku', 'products.name', 'brands.name as brand', 'products.created_at', DB::raw('sum(product_details.quantity) as totalQuantity'), 'products.status')
            ->selectRaw('case when sum(product_details.quantity) <= 0 then "Hết hàng" when sum(product_details.quantity) <= 10 then "Sắp hết" else "Còn hàng" end as stockStatus')
            ->groupBy('products.id', 'products.sku', 'products.name', 'brands.name', 'products.created_at', 'products.status');

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['products.sku', 'products.name'];
            QueryHelper::buildQuerySearchContains($products, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryIn($products, 'products.status', $req->status);
        }

        if ($req->filled('categoryIds')) {
            QueryHelper::buildQueryIn($products, 'product_details.category_id', $req->categoryIds);
        }

        if ($req->filled('brandIds')) {
            QueryHelper::buildQueryIn($products, 'product_details.brand_id', $req->brandIds);
        }

        if ($req->filled('quantityConditions')) {
            $arrayValue = explode(',', $req->quantityConditions);
            $conditions = [];
            foreach ($arrayValue as $condition) {
                $conditions[] = 'SUM(product_details.quantity) ' . $condition;
            }
            $products->havingRaw(implode(' OR ', $conditions));
        }

        $statusCounts = Product::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        $brands = Brand::select(['id', 'name'])->get();
        $categories = Category::select(['id', 'name'])->get();

        $otherData['brands'] = $brands;
        $otherData['categories'] = $categories;

        QueryHelper::buildOrderBy($products, 'products.created_at', 'desc');
        $products = QueryHelper::buildPagination($products, $req);

        return ApiResponse::responsePage(ProductResource::collection($products), $statusCounts, $otherData);
    }
}
