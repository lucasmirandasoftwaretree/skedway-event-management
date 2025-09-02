<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_list_cancel(): void
    {
        $room = Room::create(['name' => 'A']);
        $user = User::create(['name' => 'U', 'email' => 'u@x.com']);

        $res = $this->postJson('/api/reservations', [
            'room_id' => $room->id,
            'user_id' => $user->id,
            'start_at' => '2025-01-01T10:00:00+00:00',
            'end_at' => '2025-01-01T11:00:00+00:00',
        ])->assertCreated()->json('data');

        $this->getJson('/api/reservations?room_id='.$room->id)->assertOk()->assertJsonCount(1, 'data');

        $this->deleteJson('/api/reservations/'.$res['id'])->assertNoContent();

        $this->getJson('/api/reservations?room_id='.$room->id)->assertOk()->assertJsonCount(0, 'data');
    }
}
