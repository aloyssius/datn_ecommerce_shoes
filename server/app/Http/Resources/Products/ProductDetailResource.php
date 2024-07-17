<?php

namespace App\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
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
            'brandId' => $this->brand_id,
            'description' => $this->description,
            'status' => $this->status,
            'categories' => $this->categories,
            'colors' => $this->colors,
            'sizes' => $this->sizes,
            'variants' => $this->variants,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
