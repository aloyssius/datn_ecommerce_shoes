<?php

namespace App\Http\Requests\Account;

use App\Constants\AccountGender;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class AccountRequestBody extends BaseRequest
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
            'fullName' => 'required|string|max:50',
            'email' => 'required|string|max:254',
            'phoneNumber' => 'required|string|max:15|min:10',
            'gender' => 'required|boolean',
            'birthDate' => 'date_format:d-m-Y|nullable',
        ];
    }

    public function messages()
    {
        return [
            'fullName.required' => 'Họ và tên không được bỏ trống.',
            'email.required' => 'Email không được bỏ trống.',
            'phoneNumber.required' => 'SĐT không được bỏ trống.',
            'gender.required' => 'Giới tính không được bỏ trống.',

            'fullName.string' => 'Họ và tên không hợp lệ.',
            'email.string' => 'Email không không hợp lệ.',
            'phoneNumber.string' => 'SĐT không hợp lệ.',
            'gender.boolean' => 'Giới tính không hợp lệ.',
            'birthDate.date_format' => 'Định dạng ngày sinh không hợp lệ.',

            'fullName.max' => 'Họ và tên chỉ được phép tối đa 50 ký tự.',
            'email.max' => 'Email chỉ được phép tối đa 254 ký tự.',
            'phoneNumber.max' => 'SĐT chỉ được phép tối đa 15 ký tự.',
            'phoneNumber.min' => 'SĐT tối thiểu phải là 10 ký tự.',

            // 'email.unique' => 'Email này đã tồn tại.',
            // 'phoneNumber.unique' => 'SĐT này đã tồn tại.',
        ];
    }
}
