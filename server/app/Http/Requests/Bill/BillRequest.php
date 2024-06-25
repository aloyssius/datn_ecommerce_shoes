<?php

namespace App\Http\Requests\Bill;

use App\Constants\OrderStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class BillRequest extends BaseRequest
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
                Rule::in(OrderStatus::toArray()), 'nullable'
            ],
            'startDate' => 'date_format:d-m-Y|nullable',
            'endDate' => 'date_format:d-m-Y|nullable',
            // 'endDate' => 'date|date_format:d-m-Y|after_or_equal:startDate|nullable',
        ]);
    }

    public function messages()
    {
        return array_merge(parent::messages(), [
            'status.in' => 'Trạng thái đơn hàng không hợp lệ.',
            // 'startDate.date' => 'Ngày bắt đầu không hợp lệ.',
            'startDate.date_format' => 'Định dạng ngày bắt đầu không hợp lệ.',
            'endDate.date_format' => 'Định dạng ngày kết thúc không hợp lệ.',
            // 'endDate.date' => 'Ngày kết thúc không hợp lệ.',
            // 'endDate.after_or_equal' => 'Ngày kết thúc phải là ngày đằng sau hoặc bằng ngày bắt đầu.',
        ]);
    }
}
