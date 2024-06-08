<?php

namespace App\Http\Resources\Accounts;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
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
            'birthDate' => $this->birth_date,
            'gender' =>  $this->gender,
            'status' => $this->status,
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
            'birth_date',
            'gender',
            'status',
            'created_at',
        ];
    }
}
