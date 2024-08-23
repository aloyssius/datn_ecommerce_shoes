<?php

namespace App\Http\Controllers\Api\Bills;

use App\Constants\BillHistoryStatusTimeline;
use App\Constants\CommonStatus;
use App\Constants\ConstantSystem;
use App\Constants\OrderStatus;
use App\Constants\Role;
use App\Constants\TransactionType;
use App\Exceptions\RestApiException;
use App\Exceptions\RestApiObjectException;
use App\Helpers\ApiResponse;
use App\Helpers\ConvertHelper;
use App\Helpers\CustomCodeHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Bill\BillRequest;
use App\Http\Requests\Bill\BillRequestBody;
use App\Http\Resources\Accounts\AccountResource;
use App\Http\Resources\Bills\BillDetailResource;
use App\Http\Resources\Bills\BillResource;
use App\Http\Resources\Bills\HistoryResource;
use App\Http\Resources\Bills\PaymentResource;
use App\Models\Account;
use App\Models\Bill;
use App\Models\BillDetails;
use App\Models\BillHistory;
use App\Models\ProductDetails;
use App\Models\Role as ModelsRole;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BillController extends Controller
{
    public function index(BillRequest $req)
    {

        $bills = Bill::select('bills.id', 'bills.code', 'bills.full_name', 'bills.phone_number', 'bills.total_money', 'bills.status', 'bills.created_at', 'transactions.total_money as totalPayment')
            ->leftJoin('transactions', 'transactions.bill_id', '=', 'bills.id');

        if ($req->filled('search')) {
            $search = $req->search;
            $searchFields = ['code', 'full_name', 'phone_number'];
            QueryHelper::buildQuerySearchContains($bills, $search, $searchFields);
        }

        if ($req->filled('status')) {
            QueryHelper::buildQueryEquals($bills, 'status', $req->status);
        }

        $bills->when($req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
            $startDate = Carbon::parse($req->startDate)->startOfDay();
            $endDate = Carbon::parse($req->endDate)->endOfDay();
            return $query->whereBetween('created_at', [$startDate, $endDate]);
        })
            ->when($req->filled('startDate') && !$req->filled('endDate'), function ($query) use ($req) {
                $startDate = Carbon::parse($req->startDate)->startOfDay();
                $query->where('created_at', '>=', $startDate);
            })
            ->when(!$req->filled('startDate') && $req->filled('endDate'), function ($query) use ($req) {
                $endDate = Carbon::parse($req->endDate)->endOfDay();
                $query->where('created_at', '<=', $endDate);
            });

        $statusCounts = Bill::select(DB::raw('count(status) as count, status'))
            ->groupBy('status')
            ->get();

        QueryHelper::buildOrderBy($bills, 'created_at', 'desc');
        $bills = QueryHelper::buildPagination($bills, $req);

        return ApiResponse::responsePage(BillResource::collection($bills), $statusCounts);
    }

    public function showBillsByAccount($accountId)
    {
        $bills = Bill::where("customer_id", $accountId)->get();

        return ApiResponse::responseObject(BillResource::collection($bills));
    }

    public function show($id)
    {
        $bill = Bill::find($id);

        if (!$bill) {
            throw new RestApiException("Không tìm thấy đơn hàng");
        }

        $billHistories = BillHistory::where('bill_id', $bill->id)->orderBy('created_at', 'asc')->get();
        $billPayment = Transaction::where('bill_id', $bill->id)->first();
        $billItems = BillDetails::getBillItemsByBillId($id);

        $bill->histories = HistoryResource::collection($billHistories);
        $bill->payment = new PaymentResource($billPayment);
        $bill->billItems = $billItems;

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function updateStatus(BillRequestBody $req)
    {
        $bill = Bill::find($req->id);

        if (!$bill) {
            throw new RestApiException("Không tìm thấy đơn hàng");
        }

        try {
            DB::beginTransaction();

            $bill->status = $req->status;
            $bill->save();

            $statusTimeline = $bill->status === OrderStatus::PENDING_COMFIRM ? BillHistoryStatusTimeline::CREATED : $bill->status;

            if ($statusTimeline !== BillHistoryStatusTimeline::CREATED) {
                if ($statusTimeline === BillHistoryStatusTimeline::WAITTING_DELIVERY) {
                    $findTimeline = BillHistory::where('status_timeline', $statusTimeline)->where('bill_id', $bill->id)->first();

                    if (!$findTimeline) {
                        $billHistory = new BillHistory();
                        $billHistory->bill_id = $bill->id;
                        $billHistory->status_timeline = $statusTimeline;
                        $billHistory->action = $req->actionTimeline['action'];
                        $billHistory->note = $req->actionTimeline['note'];
                        $billHistory->save();
                    }
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
                        $billHistory->save();
                    } else {
                        $created_at = Carbon::now();
                        $billHistory = new BillHistory();
                        $billHistory->bill_id = $bill->id;
                        $billHistory->status_timeline = $statusTimeline;
                        $billHistory->action = $req->actionTimeline['action'];
                        $billHistory->note = $req->actionTimeline['note'];
                        $billHistory->created_at = $created_at;
                        $billHistory->save();

                        $created_atWaitingDelivery = Carbon::parse($created_at)->subSeconds(1);
                        $billHistoryWaitingDelivery = new BillHistory();
                        $billHistoryWaitingDelivery->bill_id = $bill->id;
                        $billHistoryWaitingDelivery->status_timeline = BillHistoryStatusTimeline::WAITTING_DELIVERY;
                        $billHistoryWaitingDelivery->action = "Đang chuẩn bị hàng";
                        $billHistoryWaitingDelivery->note = "Người gửi đang chuẩn bị hàng";
                        $billHistoryWaitingDelivery->created_at = $created_atWaitingDelivery;
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
                    $billHistory->save();

                    $billPayment = new Transaction();
                    $billPayment->type = TransactionType::CASH;
                    $billPayment->total_money = $req->totalFinal;
                    $billPayment->bill_id = $bill->id;
                    $billPayment->save();
                } else {
                    $billHistory = new BillHistory();
                    $billHistory->bill_id = $bill->id;
                    $billHistory->status_timeline = $statusTimeline;
                    $billHistory->action = $req->actionTimeline['action'];
                    $billHistory->note = $req->actionTimeline['note'];
                    $billHistory->save();
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            throw new RestApiException($e->getMessage());
            // throw new RestApiException("Thêm sản phẩm vào giỏ hàng không thành công");
        }


        $billPayment = Transaction::where('bill_id', $bill->id)->first();
        $billHistories = BillHistory::where('bill_id', $bill->id)->orderBy('created_at', 'asc')->get();
        $billItems = BillDetails::getBillItemsByBillId($bill->id);

        $bill->payment = new PaymentResource($billPayment);
        $bill->histories = HistoryResource::collection($billHistories);
        $bill->billItems = $billItems;

        return ApiResponse::responseObject(new BillDetailResource($bill));
    }

    public function store(BillRequestBody $req)
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
            $newBill->save();

            $billHistory = new BillHistory();
            $billHistory->bill_id = $newBill->id;
            $billHistory->status_timeline = BillHistoryStatusTimeline::CREATED;
            $billHistory->action = "Đặt hàng thành công";
            $billHistory->note = "Đơn hàng đã được đặt";
            $billHistory->save();

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
                throw new RestApiException("Có lỗi xảy ra");
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();

            return ApiResponse::responseErrorObject(ConstantSystem::BAD_REQUEST_CODE, $errorQuantity, 'Có lỗi xảy ra');
        }


        return ApiResponse::responseObject(new BillDetailResource($newBill));
    }
}
