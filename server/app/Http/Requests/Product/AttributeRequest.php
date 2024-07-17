<?php

namespace App\Http\Requests\Product;

use App\Constants\CommonStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class AttributeRequest extends BaseRequest
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
            'filterStatus' => [
                Rule::in(CommonStatus::toArray()), 'nullable'
            ],
        ]);
    }



    public function messages()
    {
        return array_merge(parent::messages(), [
            'filterStatus.in' => 'Trạng thái không hợp lệ.',
        ]);
    }
}
