<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $roomId = $request->integer('room_id');
        $userId = $request->integer('user_id');

        $key = 'reservations:'.md5(json_encode([$roomId, $userId]));

        $items = Cache::remember($key, 60, function () use ($roomId, $userId) {
            $q = Reservation::query()
                ->whereNull('canceled_at')
                ->orderBy('start_at');

            if ($roomId) {
                $q->where('room_id', $roomId);
            }
            if ($userId) {
                $q->where('user_id', $userId);
            }

            return $q->get();
        });

        return ReservationResource::collection($items);
    }

    public function store(StoreReservationRequest $request, ReservationService $service)
    {
        $start = $request->date('start_at');
        $end = $request->date('end_at');

        $r = $service->create(
            $request->integer('room_id'),
            $request->integer('user_id'),
            $start ? $start->toIso8601String() : $request->string('start_at'),
            $end ? $end->toIso8601String() : $request->string('end_at')
        );
        Cache::flush();

        return (new ReservationResource($r))->response()->setStatusCode(201);
    }

    public function destroy(Reservation $reservation, ReservationService $service)
    {
        $service->cancel($reservation);
        Cache::flush();

        return response()->noContent();
    }
}
