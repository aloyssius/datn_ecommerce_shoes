<?php

namespace App\Http\Requests;

use App\Constants\CommonStatus;
use App\Constants\DiscountStatus;
use Illuminate\Validation\Rule;

class PromotionRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'search' => 'string|nullable',
            'status' => [
                Rule::in(DiscountStatus::toArray()), 'nullable'
            ],
        ]);
    }

    public function messages()
    {

        return array_merge(parent::messages(), [
            'status.in' => 'Trạng thái khuyến mãi không hợp lệ.',
        ]);
    }
}
