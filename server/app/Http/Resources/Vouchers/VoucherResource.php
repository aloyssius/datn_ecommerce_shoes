<?php

namespace App\Http\Resources\Vouchers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
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
            'name' => $this->name,
            'value' => $this->formatAmount($this->value), // Định dạng số tiền
            'typeDiscount' => $this->type_discount,
            'maxDiscountValue' => $this->formatAmount($this->max_discount_value), // Định dạng số tiền
            'minOrderValue' => $this->formatAmount($this->min_order_value), // Định dạng số tiền
            'quantity' => $this->quantity,
            'status' => $this->status,
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
        ];
    }

    public static function fields()
    {
        return [
            'id',
            'code',
            'type_discount',
            'max_discount_value',
            'min_order_value',
            'name',
            'value',
            'quantity',
            'status',
            'start_time',
            'end_time',
        ];
    }

    private function formatAmount($amount)
    {
        return number_format($amount, 0, ',', '.');
    }
}
