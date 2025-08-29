<?php

namespace App\Services;

use App\Models\Reservation;
use Illuminate\Support\Facades\DB;

class ReservationService
{
    public function create(int $roomId, int $userId, string $startIso, string $endIso): Reservation
    {
        return DB::transaction(function () use ($roomId, $userId, $startIso, $endIso) {
            $overlap = Reservation::where('room_id', $roomId)
                ->whereNull('canceled_at')
                ->where(function ($q) use ($startIso, $endIso) {
                    $q->where('start_at', '<', $endIso)->where('end_at', '>', $startIso);
                })
                ->lockForUpdate()
                ->exists();
            if ($overlap) {
                abort(422, 'Reservation overlaps');
            }
            $reservation = Reservation::create([
                'room_id' => $roomId,
                'user_id' => $userId,
                'start_at' => $startIso,
                'end_at' => $endIso,
            ]);

            return $reservation;
        });
    }

    public function cancel(Reservation $reservation): Reservation
    {
        return DB::transaction(function () use ($reservation) {
            $reservation->canceled_at = now();
            $reservation->save();

            return $reservation;
        });
    }
}
