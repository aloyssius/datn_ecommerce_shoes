<?php

namespace App\Http\Requests\Voucher;

use App\Constants\VoucherStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;
use App\Constants\VoucherType;

class VoucherRequest extends BaseRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // public function rules(): array
    // {
    //     $this->merge($this->defaultRequest());

    //     return [
    //         'currentPage' => 'integer|min:1',
    //         'pageSize' => 'integer|min:10|max:25',
    //     ];
    // }

    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'search' => 'string|nullable',
            // 'status' => [
            //     Rule::in(VoucherStatus::toArray()), 'nullable'
            // ],
            'type' => [
                Rule::in(VoucherType::toArray()), 'nullable'
            ],
            'startTime' => 'date|date_format:d-m-Y|nullable',
            'endTime' => 'date|date_format:d-m-Y|after_or_equal:startTime|nullable',
        ]);
    }

    // public function messages()
    // {

    //     return array_merge(parent::messages(), []);
    // }

    public function messages()
    {
        return array_merge(parent::messages(), [
            // 'status.in' => 'Trạng thái voucher không hợp lệ.',
            'startTime.date' => 'Ngày bắt đầu không hợp lệ.',
            'startTime.date_format' => 'Định dạng ngày bắt đầu không hợp lệ.',
            'endTime.date_format' => 'Định dạng ngày kết thúc không hợp lệ.',
            'endTime.date' => 'Ngày kết thúc không hợp lệ.',
            'endTime.after_or_equal' => 'Ngày kết thúc phải là ngày đằng sau hoặc bằng ngày bắt đầu.',
        ]);
    }
}
