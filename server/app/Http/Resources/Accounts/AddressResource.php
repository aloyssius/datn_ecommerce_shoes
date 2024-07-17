<?php

namespace App\Http\Resources\Accounts;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
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
                'fullName' => $this->full_name,
                'phoneNumber' => $this->phone_number,
                'address' => $this->address,
                'provinceId' => $this->province_id,
                'districtId' => $this->district_id,
                'wardCode' => $this->ward_code,
                'isDefault' => $this->is_default,
                'accountId' => $this->account_id,

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
            'full_name',
            'phone_number',
            'address',
            'province_id',
            'district_id',
            'ward_code',
            'is_default',
            'account_id',
        ];
    }
}
