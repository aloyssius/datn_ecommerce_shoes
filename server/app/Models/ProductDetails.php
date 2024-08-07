<?php

namespace App\Models;

use App\Constants\ProductStatus;
use App\Http\Resources\Products\ProductItemResource;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class ProductDetails extends BaseModel
{
    protected $table = 'product_details';

    protected $fillable = [
        'sku',
        'quantity',
        'price',
        'status',
        'product_id',
        'color_id',
        'size_id',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public static function getClientProducts($req, $gender = null)
    {
        $offSet = ($req->currentPage - 1) * $req->pageSize;
        $productActiveStatus = ProductStatus::IS_ACTIVE;

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, PATH_URL, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.sku, P.name, PD.price, P.created_at, P.status, C.name as colorName, PDI.path_url
            FROM PRODUCT_DETAILS PD
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN SIZES S ON PD.SIZE_ID = S.ID
            JOIN BRANDS B ON P.BRAND_ID = B.ID
            JOIN PRODUCT_CATEGORIES PC ON P.ID = PC.PRODUCT_ID
            JOIN CATEGORIES CG on PC.CATEGORY_ID = CG.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE P.status = '$productActiveStatus'
        ";

        if ($gender === 'male') {
            $query .= " AND CG.NAME = 'Nam' ";
        }

        if ($gender === 'female') {
            $query .= " AND CG.NAME = 'Nữ' ";
        }

        //where attribute active ??

        if ($req->filled('search')) {
            $query .= " AND (CONCAT(P.NAME, ' ', C.NAME) LIKE '%" . $req->search . "%' OR PD.SKU LIKE '%" . $req->search . "%') ";
        }

        if ($req->filled('minPrice')) {
            $minPrice = $req->minPrice;
            $query .= " AND PD.PRICE >= $minPrice";
        }

        if ($req->filled('maxPrice')) {
            $maxPrice = $req->maxPrice;
            $query .= " AND PD.PRICE <= $maxPrice";
        }

        if ($req->filled('categoryIds')) {
            $categoryIds = explode(',', $req->categoryIds);
            $categoryIds = array_map('trim', $categoryIds);
            $categoryIdsString = "'" . implode("', '", $categoryIds) . "'";
            $query .= " AND CG.ID IN ($categoryIdsString) ";
        }

        if ($req->filled('brandIds')) {
            $brandIds = explode(',', $req->brandIds);
            $brandIds = array_map('trim', $brandIds);
            $brandIdsString = "'" . implode("', '", $brandIds) . "'";
            $query .= " AND B.ID IN ($brandIdsString) ";
        }

        if ($req->filled('colorIds')) {
            $colorIds = explode(',', $req->colorIds);
            $colorIds = array_map('trim', $colorIds);
            $colorIdsString = "'" . implode("', '", $colorIds) . "'";
            $query .= " AND C.ID IN ($colorIdsString) ";
        }
        if ($req->filled('sizeIds')) {
            $sizeIds = explode(',', $req->sizeIds);
            $sizeIds = array_map('trim', $sizeIds);
            $sizeIdsString = "'" . implode("', '", $sizeIds) . "'";
            $query .= " AND S.ID IN ($sizeIdsString) ";
        }

        $query .= "
        GROUP BY PD.SKU, P.NAME, PD.PRICE, P.CREATED_AT, P.STATUS, PDI.PATH_URL, C.NAME
        ";

        $query .= "
        ORDER BY P.CREATED_AT DESC";

        if ($req->filled('sortType')) {
            if ($req->sortType == 'lowToHigh') {
                $query .= ", PD.price ASC";
            } elseif ($req->sortType == 'highToLow') {
                $query .= ", PD.price DESC";
            }
        }

        $query .= "
        LIMIT $req->pageSize
        OFFSET $offSet
        ";

        $productDetails = DB::select($query);
        $totalRecords = count($productDetails);
        $totalPages = ceil($totalRecords / $req->pageSize);

        $convertedProducts = ProductDetails::hydrate($productDetails);
        $data['data'] = ProductItemResource::collection($convertedProducts);
        $data['totalPages'] = $totalPages;
        $data['totalElements'] = $totalRecords;
        $data['currentPage'] = $req->currentPage;
        $data['pageSize'] = $req->pageSize;

        return $data;
    }

    public static function getClientProductDetailById($id)
    {

        $productActiveStatus = ProductStatus::IS_ACTIVE;

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.id, PD.sku, P.name, PD.price, C.name as colorName, PDI.path_url as pathUrl, S.name as sizeName, PD.quantity as stock
            FROM PRODUCT_DETAILS PD
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN SIZES S ON PD.SIZE_ID = S.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE P.STATUS = '$productActiveStatus'
            AND PD.STATUS = '$productActiveStatus'
            AND PD.ID = '$id'
        ";

        $productDetail = DB::select($query);
        $convertedProduct = ProductDetails::hydrate($productDetail);

        return $convertedProduct;
    }

    public static function getClientProductDetailByIds($ids)
    {
        $ids = array_map(function ($id) {
            return "'$id'";
        }, $ids);

        $idsConverted = implode(', ', $ids);

        $productActiveStatus = ProductStatus::IS_ACTIVE;

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.id, PD.sku, P.name, PD.price, C.name as colorName, PDI.path_url as pathUrl, S.name as sizeName, PD.quantity as stock
            FROM PRODUCT_DETAILS PD
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN SIZES S ON PD.SIZE_ID = S.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE P.STATUS = '$productActiveStatus'
            AND PD.STATUS = '$productActiveStatus'
            AND PD.ID IN ($idsConverted)
        ";

        $productDetails = DB::select($query);
        $convertedProducts = ProductDetails::hydrate($productDetails);

        foreach ($convertedProducts as $product) {
            $sizes = ProductDetails::select('product_details.quantity', 'product_details.id', 'sizes.name', 'product_details.status')
                ->where('product_details.sku', $product->sku)
                ->where('product_details.status', $productActiveStatus)
                ->join('sizes', 'product_details.size_id', '=', 'sizes.id')
                ->orderBy('sizes.name', 'asc')
                ->get();
            $product->sizes = $sizes;
        }

        return $convertedProducts;
    }

    public static function getClientProductTopSold()
    {
        $productActiveStatus = ProductStatus::IS_ACTIVE;

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.sku, P.name, PD.price, C.name as colorName, PDI.path_url as pathUrl, SUM(BD.quantity) as totalSold
            FROM BILL_DETAILS BD
            JOIN BILLS B ON BD.BILL_ID = B.ID
			JOIN PRODUCT_DETAILS PD ON PD.ID = BD.PRODUCT_DETAILS_ID
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE P.STATUS = '$productActiveStatus'
            AND PD.STATUS = '$productActiveStatus'
            AND B.STATUS = 'completed'
            GROUP BY PD.SKU, P.NAME, PD.PRICE, C.NAME, PDI.PATH_URL
			ORDER BY SUM(BD.quantity) DESC
            LIMIT 8
        ";

        $productDetails = DB::select($query);
        $convertedProducts = ProductDetails::hydrate($productDetails);

        return $convertedProducts;
    }

    public static function getClientProductHome()
    {
        $productActiveStatus = ProductStatus::IS_ACTIVE;

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.sku, P.name, PD.price, C.name as colorName, PDI.path_url as pathUrl, P.created_at as createdAt
            FROM PRODUCT_DETAILS PD
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE P.STATUS = '$productActiveStatus'
            AND PD.STATUS = '$productActiveStatus'
            GROUP BY PD.SKU, P.NAME, PD.PRICE, C.NAME, PDI.PATH_URL, P.CREATED_AT
            ORDER BY P.CREATED_AT DESC
            LIMIT 8
        ";

        $productDetails = DB::select($query);
        $convertedProducts = ProductDetails::hydrate($productDetails);

        return $convertedProducts;
    }

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }
}
