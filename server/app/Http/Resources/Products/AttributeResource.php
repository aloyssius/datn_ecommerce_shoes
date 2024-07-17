<?php

namespace App\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
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
            'countProduct' => $this->countProduct,
            'status' => $this->status,
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
            'name',
            'status',
        ];
    }
}
