<?php

namespace App\Http\Requests\Address;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class AddressRequestBody extends BaseRequest
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
        return [
            // 'fullName' => 'required|string|max:50',
            // 'phoneNumber' => 'required|string|max:15|min:10',
            // 'address' => 'required',
            // 'provinceId' => 'required',
            // 'districtId' => 'required',
            // 'wardCode' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'fullName.required' => 'Họ và tên không được bỏ trống.',
            'phoneNumber.required' => 'SĐT không được bỏ trống.',
            'address.required' => 'Địa chỉ không được bỏ trống.',
            'provinceId.required' => 'Không được bỏ trống Tỉnh/Thành.',
            'districtId.required' => 'Không được bỏ trống Quận/Huyện.',
            'wardCode.required' => 'Không được bỏ trống Xã/Phường.',

            'fullName.string' => 'Họ và tên phải là chữ.',
            'phoneNumber.string' => 'SĐT phải là chữ.',

            'fullName.max' => 'Họ và tên chỉ được phép tối đa 50 ký tự.',
            'phoneNumber.max' => 'SĐT chỉ được phép tối đa 15 ký tự.',
            'phoneNumber.min' => 'SĐT tối thiểu phải là 10 ký tự.',
        ];
    }
}
