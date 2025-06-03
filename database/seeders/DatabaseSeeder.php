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
                'incident' => 'Physical abuse (domestic violence, battery, assault)',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Sexual abuse (rape, harassment, molestation)',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Psychological abuse (emotional/verbal abuse, threats, manipulation)',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Economic abuse (withholding financial support, controlling resources)',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Stalking or harassment (including online abuse or surveillance)',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Child protection cases in collaboration with DSWD and VAWC units',
                'office_id' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Crimes (theft, robbery, murder, physical injury, illegal drugs, fraud)',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Traffic-related incidents (accidents, violations, hit-and-run)',
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
                'incident' => 'Domestic disputes (especially if they involve criminal acts)',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Child protection cases in collaboration with DSWD and VAWC units',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Riots, public disturbances, and protests',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Emergency responses related to criminal activities',
                'office_id' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Natural disasters (earthquakes, typhoons, floods, landslides)',
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
    }
}
