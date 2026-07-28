<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
class CustomerFactory extends Factory {
    public function definition(): array {
        return [
            'telegram_chat_id' => fake()->unique()->numerify('##########'),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'total_pesanan_selesai' => fake()->numberBetween(0, 50),
        ];
    }
}