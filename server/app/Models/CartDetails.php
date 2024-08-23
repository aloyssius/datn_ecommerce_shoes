<?php

namespace App\Models;

use App\Constants\ProductStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CartDetails extends BaseModel
{
    protected $table = 'cart_details';

    protected $fillable = [
        'quantity',
        'cart_id',
        'product_details_id',
    ];

    protected $casts = [
        'price' => 'float',
    ];

    public static function getCartItemsByAccount($id)
    {
        $productActiveStatus = ProductStatus::IS_ACTIVE;

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT CD.id as cartDetailId, PD.id, PD.sku, P.name, PD.price, C.name as colorName, PDI.path_url as pathUrl, S.name as sizeName, PD.quantity as stock, CD.quantity, CD.created_at as createdAt
            FROM CART_DETAILS CD
            JOIN CARTS CA ON CD.CART_ID = CA.ID
            JOIN PRODUCT_DETAILS PD ON CD.PRODUCT_DETAILS_ID = PD.ID
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN SIZES S ON PD.SIZE_ID = S.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE P.STATUS = '$productActiveStatus'
            AND PD.STATUS = '$productActiveStatus'
            AND CA.ACCOUNT_ID = '$id'
            ORDER BY CD.CREATED_AT DESC
        ";

        $cartItems = DB::select($query);
        $convertedCartItems = CartDetails::hydrate($cartItems);

        foreach ($convertedCartItems as $cartItem) {
            $sizes = ProductDetails::select('product_details.quantity', 'product_details.id', 'sizes.name', 'product_details.status')
                ->where('product_details.sku', $cartItem->sku)
                ->where('product_details.status', $productActiveStatus)
                ->join('sizes', 'product_details.size_id', '=', 'sizes.id')
                ->orderBy('sizes.name', 'asc')
                ->get();
            $cartItem->sizes = $sizes;
        }

        return $convertedCartItems;
    }

    public function __construct(array $attributes = [])
    {
        $this->fillable = array_merge(parent::getBaseFillable(), $this->fillable);
        parent::__construct($attributes);
    }

    public function setCreatedAtAttribute($value)
    {
        $this->attributes['created_at'] = Carbon::parse($value)->timezone('Asia/Ho_Chi_Minh')->toDateTimeString();
    }
}
