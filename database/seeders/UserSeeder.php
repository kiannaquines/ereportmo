<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Kian Naquines',
            'email' => 'kiannaquines@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Makilala',
            'barangay' => 'New Cebu',
            'password' => Hash::make('kiannaquines@ereportmo.com'),
            'role' => Role::where('role', 'user')->first(),
        ]);
    }
}
