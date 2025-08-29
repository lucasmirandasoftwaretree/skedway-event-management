<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Room::firstOrCreate(['name' => 'Sala A']);
        Room::firstOrCreate(['name' => 'Sala B']);
        User::firstOrCreate(['email' => 'alice@example.com'], ['name' => 'Alice']);
        User::firstOrCreate(['email' => 'bob@example.com'], ['name' => 'Bob']);
    }
}
