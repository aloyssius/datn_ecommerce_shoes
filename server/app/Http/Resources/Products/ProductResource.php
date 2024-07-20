<?php

namespace App\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'imageUrl' => $this->imageUrl,
            'brand' => $this->brand,
            'createdAt' => $this->created_at,
            'totalQuantity' => $this->totalQuantity,
            'stockStatus' => $this->stockStatus,
            'status' => $this->status,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
