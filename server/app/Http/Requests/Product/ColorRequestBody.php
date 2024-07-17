<?php

namespace App\Http\Requests\Product;

use App\Constants\CommonStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class ColorRequestBody extends BaseRequest
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

        if ($this->isMethod("post")) {
            $rules['code'] = 'string|required|unique:colors';
            $rules['name'] = 'string|required|max:50';
            $rules['status'] = [
                Rule::in(CommonStatus::toArray()), 'required'
            ];
        }

        if ($this->route()->getActionMethod() === "updateStatus") {
            $rules['id'] = 'string|required';
            $rules['status'] = [
                Rule::in(CommonStatus::toArray()), 'required'
            ];
        }

        if ($this->route()->getActionMethod() === "update") {
            $rules['id'] = 'string|required';
            $rules['code'] = 'string|required';
            $rules['name'] = 'string|required|max:50';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'status.in' => 'Trạng thái màu sắc không hợp lệ.',
            'id.required' => 'Id màu sắc không được bỏ trống.',
            'code.required' => 'Mã màu sắc không được bỏ trống.',
            'name.required' => 'Tên màu sắc không được bỏ trống.',
            'name.max' => 'Tên màu chỉ được phép tối đa 50 ký tự.',
            'code.unique' => 'Mã màu sắc này đã tồn tại.',
        ];
    }
}
