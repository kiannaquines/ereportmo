<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Incident;
use App\Models\User;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->value('id'),
            'incident_id' => Incident::inRandomOrder()->value('id'),
            'image' => $this->faker->imageUrl(),
            'description' => $this->faker->text(100),
            'incident_response_status' => $this->faker->randomElement(['New', 'Assigned', 'In Progress', 'Resolved', 'Closed']),
            'latitude' => $this->faker->latitude(6.5, 7.5), // North Cotabato area coordinates
            'longitude' => $this->faker->longitude(124.5, 125.5), // North Cotabato area coordinates
            // created_at will be set by the seeder for better control
        ];
    }
}
