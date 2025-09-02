<?php

namespace Tests\Feature;

use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_application_returns_a_successful_response(): void
    {
        Room::factory()->create(['name' => 'Sala A']);
        Room::factory()->create(['name' => 'Sala B']);

        $this->getJson('/api/rooms')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Sala A'])
            ->assertJsonFragment(['name' => 'Sala B']);
    }
}
