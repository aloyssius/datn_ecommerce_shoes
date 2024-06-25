<?php

namespace App\Http\Requests\Account;

use App\Constants\CommonStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;

class AccountRequest extends BaseRequest
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
                Rule::in(CommonStatus::toArray()), 'nullable'
            ],
            'gender' => 'boolean|nullable',
        ]);
    }

    public function messages()
    {

        return array_merge(parent::messages(), [
            'status.in' => 'Trạng thái tài khoản không hợp lệ.',
            'gender.boolean' => 'Giới tính không hợp lệ.',
        ]);
    }
}
