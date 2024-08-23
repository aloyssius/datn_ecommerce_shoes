<?php

namespace App\Http\Requests\Voucher;

use App\Constants\AccountGender;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class VoucherRequestBody extends BaseRequest
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
            'code' => 'required|max:15',
            'value' => 'required',
            'minOrderValue' => 'required|max:9',
            // 'startTime' => 'required|date_format:d-m-Y H:i|after_or_equal:now',
            // 'endTime' => 'required|date_format:d-m-Y H:i|after:startTime',
        ];
    }

    public function messages()
    {
        return [
            'code.required' => 'Không được bỏ trống.',
            'value.required' => 'Không được bỏ trống.',
            'minOrderValue.required' => 'Không được bỏ trống.',
            'startTime.required' => 'Không được bỏ trống.',
            'endTime.required' => 'Không được bỏ trống.',

            'code.max' => 'Chỉ được phép nhập tối đa 15 ký tự.',
            // 'startTime.after_or_equal' => 'Thời gian bắt đầu phải lớn hơn hoặc bằng thời gian hiện tại.',
            // 'endTime.after' => 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.',

            // 'email.string' => 'Email không phải là chữ.',
            // 'phoneNumber.string' => 'SĐT phải là chữ.',
            // 'gender.in' => 'Giới tính không hợp lệ.',
            // 'birthDate.date_format' => 'Định dạng ngày sinh không hợp lệ.',

            // 'fullName.max' => 'Họ và tên chỉ được phép tối đa 50 ký tự.',
            // 'email.max' => 'Email chỉ được phép tối đa 254 ký tự.',
            // 'phoneNumber.max' => 'SĐT chỉ được phép tối đa 15 ký tự.',
            // 'phoneNumber.min' => 'SĐT tối thiểu phải là 10 ký tự.',

            // 'email.unique' => 'Email này đã tồn tại.',
            // 'phoneNumber.unique' => 'SĐT này đã tồn tại.',
        ];
    }
}
