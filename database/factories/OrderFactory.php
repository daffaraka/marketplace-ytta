<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;
class OrderFactory extends Factory {
    public function definition(): array {
        return [
            'customer_id' => Customer::inRandomOrder()->first()->id ?? Customer::factory(),
            'status' => fake()->randomElement(['pending', 'diproses', 'lunas', 'selesai']),
            'total_price' => fake()->randomFloat(2, 50, 500),
        ];
    }
}