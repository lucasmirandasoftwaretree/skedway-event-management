<?php

namespace Tests\Unit;

use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use App\Services\ReservationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationOverlapTest extends TestCase
{
    use RefreshDatabase;

    public function test_prevents_overlap_in_same_room(): void
    {
        $room = Room::create(['name'=>'X']);
        $user = User::create(['name'=>'U','email'=>'u@x.com']);
        Reservation::create([
            'room_id'=>$room->id,
            'user_id'=>$user->id,
            'start_at'=>'2025-01-01T10:00:00+00:00',
            'end_at'=>'2025-01-01T11:00:00+00:00',
        ]);
        $this->expectExceptionMessage('Reservation overlaps');
        app(ReservationService::class)->create($room->id,$user->id,'2025-01-01T10:30:00+00:00','2025-01-01T11:30:00+00:00');
    }

    public function test_allows_back_to_back(): void
    {
        $room = Room::create(['name'=>'X']);
        $u1 = User::create(['name'=>'A','email'=>'a@x.com']);
        $u2 = User::create(['name'=>'B','email'=>'b@x.com']);
        Reservation::create([
            'room_id'=>$room->id,
            'user_id'=>$u1->id,
            'start_at'=>'2025-01-01T10:00:00+00:00',
            'end_at'=>'2025-01-01T11:00:00+00:00',
        ]);
        $r = app(ReservationService::class)->create($room->id,$u2->id,'2025-01-01T11:00:00+00:00','2025-01-01T12:00:00+00:00');
        $this->assertNotNull($r->id);
    }
}
