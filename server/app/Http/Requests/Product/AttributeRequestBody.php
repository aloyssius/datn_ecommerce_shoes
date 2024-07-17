<?php

namespace App\Http\Requests\Product;

use App\Constants\CommonStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class AttributeRequestBody extends BaseRequest
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

        if ($this->route()->getActionMethod() === "storeCategory") {
            $rules['name'] = 'string|required|max:50|unique:categories';
            $rules['status'] = [
                Rule::in(CommonStatus::toArray()), 'required'
            ];
        }

        if ($this->route()->getActionMethod() === "storeSize") {
            $rules['name'] = 'string|required|max:50|unique:sizes';
            $rules['status'] = [
                Rule::in(CommonStatus::toArray()), 'required'
            ];
        }
        if ($this->route()->getActionMethod() === "storeBrand") {
            $rules['name'] = 'string|required|max:50|unique:brands';
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
            $rules['name'] = 'string|required|max:50';
        }

        return $rules;
    }

    private function getMessageUniqueStore()
    {
        switch ($this->route()->getActionMethod()) {
            case 'storeSize':
                return "Tên kích cỡ đã tồn tại";
                break;
            case 'storeCategory':
                return "Tên danh mục đã tồn tại";
                break;
            default:
                return "Tên thương hiệu đã tồn tại";
                break;
        }
    }

    public function messages()
    {
        return [
            'status.in' => 'Trạng thái không hợp lệ.',
            'id.required' => 'Id không được bỏ trống.',
            'name.required' => 'Tên không được bỏ trống.',
            'name.max' => 'Tên được phép tối đa 50 ký tự.',
            'name.unique' => $this->getMessageUniqueStore(),
        ];
    }
}
