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
            'sku' => $this->sku,
            'name' => $this->name,
            'createdAt' => $this->created_at,
            'price' => $this->price,
            'status' => $this->status,
            'colorName' => $this->colorName,
            'pathUrl' => $this->PATH_URL,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
