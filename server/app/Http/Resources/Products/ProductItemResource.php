<?php

namespace App\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductItemResource extends JsonResource
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
            'price' => $this->price,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'colorId' => $this->color_id,
            'sizeId' => $this->size_id,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
