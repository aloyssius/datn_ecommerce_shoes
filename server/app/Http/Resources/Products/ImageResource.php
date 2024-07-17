<?php

namespace App\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource
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
            'path' => $this->path_url,
            'publicId' => $this->public_id,
            'isDefault' => $this->is_default ? true : false,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
