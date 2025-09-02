<?php

namespace App\Services;

use App\Models\Reservation;
use Carbon\CarbonImmutable;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ReservationService
{
    public function create(int $roomId, int $userId, string $startAt, string $endAt): Reservation
    {
        $start = CarbonImmutable::parse($startAt);
        $end   = CarbonImmutable::parse($endAt);

        if ($end->lessThanOrEqualTo($start)) {
            throw new HttpException(422, 'Data/hora final deve ser maior que a inicial');
        }

        $hasOverlap = Reservation::query()
            ->where('room_id', $roomId)
            ->whereNull('canceled_at')
            ->where(function ($q) use ($start, $end) {
                $q->where('start_at', '<', $end)
                    ->where('end_at',   '>', $start);
            })
            ->exists();

        if ($hasOverlap) {
            throw new HttpException(409, 'Conflito de Reservas!');
        }

        $r = new Reservation();
        $r->room_id  = $roomId;
        $r->user_id  = $userId;
        $r->start_at = $start;
        $r->end_at   = $end;
        $r->save();

        return $r;
    }

    public function cancel(Reservation $reservation): void
    {
        $reservation->canceled_at = now();
        $reservation->save();
    }
}
