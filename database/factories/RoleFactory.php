<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;


class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = \App\Models\Role::class;
    
    public function definition(): array
    {
        return [
            'role' => $this->faker->unique()->word(),
        ];
    }
}
