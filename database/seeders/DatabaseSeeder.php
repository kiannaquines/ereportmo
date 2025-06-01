<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Office;
use App\Models\Role;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Office::factory()->create([
            'office' => 'VAWC',
        ]);

        Office::factory()->create([
            'office' => 'PNP',
        ]);
        
        Office::factory()->create([
            'office' => 'MDRRMO (VAWC)',
        ]);

        Role::factory()->create([
            'role' => 'admin',
        ]);

        Role::factory()->create([
            'role' => 'user',
        ]);
        
        Role::factory()->create([
            'role' => 'pnp',
        ]);
        
        Role::factory()->create([
            'role' => 'mdrrmo',
        ]);

        Role::factory()->create([
            'role' => 'vawc',
        ]);

        User::factory()->create([
            'name' => 'Kurt Lugagay',
            'email' => 'kurth@ereportmo.com',
            'municipality' => 'Makilala',
            'barangay' => 'Kisante',
            'role' => Role::where('role', 'admin')->first()->id,
            'office_id' => Office::where('office', 'VAWC')->first()->id,
            'password' => Hash::make('kurth@ereportmo.com'),
        ]);

    }
}
