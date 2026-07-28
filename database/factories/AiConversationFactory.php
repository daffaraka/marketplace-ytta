<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class AiConversationFactory extends Factory {
    public function definition(): array {
        return [
            'telegram_chat_id' => fake()->numerify('##########'),
            'role' => fake()->randomElement(['user', 'assistant']),
            'content' => fake()->sentence(),
        ];
    }
}