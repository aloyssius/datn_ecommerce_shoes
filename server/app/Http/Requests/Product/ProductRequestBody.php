<?php

namespace App\Http\Requests\Product;

use App\Constants\ProductStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class ProductRequestBody extends BaseRequest
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

        $rules = [];

        if ($this->route()->getActionMethod() === "updateStatus") {
            $rules['statusProduct'] = [
                Rule::in(ProductStatus::toArray()), 'required'
            ];
        }

        if ($this->route()->getActionMethod() === "store") {
            $rules['status'] = [
                'name' => 'required|string|max:100|unique:products',
                'code' => 'required|string|max:20|unique:products',
                'brandId' => 'required|string',
                'status' => [
                    Rule::in(ProductStatus::toArray()), 'required'
                ],
                'categoryIds' => 'required|array|min:1'
            ];
        }

        if ($this->route()->getActionMethod() === "update") {
            $rules['status'] = [
                'name' => 'required|string|max:100',
                'code' => 'required|string|max:20',
                'brandId' => 'required|string',
                'status' => [
                    Rule::in(ProductStatus::toArray()), 'required'
                ],
                'categoryIds' => 'required|array|min:1'
            ];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'status.in' => 'Trạng thái sản phẩm không hợp lệ.',
            'name.required' => 'Tên sản phẩm không được bỏ trống.',
            'name.max' => 'Tên sản phẩm được phép tối đa 100 ký tự.',
            'name.unique' => 'Tên sản phẩm đã tồn tại.',
            'code.required' => 'Mã sản phẩm không được bỏ trống.',
            'code.max' => 'Mã sản phẩm được phép tối đa 20 ký tự.',
            'code.unique' => 'Mã sản phẩm đã tồn tại.',
            'brandId.required' => 'Thương hiệu sản phẩm không được bỏ trống.',
            'categoryIds.min' => 'Danh mục sản phẩm phải có ít nhất là 1.',
        ];
    }
}
