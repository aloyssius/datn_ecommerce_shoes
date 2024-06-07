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
            'value' => $this->value,
            'type' => $this->type,
            'typeDiscount' => $this->type_discount,
            'maxDiscountValue' => $this->max_discount_value,
            'minOrderValue' => $this->min_order_value,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'startTime' => $this->start_time,
            'endTime' => $this->end_time,
        ];
    }
}
