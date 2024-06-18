<?php

namespace App\Http\Resources\Promotions;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionResource extends JsonResource
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
            'name' => $this->name,
            'value' => $this->value,
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
            'name',
            'value',
            'status',
            'created_at',
        ];
    }
}
