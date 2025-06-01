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


        $VAWCincidents = [
            'Physical abuse (domestic violence, battery, assault)',
            'Sexual abuse (rape, harassment, molestation)',
            'Psychological abuse (emotional/verbal abuse, threats, manipulation)',
            'Economic abuse (withholding financial support, controlling resources)',
            'Stalking or harassment (including online abuse or surveillance)',
        ];

        foreach ($VAWCincidents as $incident) {
            Incident::factory()->create([
                'incident' => $incident,
                'office' => Office::where('office', 'VAWC')->first()->id,
            ]);
        }

        $PNPincidents = [
            'Crimes (theft, robbery, murder, physical injury, illegal drugs, fraud)',
            'Traffic-related incidents (accidents, violations, hit-and-run)',
            'Missing persons reports',
            'Illegal possession of firearms or weapons',
            'Domestic disputes (especially if they involve criminal acts)',
            'Child protection cases in collaboration with DSWD and VAWC units',
            'Riots, public disturbances, and protests',
            'Emergency responses related to criminal activities',
        ];

        foreach ($PNPincidents as $incident) {
            Incident::factory()->create([
                'incident' => $incident,
                'office' => Office::where('office', 'PNP')->first()->id,
            ]);
        }

        $MDRRMOincidents = [
            'Natural disasters (earthquakes, typhoons, floods, landslides)',
            'Fire incidents',
            'Road accidents or mass casualty events',
            'Evacuations and rescue operations',
            'Hazardous material spills',
            'Infrastructure damage due to disasters',
            'Early warning alerts and preparedness training',
            'Coordination during pandemics or biological threats',
        ];

        foreach ($MDRRMOincidents as $incident) {
            Incident::factory()->create([
                'incident' => $incident,
                'office' => Office::where('office', 'MDRRMO (VAWC)')->first()->id,
            ]);
        }
    }
}
