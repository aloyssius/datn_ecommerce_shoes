<?php

namespace App\Http\Controllers\Api\Carts;

use App\Constants\DiscountStatus;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Helpers\ApiResponse;
use App\Helpers\ConvertHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\Vouchers\VoucherResource;
use App\Models\Cart;
use App\Models\CartDetails;
use App\Models\ProductDetails;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{

    public function indexByAccount($accountId)
    {
        $response = CartDetails::getCartItemsByAccount($accountId);
        return ApiResponse::responseObject($response);
    }

    public function index(Request $req)
    {
        $response = ProductDetails::getClientProductDetailByIds($req->ids);
        return ApiResponse::responseObject($response);
    }

    public function store(Request $req)
    {
        $findProduct = ProductDetails::getClientProductDetailById($req->productItemId)->first();
        if (!$findProduct) {
            throw new NotFoundException("Không tìm thấy sản phẩm này!");
        }
        // if ($findProduct->stock <= 0) {
        //     throw new RestApiException("Sản phẩm tạm hết hàng");
        // }

        $cartItem = CartDetails::join('carts', 'cart_details.cart_id', '=', 'carts.id')
            ->where('carts.account_id', $req->accountId)
            ->where('cart_details.product_details_id', $req->productItemId)
            ->select('cart_details.*')
            ->first();

        try {
            DB::beginTransaction();

            if ($cartItem) {

                if ($cartItem->quantity + 1 > 3) {
                    throw new RestApiException("Tối đa 3 số lượng cho mỗi sản phẩm");
                }

                if ($cartItem->quantity + 1 > $findProduct->stock) {
                    throw new RestApiException("Số lượng trong giỏ đã vượt quá số lượng tồn kho");
                }

                $cartItem->quantity += 1;
                $cartItem->created_at = now();
                $cartItem->save();
            } else {
                $cart = Cart::where('account_id', $req->accountId)->first();
                $newCartItem = new CartDetails();
                $newCartItem->cart_id = $cart->id;
                $newCartItem->quantity = 1;
                $newCartItem->product_details_id = $req->productItemId;
                $newCartItem->save();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }

        $response = CartDetails::getCartItemsByAccount($req->accountId);

        return ApiResponse::responseObject($response);
    }

    public function update(Request $req)
    {
        $cartItem = CartDetails::find($req->id);

        if (!$cartItem) {
            throw new RestApiException("Không tìm thấy sản phẩm này trong giỏ");
        }

        try {
            DB::beginTransaction();

            $cartItem->product_details_id = $req->newProductItemId;
            $cartItem->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }

        $response = CartDetails::getCartItemsByAccount($req->accountId);
        return ApiResponse::responseObject($response);
    }

    public function updateQuantity(Request $req)
    {
        $cartItem = CartDetails::find($req->id);

        if (!$cartItem) {
            throw new RestApiException("Không tìm thấy sản phẩm này trong giỏ");
        }

        try {
            DB::beginTransaction();

            $cartItem->quantity = $req->quantity;
            $cartItem->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }

        $response = CartDetails::getCartItemsByAccount($req->accountId);
        return ApiResponse::responseObject($response);
    }

    public function destroy($id)
    {
        $cartItem = CartDetails::find($id);

        if (!$cartItem) {
            throw new RestApiException("Không tìm sản phẩm này trong giỏ");
        }

        try {
            DB::beginTransaction();

            $cartItem->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new RestApiException($e->getMessage());
        }

        return ApiResponse::responseObject($id);
    }

    public function findVoucher(Request $req)
    {
        $voucher = Voucher::where('code', $req->code)->first();

        if (!$voucher) {
            throw new RestApiException("Mã khuyến mãi không tồn tại hoặc đã hết hạn sử dụng");
        }

        if ($voucher->status === DiscountStatus::FINISHED || $voucher->status === DiscountStatus::UP_COMMING) {
            throw new RestApiException("Mã khuyến mãi không tồn tại hoặc đã hết hạn sử dụng");
        }

        if ($req->totalCart < $voucher->min_order_value) {
            $minValue = ConvertHelper::formatCurrencyVnd($voucher->min_order_value);
            throw new RestApiException("Chỉ áp dụng cho đơn tối thiểu từ $minValue VNĐ");
        }

        return ApiResponse::responseObject(new VoucherResource($voucher));
    }
}
