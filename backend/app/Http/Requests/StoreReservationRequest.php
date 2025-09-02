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
            'start_at' => ['required', 'date'],
            'end_at' => ['required', 'date', 'after:start_at'],
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => 'Selecione a sala.',
            'room_id.exists' => 'Sala inválida.',
            'user_id.required' => 'Selecione o usuário.',
            'user_id.exists' => 'Usuário inválido.',
            'start_at.required' => 'Informe o início.',
            'start_at.date' => 'Data/hora de início inválida.',
            'end_at.required' => 'Informe o fim.',
            'end_at.date' => 'Data/hora de fim inválida.',
            'end_at.after' => 'O fim deve ser após o início.',
        ];
    }
}
