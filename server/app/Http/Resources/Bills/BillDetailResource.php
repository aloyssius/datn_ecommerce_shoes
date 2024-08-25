<?php

namespace App\Http\Resources\Bills;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'fullName' => $this->full_name,
            'phoneNumber' => $this->phone_number,
            'email' => $this->email,
            'address' => $this->address,
            'shipFee' => $this->money_ship,
            'discount' => $this->discount_amount,
            'totalMoney' => $this->total_money,
            'status' => $this->status,
            'note' => $this->note,
            'createdAt' => Carbon::parse($this->created_at)->format('H:i:s d/m/Y'),
            'comfirmationDate' => $this->confirmation_date,
            'cancellationDate' => $this->cancellation_date,
            'deliveryDate' => $this->delivery_date,
            'completionDate' => $this->completion_date,
            'customerId' => $this->customer_id,
            'histories' => $this->histories,
            'payment' => $this->payment,
            'billItems' => $this->billItems,
            'totalFinal' => $this->totalFinal,
            'paymentMethod' => $this->payment_method,
            'token' => $this->token,
            'account' => $this->account,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
    public static function fields()
    {
        return [
            'id',
            'code',
            'full_name',
            'phone_number',
            'email',
            'address',
            'money_ship',
            'discount_amount',
            'total_money',
            'status',
            'note',
            'created_at',
            'confirmation_date',
            'delivery_date',
            'completion_date',
        ];
    }
}
