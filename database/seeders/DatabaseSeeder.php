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
            Office::factory()->create([
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
            Role::factory()->create([
                'role' => $role,
            ]);
        }
       
        User::factory()->create([
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
                'office' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Sexual abuse (rape, harassment, molestation)',
                'office' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Psychological abuse (emotional/verbal abuse, threats, manipulation)',
                'office' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Economic abuse (withholding financial support, controlling resources)',
                'office' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Stalking or harassment (including online abuse or surveillance)',
                'office' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Child protection cases in collaboration with DSWD and VAWC units',
                'office' => Office::where('office', 'MSWDO (VAWC)')->first()->id,
            ],
            [
                'incident' => 'Crimes (theft, robbery, murder, physical injury, illegal drugs, fraud)',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Traffic-related incidents (accidents, violations, hit-and-run)',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Missing persons reports',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Illegal possession of firearms or weapons',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Domestic disputes (especially if they involve criminal acts)',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Child protection cases in collaboration with DSWD and VAWC units',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Riots, public disturbances, and protests',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Emergency responses related to criminal activities',
                'office' => Office::where('office', 'PNP')->first()->id,
            ],
            [
                'incident' => 'Natural disasters (earthquakes, typhoons, floods, landslides)',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Fire incidents',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Road accidents or mass casualty events',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Evacuations and rescue operations',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Hazardous material spills',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Infrastructure damage due to disasters',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Early warning alerts and preparedness training',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
            [
                'incident' => 'Coordination during pandemics or biological threats',
                'office' => Office::where('office', 'MDRRMO')->first()->id,
            ],
        ];

        foreach ($incidents as $incident) {
            Incident::factory()->create([
                'incident' => $incident['incident'],
                'office' => $incident['office'],
            ]);
        }
    }
}
