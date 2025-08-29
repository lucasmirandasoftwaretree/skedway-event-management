<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'start_at' => ['required', 'date_format:Y-m-d\TH:i:sP'],
            'end_at' => ['required', 'date_format:Y-m-d\TH:i:sP', 'after:start_at'],
        ];
    }
}
