<?php

namespace App\Http\Resources\Bills;

use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillResource extends JsonResource
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
            'totalMoney' => $this->total_money,
            'status' => $this->status,
            'totalPayment' => floatval($this->totalPayment),
            'createdAt' => $this->created_at,
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
            'total_money',
            'status',
            'created_at',
        ];
    }
}
