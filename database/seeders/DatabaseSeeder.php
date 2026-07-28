<?php
namespace Database\Seeders;
use App\Models\Category;
use App\Models\Product;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\AiConversation;
use App\Models\AdminFallbackMessage;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Category::factory(50)->create();
        Product::factory(50)->create();
        Customer::factory(50)->create();
        Order::factory(50)->create();
        OrderItem::factory(50)->create();
        AiConversation::factory(50)->create();
        AdminFallbackMessage::factory(50)->create();
    }
}