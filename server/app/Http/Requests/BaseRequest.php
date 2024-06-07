<?php

namespace App\Http\Requests;

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
        $currentPage = $this->input('currentPage', 1);
        $pageSize = $this->input('pageSize', 10);

        $this->merge([
            'currentPage' => $currentPage,
            'pageSize' => $pageSize,
        ]);

        return [
            'currentPage' => 'integer|min:1',
            'pageSize' => 'integer|min:1|max:25',
        ];
    }
    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Lỗi xác thực',
            'data'      => $validator->errors()
        ]));
    }


    public function messages()
    {
        return [
            'currentPage.integer' => 'Trang hiện tại phải là số.',
            'currentPage.min' => 'Trang hiện tại phải có ít nhất là 1.',
            'pageSize.integer' => 'Kích thước trang phải là số nguyên.',
            'pageSize.min' => 'Kích thước trang phải ít nhất là 1.',
            'pageSize.max' => 'Kích thước trang không được lớn hơn 25.',
        ];
    }
}
