<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

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
            'user_id' => $this->faker->numberBetween(1, 100),
            'reported_by' => $this->faker->numberBetween(1, 100),
            'incident' => $this->faker->sentence(),
            'image' => $this->faker->imageUrl(),
            'incident_response_status' => $this->faker->randomElement(['New', 'Assigned', 'In Progress', 'Resolved', 'Closed']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
