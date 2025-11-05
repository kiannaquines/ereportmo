<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Office;
use App\Models\Role;
use App\Models\Incident;

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
        $offices = [
            'MSWDO (VAWC)',
            'PNP',
            'MDRRMO',
        ];

        foreach ($offices as $office) {
            Office::create([
                'office' => $office,
                'location' => 'Kabacan',
                'status' => 'ON'
            ]);
        }
        $roles = [
            'admin',
            'user',
            'pnp',
            'mdrrmo',
            'vawc',
        ];
        foreach ($roles as $role) {
            Role::create([
                'role' => $role,
            ]);
        }
       
        User::create([
            'name' => 'Kurt Lugagay',
            'email' => 'kurth@ereportmo.com',
            'municipality' => 'Makilala',
            'barangay' => 'Kisante',
            'role' => Role::where('role', 'admin')->first()->id,
            'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            'password' => Hash::make('kurth@ereportmo.com'),
        ]);


        $incidents = [
            [
                'incident' => 'Domestic violence',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Battery',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Assault',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Rape',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Harassment',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Molestation',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Emotional abuse',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Verbal abuse',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Threats',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Manipulation',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Economic abuse',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Stalking or harassment',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Child protection cases in collaboration with DSWD and VAWC units',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Theft',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Robbery',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Murder',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Physical injury',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Illegal drugs',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Fraud',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Hit-and-run',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Accidents',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Violations',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Missing persons reports',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Illegal possession of firearms or weapons',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Riots',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Public disturbances',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Protests',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Earthquakes',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Typhoons',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Floods',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Landslides',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Volcanic eruptions',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Fire incidents',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Road accidents or mass casualty events',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Evacuations and rescue operations',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Hazardous material spills',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Infrastructure damage due to disasters',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Early warning alerts and preparedness training',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Coordination during pandemics or biological threats',
                'office_id' => Office::where('office', 'MDRRMO')->first()->id,
            ],
        ];

        foreach ($incidents as $incident) {
            Incident::create([
                'incident' => $incident['incident'],
                'office_id' => $incident['office_id'],
            ]);
        }
        // $this->call(UserSeeder::class);
        // $this->call(ReportSeeder::class);
    }
}
