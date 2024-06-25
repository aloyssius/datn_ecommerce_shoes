<?php

namespace App\Http\Requests;

use App\Constants\ConstantSystem;
use App\Helpers\ApiResponse;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;

class BaseRequest extends FormRequest
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
        $this->merge($this->defaultRequest());

        return [
            'currentPage' => 'integer|min:1',
            'pageSize' => 'integer|min:10|max:25',
        ];
    }

    protected function defaultRequest()
    {
        $currentPage = $this->input('currentPage', ConstantSystem::CURRENT_PAGE);
        $pageSize = $this->input('pageSize', ConstantSystem::PAGE_SIZE);

        return [
            'currentPage' => $currentPage,
            'pageSize' => $pageSize,
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(ApiResponse::responseError(ConstantSystem::VALIDATION_ERROR_CODE, ConstantSystem::VALIDATION_ERROR, $validator->errors()->first()));
    }

    public function messages()
    {
        return [
            'currentPage.integer' => 'Trang hiện tại phải là số.',
            'currentPage.min' => 'Trang hiện tại phải có ít nhất là 1.',
            'pageSize.integer' => 'Kích thước trang phải là số nguyên.',
            'pageSize.min' => 'Kích thước trang phải ít nhất là 10.',
            'pageSize.max' => 'Kích thước trang không được lớn hơn 25.',
        ];
    }
}
