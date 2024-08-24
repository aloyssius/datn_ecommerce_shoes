<?php

namespace App\Http\Resources\Bills;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'createdAt' => $this->created_at,
            'createdBy' => $this->full_name,
            'accountCode' => $this->code,
            'accountRole' => $this->role,
            'type' => $this->type,
            'totalMoney' => $this->total_money,
            'tradingCode' => $this->trading_code,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
