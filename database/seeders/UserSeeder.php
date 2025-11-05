<?php

namespace Database\Seeders;

use App\Models\Office;
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
        User::create([
            'name' => 'Kurt Lugagay',
            'email' => 'kurth@ereportmo.com',
            'municipality' => 'Makilala',
            'barangay' => 'Kisante',
            'role' => Role::where('role', 'admin')->first()->id,
            'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            'password' => Hash::make('kurth@ereportmo.com'),
        ]);
        
        User::create([
            'name' => 'Kian Naquines',
            'email' => 'kurt@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Makilala',
            'barangay' => 'Kisante',
            'password' => Hash::make('kurt@ereportmo.com'),
            'office_id' => null,
            'role' => Role::where('role', 'user')->first()->id,
        ]);
    }
}
