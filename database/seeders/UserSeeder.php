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
        // Admin user
        User::create([
            'name' => 'Kurt Lugagay',
            'email' => 'kurth@ereportmo.com',
            'municipality' => 'Makilala',
            'barangay' => 'Kisante',
            'role' => Role::where('role', 'admin')->first()->id,
            'office_id' => null, // Admin should not have office_id to see all data
            'password' => Hash::make('kurth@ereportmo.com'),
        ]);
        
        // Regular user
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

        // PNP Officers from different municipalities
        User::create([
            'name' => 'Officer Juan Dela Cruz',
            'email' => 'juan.pnp@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Kidapawan City',
            'barangay' => 'Poblacion',
            'password' => Hash::make('password123'),
            'office_id' => Office::where('office', 'PNP')->first()->id,
            'role' => Role::where('role', 'pnp')->first()->id,
        ]);

        User::create([
            'name' => 'Officer Maria Santos',
            'email' => 'maria.pnp@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Mlang',
            'barangay' => 'Poblacion',
            'password' => Hash::make('password123'),
            'office_id' => Office::where('office', 'PNP')->first()->id,
            'role' => Role::where('role', 'pnp')->first()->id,
        ]);

        // MDRRMO Officers from different municipalities
        User::create([
            'name' => 'Officer Pedro Reyes',
            'email' => 'pedro.mdrrmo@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Kabacan',
            'barangay' => 'Poblacion',
            'password' => Hash::make('password123'),
            'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            'role' => Role::where('role', 'mdrrmo')->first()->id,
        ]);

        User::create([
            'name' => 'Officer Ana Garcia',
            'email' => 'ana.mdrrmo@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Matalam',
            'barangay' => 'Bangbang',
            'password' => Hash::make('password123'),
            'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            'role' => Role::where('role', 'mdrrmo')->first()->id,
        ]);

        // MSWDO (VAWC) Officers from different municipalities
        User::create([
            'name' => 'Officer Rosa Martinez',
            'email' => 'rosa.vawc@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Tulunan',
            'barangay' => 'Poblacion',
            'password' => Hash::make('password123'),
            'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            'role' => Role::where('role', 'vawc')->first()->id,
        ]);

        User::create([
            'name' => 'Officer Carmen Lopez',
            'email' => 'carmen.vawc@ereportmo.com',
            'email_verified_at' => now(),
            'municipality' => 'Antipas',
            'barangay' => 'Poblacion',
            'password' => Hash::make('password123'),
            'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            'role' => Role::where('role', 'vawc')->first()->id,
        ]);

        // Regular users from different municipalities who will report incidents
        $regularUsers = [
            [
                'name' => 'Mark Johnson',
                'email' => 'mark.johnson@example.com',
                'municipality' => 'Kidapawan City',
                'barangay' => 'Lanao',
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah.williams@example.com',
                'municipality' => 'Mlang',
                'barangay' => 'Gaunan',
            ],
            [
                'name' => 'David Brown',
                'email' => 'david.brown@example.com',
                'municipality' => 'Kabacan',
                'barangay' => 'Cuyapon',
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.anderson@example.com',
                'municipality' => 'Matalam',
                'barangay' => 'Kilada',
            ],
            [
                'name' => 'James Taylor',
                'email' => 'james.taylor@example.com',
                'municipality' => 'Tulunan',
                'barangay' => 'Batang',
            ],
            [
                'name' => 'Jennifer Garcia',
                'email' => 'jennifer.garcia@example.com',
                'municipality' => 'Antipas',
                'barangay' => 'Malangag',
            ],
            [
                'name' => 'Robert Martinez',
                'email' => 'robert.martinez@example.com',
                'municipality' => 'Makilala',
                'barangay' => 'Malabuan',
            ],
            [
                'name' => 'Maria Rodriguez',
                'email' => 'maria.rodriguez@example.com',
                'municipality' => 'Kidapawan City',
                'barangay' => 'Perez',
            ],
            [
                'name' => 'Michael Lee',
                'email' => 'michael.lee@example.com',
                'municipality' => 'Mlang',
                'barangay' => 'Libungan',
            ],
            [
                'name' => 'Jessica Wang',
                'email' => 'jessica.wang@example.com',
                'municipality' => 'Kabacan',
                'barangay' => 'Magatos',
            ],
            [
                'name' => 'Christopher Santos',
                'email' => 'chris.santos@example.com',
                'municipality' => 'Matalam',
                'barangay' => 'Arakan',
            ],
            [
                'name' => 'Amanda Cruz',
                'email' => 'amanda.cruz@example.com',
                'municipality' => 'Tulunan',
                'barangay' => 'Damawato',
            ],
            [
                'name' => 'Daniel Ramos',
                'email' => 'daniel.ramos@example.com',
                'municipality' => 'Antipas',
                'barangay' => 'Luhib',
            ],
            [
                'name' => 'Emily Torres',
                'email' => 'emily.torres@example.com',
                'municipality' => 'Makilala',
                'barangay' => 'Bulakanon',
            ],
            [
                'name' => 'Matthew Reyes',
                'email' => 'matthew.reyes@example.com',
                'municipality' => 'Kidapawan City',
                'barangay' => 'Indangan',
            ],
        ];

        foreach ($regularUsers as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'email_verified_at' => now(),
                'municipality' => $userData['municipality'],
                'barangay' => $userData['barangay'],
                'password' => Hash::make('password123'),
                'office_id' => null,
                'role' => Role::where('role', 'user')->first()->id,
            ]);
        }
    }
}
