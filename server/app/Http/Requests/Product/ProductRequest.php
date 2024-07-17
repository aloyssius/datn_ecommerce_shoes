<?php

namespace App\Http\Requests\Product;

use App\Constants\ProductStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends BaseRequest
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
                Rule::in(ProductStatus::toArray()), 'nullable'
            ],
        ]);
    }



    public function messages()
    {
        return array_merge(parent::messages(), [
            'status.in' => 'Trạng thái sản phẩm không hợp lệ.',
        ]);
    }
}
