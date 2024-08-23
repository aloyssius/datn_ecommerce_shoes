<?php

namespace App\Models;

use App\Constants\ProductStatus;
use App\Http\Resources\Products\ProductResource;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Product extends BaseModel
{

    protected $fillable = [
        'name',
        'code',
        'status',
        'description',
        'brand_id'
    ];

    public static function getProducts($req)
    {
        $offSet = ($req->currentPage - 1) * $req->pageSize;

        $query = "
            WITH PRODUCT_QUANTITY AS (
              SELECT PRODUCT_ID, SUM(QUANTITY) AS totalQuantity
              FROM PRODUCT_DETAILS
              GROUP BY PRODUCT_ID
            ),
            PRODUCT_DEFAULT_IMAGE AS (
              SELECT  PRODUCT_ID, PATH_URL,
              ROW_NUMBER() OVER (PARTITION BY PRODUCT_ID ORDER BY PATH_URL) AS image_rank
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT P.id, P.code, P.name, B.name as brand, P.created_at, PQ.totalQuantity, P.status, PDI.path_url as imageUrl,
              CASE
                 WHEN PQ.totalQuantity <= 0 THEN 'Hết hàng'
                 WHEN PQ.totalQuantity <= 10 THEN 'Sắp hết hàng'
                 ELSE 'Còn hàng' END AS stockStatus
            FROM PRODUCTS P
            JOIN PRODUCT_QUANTITY PQ ON P.ID = PQ.PRODUCT_ID
            JOIN (
            SELECT PRODUCT_ID, PATH_URL
            FROM PRODUCT_DEFAULT_IMAGE
            WHERE image_rank = 1
            ) PDI ON P.ID = PDI.PRODUCT_ID
            JOIN BRANDS B ON P.BRAND_ID = B.ID
            JOIN PRODUCT_CATEGORIES PC ON P.ID = PC.PRODUCT_ID
            JOIN CATEGORIES C on PC.CATEGORY_ID = C.ID
        ";

        if ($req->filled('search')) {
            $query .= " WHERE P.NAME LIKE '%" . $req->search . "%' OR P.CODE LIKE '%" . $req->search . "%' ";
        }

        if ($req->filled('status')) {
            if ($req->filled('search')) {
                $query .= " AND P.STATUS IN ('$req->status') ";
            } else {
                $query .= " WHERE P.STATUS IN ('$req->status') ";
            }
        }

        if ($req->filled('categoryIds')) {
            if ($req->filled('search') ||  $req->filled('status')) {
                $categoryIds = explode(',', $req->categoryIds);
                $categoryIds = array_map('trim', $categoryIds);
                $categoryIdsString = "'" . implode("', '", $categoryIds) . "'";
                $query .= " AND C.ID IN ($categoryIdsString) ";
            } else {
                $categoryIds = explode(',', $req->categoryIds);
                $categoryIds = array_map('trim', $categoryIds);
                $categoryIdsString = "'" . implode("', '", $categoryIds) . "'";
                $query .= " WHERE C.ID IN ($categoryIdsString)";
            }
        }

        if ($req->filled('brandIds')) {
            if ($req->filled('search') ||  $req->filled('status') || $req->filled('categoryIds')) {
                $brandIds = explode(',', $req->brandIds);
                $brandIds = array_map('trim', $brandIds);
                $brandIdsString = "'" . implode("', '", $brandIds) . "'";
                $query .= " AND B.ID IN ($brandIdsString) ";
            } else {
                $brandIds = explode(',', $req->brandIds);
                $brandIds = array_map('trim', $brandIds);
                $brandIdsString = "'" . implode("', '", $brandIds) . "'";
                $query .= " WHERE B.ID IN ($brandIdsString) ";
            }
        }

        $query .= "
        GROUP BY P.ID, P.CODE, P.NAME, B.NAME, P.CREATED_AT, PQ.totalQuantity, P.STATUS, PDI.PATH_URL
        ";

        if ($req->filled('quantityConditions')) {
            $quantityConditions = explode(',', $req->quantityConditions);
            $quantityConditions = array_map('trim', $quantityConditions);
            $quantityConditionsString = implode(' OR ', array_map(function ($condition) {
                return "PQ.totalQuantity $condition";
            }, $quantityConditions));
            $query .= " HAVING $quantityConditionsString ";
        }

        $query .= "
        ORDER BY created_at DESC
        LIMIT $req->pageSize
        OFFSET $offSet
        ";

        $totalRecords = DB::table('products')->count();
        $totalPages = ceil($totalRecords / $req->pageSize);

        $products = DB::select($query);
        $convertedProducts = Product::hydrate($products);
        $data['data'] = ProductResource::collection($convertedProducts);
        $data['totalPages'] = $totalPages;
        $data['currentPage'] = $req->currentPage;
        $data['pageSize'] = $req->pageSize;

        return $data;
    }

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
