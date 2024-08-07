<?php

namespace App\Http\Controllers;

use App\Constants\ConstantSystem;
use App\Constants\Role as ConstantsRole;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Helpers\ApiResponse;
use App\Helpers\CustomCodeHelper;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\AccountRequestBody;
use App\Http\Resources\Accounts\AccountResource;
use App\Jobs\SendEmailVerification;
use App\Mail\VerifyEmail;
use App\Models\Account;
use App\Models\Cart;
use App\Models\CartDetails;
use App\Models\ProductDetails;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $cartItems = $request->cartItems;

        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'nullable|string',
        ]);

        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return ApiResponse::responseError(
                ConstantSystem::UNAUTHORIZED_CODE,
                ConstantSystem::UNAUTHORIZED,
                "Tài khoản hoặc mật khẩu không chính xác"
            );
        }

        $roleCustomer = Role::where('code', ConstantsRole::CUSTOMER)->first();
        if (Auth::user()->role_id !== $roleCustomer->id) {
            auth()->logout();
            return ApiResponse::responseError(
                ConstantSystem::UNAUTHORIZED_CODE,
                ConstantSystem::UNAUTHORIZED,
                "Tài khoản hoặc mật khẩu không chính xác"
            );
        }

        if (Auth::user()->email_verified_at === null) {
            $data['user'] = Auth::user();
            $data['email'] = Auth::user()->email;
            SendEmailVerification::dispatch($data)->delay(now()->addSeconds(3));
            auth()->logout();
            return ApiResponse::responseError(
                ConstantSystem::UNAUTHORIZED_CODE,
                ConstantSystem::UNAUTHORIZED,
                'Bạn chưa xác thực tài khoản của mình. Chúng tôi đã gửi cho bạn email kích hoạt tài khoản, vui lòng kiểm tra email của bạn',
            );
        }

        return $this->createNewToken($token, $cartItems);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|max:255',
        ]);

        $account = Account::query();
        $prefix = ConstantSystem::CUSTOMER_CODE_PREFIX;

        $roleCustomer = Role::where('code', ConstantsRole::CUSTOMER)->first();

        $findEmailCustomer = Account::where('email', $validated['email'])
            ->where('role_id', $roleCustomer->id)->first();

        if ($findEmailCustomer) {
            throw new RestApiException("Địa chỉ email này đã tồn tại");
        }

        try {
            DB::beginTransaction();

            $user = Account::create([
                'email' => $validated['email'],
                'code' => CustomCodeHelper::generateCode($account, $prefix),
                'role_id' => $roleCustomer->id,
                'password' => bcrypt($validated['password']),
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            // throw new RestApiException($e->getMessage());
            throw new RestApiException("Đăng ký tài khoản không thành công");
        }

        $data['user'] = $user;
        $data['email'] = $validated['email'];
        SendEmailVerification::dispatch($data)->delay(now()->addSeconds(3));

        return ApiResponse::responseObject($user, "Đăng ký thành công!", ConstantSystem::SUCCESS_CODE);
    }

    public function verify($id)
    {
        $roleCustomer = Role::where('code', ConstantsRole::CUSTOMER)->first();

        $customer = Account::where('id', $id)->where('role_id', $roleCustomer->id)->first();

        if (!$customer) {
            throw new NotFoundException("Tài khoản không tồn tại");
        }

        if ($customer->email_verified_at !== null) {
            throw new NotFoundException("Tài khoản đã được xác thực");
        }

        try {
            DB::beginTransaction();

            $customer->email_verified_at = now();
            $customer->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException("Xác thực tài khoản không thành công");
        }

        // login
        return ApiResponse::responseObject(new AccountResource($customer), "Xác thực tài khoản thành công!", ConstantSystem::SUCCESS_CODE);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function show()
    {
        $response = Auth::user();
        $cartItemsByCart = CartDetails::getCartItemsByAccount(Auth::user()->id);
        $response['cartItems'] = $cartItemsByCart;
        return ApiResponse::responseObject(new AccountResource($response));
    }

    public function updateAccount(Request $request)
    {
        $user = Auth::user();

        if ($user->phone_number !== $request->phoneNumber) {
            $roleCustomer = Role::where('code', ConstantsRole::CUSTOMER)->first();
            $accountPhoneNumner = Account::where('phone_number', $request->phoneNumber)
                ->where('role_id', $roleCustomer->id)
                ->first();

            if ($accountPhoneNumner) {
                throw new RestApiException("SĐT này đã tồn tại");
            }
        }

        try {
            DB::beginTransaction();

            $user->full_name = $request->fullName;
            $user->phone_number = $request->phoneNumber;
            $user->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }

        return ApiResponse::responseObject(new AccountResource($user));
    }

    public function showAccountRegister($id)
    {
        $roleCustomer = Role::where('code', ConstantsRole::CUSTOMER)->first();

        $customer = Account::where('id', $id)->where('role_id', $roleCustomer->id)->first();

        if (!$customer) {
            throw new NotFoundException("Tài khoản không tồn tại");
        }

        if ($customer->email_verified_at !== null) {
            throw new NotFoundException("Tài khoản đã được xác thực");
        }

        return ApiResponse::responseObject(new AccountResource($customer));
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return ApiResponse::responseObject([], 'Đăng xuất thành công!', ConstantSystem::SUCCESS_CODE);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->createNewToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token, $cartItems)
    {
        $id = Auth::user()->id;
        $isRemoveCartLocalStrorageBrowser = false;
        $cartItemsByCart = [];

        $cartByAccount = Cart::where('account_id', $id)->first();

        try {
            DB::beginTransaction();

            if (!$cartByAccount) {
                $newCart = new Cart();
                $newCart->account_id = $id;
                $newCart->save();

                if (count($cartItems) > 0) {
                    foreach ($cartItems as $cartItem) {

                        $findProductItem = ProductDetails::find($cartItem['id']);

                        if ($findProductItem) {
                            $newCartItem = new CartDetails();
                            $newCartItem->cart_id = $newCart->id;
                            $newCartItem->quantity = $cartItem['quantity'];
                            $newCartItem->product_details_id = $cartItem['id'];
                            $newCartItem->created_at = Carbon::parse($cartItem['createdAt']);
                            $newCartItem->save();
                        }
                    }
                    $isRemoveCartLocalStrorageBrowser = true;
                    $cartItemsByCart = CartDetails::getCartItemsByAccount($id);
                }
            } else {
                $cartItemsByCart = CartDetails::getCartItemsByAccount($id);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            Auth::logout();
            $isRemoveCartLocalStrorageBrowser = false;
            throw new RestApiException("Có lỗi xảy ra");
        }

        $response['accessToken'] = $token;
        $response['user'] = auth()->user();
        $response['user']['cartItems'] = $cartItemsByCart;
        $response['isRemoveCartBrowser'] = $isRemoveCartLocalStrorageBrowser;

        // $response['expires_in'] = auth()->factory()->getTTL() * 60;
        // $response = new Response();
        // $response->withCookie("jwt_toke");

        return ApiResponse::responseObject($response);
    }
}
