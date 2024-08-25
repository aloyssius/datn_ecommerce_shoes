<?php

namespace App\Http\Controllers\Api\Bills;

use App\Constants\BillHistoryStatusTimeline;
use App\Constants\ConstantSystem;
use App\Constants\OrderStatus;
use App\Constants\Role as ConstantsRole;
use App\Constants\TransactionType;
use App\Exceptions\NotFoundException;
use App\Exceptions\RestApiException;
use App\Exceptions\VNPayException;
use App\Helpers\ApiResponse;
use App\Helpers\CustomCodeHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bill\BillRequest;
use App\Http\Requests\Bill\BillRequestBody;
use App\Http\Resources\Accounts\AccountResource;
use App\Http\Resources\Bills\BillDetailEmailResource;
use App\Http\Resources\Bills\BillDetailResource;
use App\Http\Resources\Bills\BillResource;
use App\Http\Resources\Bills\HistoryResource;
use App\Http\Resources\Bills\PaymentResource;
use App\Jobs\SendEmailPlaceOrderSuccess;
use App\Mail\PlaceOrderSuccessEmail;
use App\Models\Account;
use App\Models\Bill;
use App\Models\BillDetails;
use App\Models\BillHistory;
use App\Models\CartDetails;
use App\Models\Notification;
use App\Models\ProductDetails;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class BillController extends Controller
{
    public function index(BillRequest $req)
    {

        $bills = Bill::select('bills.id', 'bills.code', 'bills.full_name', 'bills.phone_number', 'bills.total_money', 'bills.status', 'bills.created_at', 'transactions.total_money as totalPayment')
            ->leftJoin('transactions', 'transactions.bill_id', '=', 'bills.id')->distinct();

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['bills.code', 'bills.full_name', 'bills.phone_number'];
            QueryHelper::buildQuerySearchContains($bills, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($bills, 'bills.status', $req->status);
        }

        $bills->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
            $startDate = Carbon::parse($req->startDate)->startOfDay();
            $endDate = Carbon::parse($req->endDate)->endOfDay();
            return $query->whereBetween('bills.created_at', [$startDate, $endDate]);
        })
            ->when($req->filled('startDate') && !$req->filled('endDate'), function ($query) use ($req) {
                $startDate = Carbon::parse($req->startDate)->startOfDay();
                $query->where('bills.created_at', '>=', $startDate);
            })
            ->when(!$req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
                $endDate = Carbon::parse($req->endDate)->endOfDay();
                $query->where('bills.created_at', '<=', $endDate);
            });

        $statusCounts = Bill::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($bills, 'bills.created_at', 'desc');
        $bills = QueryHelper::buildPagination($bills, $req);

        return ApiResponse::responsePage(BillResource::collection($bills), $statusCounts);
    }

    public function showBillsByAccount(Request $req)
    {
        $bills = Bill::where("customer_id", $req->accountId)->orderBy('created_at', 'desc')->paginate(10, ['*'], 'page', $req->currentPage);

        return ApiResponse::responsePage(BillResource::collection($bills));
    }

    public function showBillDetailByAccount(Request $req)
    {
        $bill = Bill::where("code", $req->code)->where("customer_id", $req->accountId)->first();

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function showClient(Request $request)
    {
        if ($request->type === "createToken") {
            $bill = Bill::where("code", $request->code)->where("phone_number", $request->phoneNumber)->first();

            if (!$bill) {
                throw new RestApiException("Không tìm thấy đơn hàng");
            }

            $token = Crypt::encrypt($request->code . '|' . $request->phoneNumber);
            return ApiResponse::responseObject($token);
        } else {
            try {
                $decrypted = Crypt::decrypt($request->token);
                list($code, $phoneNumber) = explode('|', $decrypted);

                $bill = Bill::where("code", $code)->where("phone_number", $phoneNumber)->first();
                if (!$bill) {
                    throw new NotFoundException("Không tìm thấy đơn hàng");
                }
            } catch (\Exception $e) {
                throw new NotFoundException($e->getMessage());
            }

            $bill = $this->getBillDetail($bill);
            return ApiResponse::responseObject(new BillDetailResource($bill));
        }
    }

    public function showAdmin($id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    // public function adminUpdateAdress(BillRequestBody $req)
    // {
    //     $bill = Bill::find($req->id);
    //
    //     if (!$bill) {
    //         throw new NotFoundException("Không tìm thấy đơn hàng");
    //     }
    //
    //     try {
    //         DB::transaction();
    //
    //         $bill->address = $req->address;
    //         $bill->money_ship = $req->shipFee;
    //         $bill->full_name = $req->fullName;
    //         $bill->phone_number = $req->phoneNumber;
    //         $bill->save();
    //         //timeline ??
    //
    //         DB::commit();
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         throw new RestApiException("Cập nhật không thành công");
    //     }
    //
    //
    //     $bill = $this->getBillDetail($bill);
    //
    //     return ApiResponse::responseObject(new BillDetailResource($bill));
    // }

    // public function adminUpdateQuantity(BillRequestBody $req)
    // {
    //     $bill = Bill::find($req->id);
    //     if (!$bill) {
    //         throw new NotFoundException("Không tìm thấy đơn hàng");
    //     }
    //
    //     $billDetail = BillDetails::find($req->billDetailId);
    //     if (!$billDetail) {
    //         throw new RestApiException("Không tìm thấy sản phẩm này trong đơn hàng");
    //     }
    //
    //     $productItem = ProductDetails::find($billDetail->product_details_id);
    //     if (!$productItem) {
    //         throw new RestApiException("Không tìm thấy sản phẩm này");
    //     }
    //
    //     try {
    //         DB::beginTransaction();
    //
    //         $bill->total_money = $req->totalMoney;
    //         $bill->save();
    //
    //         // if ($req->quantity > $productItem->quantity) {
    //         // throw new RestApiException("Sản phẩm đã hết hàng");
    //         // }
    //         // luot su dung voucher, them status hay bo status
    //
    //         $currentQuantity = $billDetail->quantity;
    //         $billDetail->quantity = $req->quantity;
    //         $billDetail->save();
    //
    //         if ($req->quantity > $currentQuantity) {
    //             $productItem->quantity = $productItem->quantity - ($req->quantity - $currentQuantity);
    //             $productItem->save();
    //         }
    //         if ($req->quantity < $currentQuantity) {
    //             $productItem->quantity = $productItem->quantity + ($currentQuantity - $req->quantity);
    //             $productItem->save();
    //         }
    //
    //         //timeline ??
    //
    //         DB::commit();
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         throw new RestApiException("Cập nhật không thành công");
    //     }
    //
    //     // timlines
    //     $bill = $this->getBillDetail($bill);
    //
    //     return ApiResponse::responseObject(new BillDetailResource($bill));
    // }

    public function updateStatusCanceledByAccount(BillRequestBody $req)
    {
        $bill = Bill::where("id", $req->id)->first();

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        try {
            DB::beginTransaction();

            if ($bill->status === OrderStatus::COMPLETED) {
                throw new RestApiException("Đơn hàng đã được giao");
            }

            if ($bill->status === OrderStatus::DELIVERING) {
                throw new RestApiException("Đơn hàng đang được giao");
            }

            if ($bill->status === OrderStatus::CANCELED) {
                $bill = $this->getBillDetail($bill);
                return ApiResponse::responseObject(new BillDetailResource($bill));
            }

            $bill->status = OrderStatus::CANCELED;
            $bill->cancellation_date = now();
            $bill->save();

            // tien nong vnpay the nao ?? hoan tien hay co chinh sach mua hang rieng

            $billHistory = new BillHistory();
            $billHistory->bill_id = $bill->id;
            $billHistory->status_timeline = BillHistoryStatusTimeline::CANCELED;
            $billHistory->action = "Đã hủy đơn";
            $billHistory->note = $req->desc;
            $billHistory->save();

            $billItems = BillDetails::where('bill_id', $bill->id)->get();

            foreach ($billItems as $item) {

                $findProductItem = ProductDetails::find($item->product_details_id);

                if ($findProductItem) {
                    $findProductItem->quantity = $findProductItem->quantity + $item->quantity;
                    $findProductItem->save();
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function updatePaymentMethodByCustomer(BillRequestBody $req)
    {
        $bill = Bill::where("id", $req->id)->first();

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        try {
            DB::beginTransaction();

            $bill->payment_method = TransactionType::CASH;
            $bill->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function updatePaymentMethodByAccount(BillRequestBody $req)
    {
        $bill = Bill::where("id", $req->id)->first();
        // where them customer_id

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        try {
            DB::beginTransaction();

            $bill->payment_method = TransactionType::CASH;
            $bill->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function updateStatusCanceledByCustomer(BillRequestBody $req)
    {
        $bill = Bill::where("id", $req->id)->first();

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        try {
            DB::beginTransaction();

            if ($bill->status === OrderStatus::COMPLETED) {
                throw new RestApiException("Đơn hàng đã được giao");
            }

            if ($bill->status === OrderStatus::DELIVERING) {
                throw new RestApiException("Đơn hàng đang được giao");
            }

            if ($bill->status === OrderStatus::CANCELED) {
                $bill = $this->getBillDetail($bill);
                return ApiResponse::responseObject(new BillDetailResource($bill));
            }

            $bill->status = OrderStatus::CANCELED;
            $bill->cancellation_date = now();
            $bill->save();

            // tien nong vnpay the nao ??
            $billHistory = new BillHistory();
            $billHistory->bill_id = $bill->id;
            $billHistory->status_timeline = BillHistoryStatusTimeline::CANCELED;
            $billHistory->action = "Đã hủy đơn";
            $billHistory->note = $req->desc;
            $billHistory->save();

            $billItems = BillDetails::where('bill_id', $bill->id)->get();

            foreach ($billItems as $item) {

                $findProductItem = ProductDetails::find($item->product_details_id);

                if ($findProductItem) {
                    $findProductItem->quantity = $findProductItem->quantity + $item->quantity;
                    $findProductItem->save();
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new NotFoundException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }

        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function adminUpdateStatus(BillRequestBody $req)
    {
        $bill = Bill::find($req->id);

        if (!$bill) {
            throw new NotFoundException("Không tìm thấy đơn hàng");
        }

        if ($bill->status === OrderStatus::CANCELED) {
            throw new RestApiException("Đơn hàng đã được hủy bỏ từ trước đó");
        }

        try {
            DB::beginTransaction();

            $statusTimeline = $req->status;

            if ($statusTimeline === BillHistoryStatusTimeline::WAITTING_DELIVERY) {
                $billHistory = new BillHistory();
                $billHistory->bill_id = $bill->id;
                $billHistory->status_timeline = $statusTimeline;
                $billHistory->action = $req->actionTimeline['action'];
                $billHistory->note = $req->actionTimeline['note'];
                $billHistory->created_by = $req->createdBy;
                $billHistory->save();
            } else if ($statusTimeline === BillHistoryStatusTimeline::DELYVERING) {
                $findTimeline = BillHistory::where('status_timeline', BillHistoryStatusTimeline::WAITTING_DELIVERY)->where('bill_id', $bill->id)->first();
                $bill->delivery_date = now();
                $bill->save();

                if ($findTimeline) {
                    $billHistory = new BillHistory();
                    $billHistory->bill_id = $bill->id;
                    $billHistory->status_timeline = $statusTimeline;
                    $billHistory->action = $req->actionTimeline['action'];
                    $billHistory->note = $req->actionTimeline['note'];
                    $billHistory->created_by = $req->createdBy;
                    $billHistory->save();
                } else {
                    $created_at = Carbon::now();
                    $billHistory = new BillHistory();
                    $billHistory->bill_id = $bill->id;
                    $billHistory->status_timeline = $statusTimeline;
                    $billHistory->action = $req->actionTimeline['action'];
                    $billHistory->note = $req->actionTimeline['note'];
                    $billHistory->created_at = $created_at;
                    $billHistory->created_by = $req->createdBy;
                    $billHistory->save();

                    $created_atWaitingDelivery = Carbon::parse($created_at)->subSeconds(1);
                    $billHistoryWaitingDelivery = new BillHistory();
                    $billHistoryWaitingDelivery->bill_id = $bill->id;
                    $billHistoryWaitingDelivery->status_timeline = BillHistoryStatusTimeline::WAITTING_DELIVERY;
                    $billHistoryWaitingDelivery->action = "Đang chuẩn bị hàng";
                    $billHistoryWaitingDelivery->note = "Người gửi đang chuẩn bị hàng";
                    $billHistoryWaitingDelivery->created_at = $created_atWaitingDelivery;
                    $billHistoryWaitingDelivery->created_by = $req->createdBy;
                    $billHistoryWaitingDelivery->save();
                }
            } else if ($statusTimeline === BillHistoryStatusTimeline::COMPLETED) {
                $bill->completion_date = now();
                $bill->save();

                $billHistory = new BillHistory();
                $billHistory->bill_id = $bill->id;
                $billHistory->status_timeline = $statusTimeline;
                $billHistory->action = $req->actionTimeline['action'];
                $billHistory->note = $req->actionTimeline['note'];
                $billHistory->created_by = $req->createdBy;
                $billHistory->save();

                if ($bill->payment_method === TransactionType::CASH) {
                    $billPayment = new Transaction();
                    $billPayment->type = TransactionType::CASH;
                    $billPayment->total_money = $req->totalFinal;
                    $billPayment->bill_id = $bill->id;
                    $billPayment->created_by = $req->createdBy;
                    $billPayment->save();
                }
            } else {

                $billHistory = new BillHistory();
                $billHistory->bill_id = $bill->id;
                $billHistory->status_timeline = $statusTimeline;
                $billHistory->action = $req->action;
                $billHistory->note = $req->note;
                $billHistory->created_by = $req->createdBy;
                $billHistory->save();

                $bill->cancellation_date = now();

                $billItems = BillDetails::where('bill_id', $bill->id)->get();

                foreach ($billItems as $item) {

                    $findProductItem = ProductDetails::find($item->product_details_id);

                    if ($findProductItem) {
                        $findProductItem->quantity = $findProductItem->quantity + $item->quantity;
                        $findProductItem->save();
                    }
                }
            }

            $bill->status = $req->status;
            $bill->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }


        $bill = $this->getBillDetail($bill);

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function clientStore(BillRequestBody $req)
    {
        $bill = Bill::query();
        $prefix = 'HD';
        $newBill = new Bill();

        try {
            DB::beginTransaction();

            $newBill->code = CustomCodeHelper::generateCode($bill, $prefix);
            $newBill->status = OrderStatus::PENDING_COMFIRM;
            $newBill->full_name = $req->fullName;
            $newBill->phone_number = $req->phoneNumber;
            $newBill->email = $req->email;
            $newBill->address = $req->address;
            $newBill->money_ship = $req->moneyShip;
            $newBill->discount_amount = $req->discountAmount;
            $newBill->total_money = $req->totalMoney;
            $newBill->note = $req->note;
            $newBill->customer_id = $req->customerId;
            $newBill->voucher_id = $req->voucherId;
            $newBill->payment_method = $req->paymentMethod;
            $newBill->save();

            if ($newBill->voucher_id) {
                $voucher = Voucher::find($newBill->voucher_id);
                $voucher->quantity = $voucher->quantity + 1;
                $voucher->save();
            }

            $billHistory = new BillHistory();
            $billHistory->bill_id = $newBill->id;
            $billHistory->status_timeline = BillHistoryStatusTimeline::CREATED;
            $billHistory->action = "Đặt hàng thành công";
            $billHistory->note = "Khách hàng đặt hàng thành công";
            $billHistory->save();

            $roleAdmin = Role::where('code', ConstantsRole::ADMIN)->first();
            $roleEmp = Role::where('code', ConstantsRole::EMPLOYEE)->first();
            $accountAdmins = Account::whereIn('role_id', [$roleAdmin->id, $roleEmp->id])->get();

            foreach ($accountAdmins as $ac) {
                $notify = new Notification();
                $notify->url = $newBill->id;
                $notify->content = "Đơn hàng mới đang chờ bạn xác nhận";
                $notify->account_id = $ac->id;
                $notify->save();
            }

            $errorQuantity = [];

            if (count($req->cartItems) > 0) {
                foreach ($req->cartItems as $productItem) {

                    $findProductItem = ProductDetails::find($productItem['id']);

                    if ($findProductItem) {
                        $quantityBuy = $productItem['quantity'];
                        $currentQuantity = $findProductItem->quantity;

                        if ($currentQuantity <= 0 || $quantityBuy > $currentQuantity) {
                            $errorQuantity[] = [
                                'id' => $findProductItem->id,
                                'quantity' => $currentQuantity,
                            ];
                        }

                        $billDetail = new BillDetails();
                        $billDetail->bill_id = $newBill->id;
                        $billDetail->quantity = $quantityBuy;
                        $billDetail->product_details_id = $findProductItem->id;
                        $billDetail->price = $productItem['price'];
                        $billDetail->save();

                        $findProductItem->quantity = $findProductItem->quantity - $quantityBuy;
                        $findProductItem->save();
                    }
                }
            }

            if (count($errorQuantity) > 0) {
                throw new RestApiException("Hết hàng hoặc số lượng mua vượt quá số lượng tồn");
            }

            if ($newBill->customer_id !== null) {
                CartDetails::join('carts', 'cart_details.cart_id', '=', 'carts.id')
                    ->where('carts.account_id', $newBill->customer_id)
                    ->delete();
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();

            return ApiResponse::responseErrorObject(ConstantSystem::BAD_REQUEST_CODE, $errorQuantity, $e->getMessage());
        }

        $token = Crypt::encrypt($newBill->code . '|' . $newBill->phone_number);
        $newBill->token = $token;
        $newBill->totalFinal = $req->totalFinal;
        SendEmailPlaceOrderSuccess::dispatch($newBill, $req->totalFinal, $token);

        if ($req->paymentMethod === TransactionType::TRANSFER) {
            return $this->vnpay_payment($newBill);
        }

        return ApiResponse::responseObject(new BillDetailResource($newBill));
    }

    public function getBillDetail($bill)
    {
        $billHistories = BillHistory::select(
            'bill_histories.id',
            'bill_histories.created_at',
            'bill_histories.note',
            'bill_histories.status_timeline',
            'bill_histories.action',
            'accounts.full_name',
            'accounts.code',
            'roles.name as role'
        )
            ->leftJoin('accounts', 'bill_histories.created_by', '=', 'accounts.id')
            ->leftJoin('roles', 'accounts.role_id', '=', 'roles.id')
            ->where('bill_histories.bill_id', $bill->id)
            ->orderBy('bill_histories.created_at', 'asc')
            ->get();
        $billPayment = Transaction::select(
            'transactions.id',
            'transactions.created_at',
            'transactions.total_money',
            'transactions.trading_code',
            'transactions.type',
            'accounts.full_name',
            'accounts.code',
            'roles.name as role'
        )
            ->leftJoin('accounts', 'transactions.created_by', '=', 'accounts.id')
            ->leftJoin('roles', 'accounts.role_id', '=', 'roles.id')
            ->where('bill_id', $bill->id)
            ->first();
        $billItems = BillDetails::getBillItemsByBillId($bill->id);

        if ($bill->customer_id) {
            $account = Account::find($bill->customer_id);

            if ($account) {
                $bill->account = new AccountResource($account);
            }
        }

        $bill->histories = HistoryResource::collection($billHistories);
        $bill->payment = new PaymentResource($billPayment);
        $bill->billItems = $billItems;

        return $bill;
    }

    public function re_vnpay_payment(Request $req)
    {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:3000/vnpay-payment/";
        $vnp_TmnCode = "AUBFF1CW"; //Mã website tại VNPAY
        $vnp_HashSecret = "UZCEDQTUJVMSQTIKPIXPRJGICESTXTUB"; //Chuỗi bí mật

        $vnp_TxnRef = $req->code;
        $vnp_OrderInfo = "Thanh toan don hang " . $req->code;
        $vnp_OrderType = "DKN Shop";
        $vnp_Amount = $req->totalFinal * 100;
        $vnp_Locale = "vn";
        $vnp_BankCode = "NCB";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return ApiResponse::responseObject($vnp_Url);
    }

    public function vnpay_payment($bill)
    {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:3000/vnpay-payment/";
        $vnp_TmnCode = "AUBFF1CW"; //Mã website tại VNPAY
        $vnp_HashSecret = "UZCEDQTUJVMSQTIKPIXPRJGICESTXTUB"; //Chuỗi bí mật

        $vnp_TxnRef = $bill->code;
        $vnp_OrderInfo = "Thanh toan don hang " . $bill->code;
        $vnp_OrderType = "DKN Shop";
        $vnp_Amount = $bill->totalFinal * 100;
        $vnp_Locale = "vn";
        $vnp_BankCode = "NCB";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return ApiResponse::responseObject($vnp_Url);
    }

    public function processPaymentBill(Request $request)
    {
        $vnp_HashSecret = "UZCEDQTUJVMSQTIKPIXPRJGICESTXTUB"; //Chuỗi bí mật
        $inputData = array();
        $returnData = array();

        foreach ($_GET as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $vnpTranId = $inputData['vnp_TransactionNo']; //Mã giao dịch tại VNPAY
        $vnp_Amount = $inputData['vnp_Amount'] / 100; // Số tiền thanh toán VNPAY phản hồi

        $orderId = $inputData['vnp_TxnRef'];

        try {
            DB::beginTransaction();
            //Check Orderid
            //Kiểm tra checksum của dữ liệu
            if ($secureHash == $vnp_SecureHash) {
                //Lấy thông tin đơn hàng lưu trong Database và kiểm tra trạng thái của đơn hàng, mã đơn hàng là: $orderId
                $findBill = Bill::where("code", $orderId)->first();

                if ($findBill) {

                    $total = $findBill->total_money ?? 0;
                    $ship = $findBill->money_ship ?? 0;
                    $discount = $findBill->discount_amount ?? 0;
                    $totalFinal = $total + $ship - $discount;

                    if ($totalFinal == $vnp_Amount) { // trong truong hop don hang thay doi tong tien => case nay kho xay ra voi du an nay
                        //Kiểm tra số tiền thanh toán của giao dịch: giả sử số tiền  kiểm tra là đúng. //$order["Amount"] == $vnp_Amount

                        $billPayment = Transaction::where('bill_id', $findBill->id)->first();
                        if (!$billPayment) {
                            //Việc kiểm tra trạng thái của đơn hàng giúp hệ thống không xử lý trùng lặp, xử lý nhiều lần một giao dịch

                            if ($inputData['vnp_ResponseCode'] == '00' || $inputData['vnp_TransactionStatus'] == '00') {
                                //Cài đặt Code cập nhật kết quả thanh toán, tình trạng đơn hàng vào DB
                                $newPay = new Transaction();
                                $newPay->bill_id = $findBill->id;
                                $newPay->total_money = $vnp_Amount;
                                $newPay->type = TransactionType::TRANSFER;
                                $newPay->trading_code = $vnpTranId;
                                $newPay->save();
                                //Trả kết quả về cho VNPAY: Website/APP TMĐT ghi nhận yêu cầu thành công
                                $token = Crypt::encrypt($findBill->code . '|' . $findBill->phone_number);
                                $findBill->token = $token;
                                $returnData['message'] = 'Thanh toán thành công';
                                $returnData['status'] = '00';
                                $returnData['bill'] = $findBill;
                            } else {
                                // $returnData['RspCode'] = '02';
                                // $returnData['Message'] = 'Order already payment';
                                throw new RestApiException('Thanh toán thất bại');
                            }
                        } else {
                            throw new NotFoundException('Đơn hàng đã thanh toán');
                        }
                    } else {
                        // $returnData['RspCode'] = '04';
                        // $returnData['Message'] = 'invalid amount';
                        throw new RestApiException('Số tiền thanh toán không hợp lệ');
                    }
                } else {
                    // $returnData['rspCode'] = '01';
                    // $returnData['message'] = 'Order not found';
                    throw new NotFoundException('Không tìm thấy đơn hàng'); // case nay kho xay ra
                }
            } else {
                // $returnData['rspCode'] = 97;
                // $returnData['message'] = ;
                // throw new VNPayException('Invalid signature', 97);
                throw new NotFoundException('Invalid signature');
            }
            DB::commit();
        } catch (NotFoundException $e) {
            DB::rollback();
            throw new NotFoundException($e->getMessage());
        } catch (RestApiException $e) {
            DB::rollback();
            $token = Crypt::encrypt($findBill->code . '|' . $findBill->phone_number);
            $findBill->token = $token;
            return ApiResponse::responseErrorObject(ConstantSystem::BAD_REQUEST_CODE, $findBill, $e->getMessage());
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
        }
        return ApiResponse::responseObject($returnData);
    }

    public function revenueStatistics(Request $req)
    {
        $startDate = $req->startDate;
        $endDate = $req->endDate;

        $totalBill = Bill::join('bill_details', 'bills.id', '=', 'bill_details.bill_id')
            ->whereBetween('bills.created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->where('bills.status', OrderStatus::COMPLETED)
            ->selectRaw('SUM(bills.total_money - COALESCE(bills.discount_amount, 0)) as totalMoney')
            ->selectRaw('COUNT(bills.id) as totalOrder')
            ->selectRaw('SUM(bill_details.quantity) as totalSold')
            ->first();

        $totalStatus = Bill::whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
            ->whereBetween('created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->selectRaw('COUNT(*) as count, status')
            ->groupBy('status')
            ->get();
        $completedCount = $totalStatus->where('status', 'completed')->first()->count ?? 0;
        $canceledCount = $totalStatus->where('status', 'canceled')->first()->count ?? 0;
        $totalCountBillCompletedAndCanceled = $completedCount + $canceledCount;

        $totalStatusPercent = DB::table('bills')
            ->whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
            ->whereBetween('created_at', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->selectRaw('
        status,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (
            SELECT COUNT(*)
            FROM bills
            WHERE status IN (\'completed\', \'canceled\')
            AND created_at BETWEEN ? AND ?
        ), 2) AS percentage
    ', [
                Carbon::createFromFormat('d-m-Y', $startDate)->startOfDay(),
                Carbon::createFromFormat('d-m-Y', $endDate)->endOfDay()
            ])
            ->groupBy('status')
            ->get();
        //     $totalStatusPercent = DB::table('bills')
        //         ->whereIn('status', [OrderStatus::COMPLETED, OrderStatus::CANCELED])
        //         ->selectRaw('
        //     status,
        //     COUNT(*) AS count,
        //     ROUND(COUNT(*) * 100.0 / (
        //         SELECT COUNT(*)
        //         FROM bills
        //         WHERE status IN (\'completed\', \'canceled\')
        //     ), 2) AS percentage
        // ')
        //         ->groupBy('status')
        //         ->get();

        $query = "
            WITH PRODUCT_DEFAULT_IMAGE AS (
              SELECT PRODUCT_ID, path_url, PRODUCT_COLOR_ID
              FROM IMAGES
              WHERE IS_DEFAULT = 1
            )
            SELECT PD.sku as code, P.name, C.name as colorName, PDI.path_url as pathUrl, sum(BD.quantity) as totalSold
            FROM BILL_DETAILS BD
            JOIN BILLS B ON BD.BILL_ID = B.ID
            JOIN PRODUCT_DETAILS PD ON BD.PRODUCT_DETAILS_ID = PD.ID
            JOIN COLORS C ON PD.COLOR_ID = C.ID
            JOIN PRODUCTS P ON PD.PRODUCT_ID = P.ID
            JOIN PRODUCT_DEFAULT_IMAGE PDI ON PD.PRODUCT_ID = PDI.PRODUCT_ID
            AND PD.COLOR_ID = PDI.PRODUCT_COLOR_ID
            WHERE B.status = 'completed'
            group by pd.sku, p.name, PDI.path_url, c.name
            order by sum(BD.quantity) desc
            limit 5;
        ";
        $products = DB::select($query);

        $revenueByMonth = DB::table('bills as b')
            ->join('bill_details as bd', 'b.id', '=', 'bd.bill_id')
            // ->whereYear('b.created_at', 2024)
            ->where('b.status', 'completed')
            ->selectRaw('MONTH(b.created_at) as month, YEAR(b.created_at) as year, SUM((bd.quantity * bd.price) - COALESCE(b.discount_amount, 0)) as totalRevenue')
            ->groupBy('month', 'year')
            ->orderBy('month')
            ->get();

        $response['totalBill'] = $totalBill;
        $response['totalCount'] = $totalCountBillCompletedAndCanceled;
        $response['totalPercent'] = $totalStatusPercent;
        $response['products'] = $products;
        $response['revenueByMonth'] = $revenueByMonth;

        return ApiResponse::responseObject($response);
    }
}
