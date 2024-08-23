<?php

namespace App\Http\Resources\Bills;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HistoryResource extends JsonResource
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
            'createdAt' => $this->created_at,
            'createdBy' => $this->created_by,
            'note' => $this->note,
            'action' => $this->action,
            'status' => $this->status_timeline,
        ];
    }
    /**
     * Get the fields that should be selected from the database.
     *
     * @return array
     */
}
