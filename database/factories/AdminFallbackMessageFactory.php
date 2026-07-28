<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class AdminFallbackMessageFactory extends Factory {
    public function definition(): array {
        return [
            'telegram_chat_id' => fake()->numerify('##########'),
            'message' => fake()->sentence(),
            'is_resolved' => fake()->boolean(),
        ];
    }
}