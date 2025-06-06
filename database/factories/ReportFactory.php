<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Incident;
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
            'description' => $this->faker->paragraph(),
            'incident_response_status' => $this->faker->randomElement(['New', 'Assigned', 'In Progress', 'Resolved', 'Closed']),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
        ];
    }
}
