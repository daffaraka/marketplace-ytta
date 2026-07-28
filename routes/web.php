<?php

use App\Http\Controllers\BotController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\FaqTemplateController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TrafficController;
use Illuminate\Support\Facades\Route;

// Redirect root to dashboard
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// === Main Application Routes ===
// (Auth middleware dimatikan sementara untuk development)
// Untuk mengaktifkan auth, pindahkan route-route di bawah ke dalam group middleware auth

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Settings
Route::get('/settings', [SettingController::class, 'index'])->name('settings');
Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');

// Catalog (CRUD)
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog');
Route::get('/catalog/create', [CatalogController::class, 'create'])->name('catalog.create');
Route::get('/catalog/stock', [CatalogController::class, 'stockManagement'])->name('catalog.stock');
Route::put('/catalog/stock/bulk', [CatalogController::class, 'bulkUpdateStock'])->name('catalog.stock.bulk');
Route::post('/catalog', [CatalogController::class, 'store'])->name('catalog.store');
Route::get('/catalog/{id}/edit', [CatalogController::class, 'edit'])->name('catalog.edit');
Route::put('/catalog/{id}', [CatalogController::class, 'update'])->name('catalog.update');
Route::delete('/catalog/{id}', [CatalogController::class, 'destroy'])->name('catalog.destroy');

// Orders
Route::get('/orders', [OrderController::class, 'index'])->name('orders');
Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
Route::delete('/orders/{id}', [OrderController::class, 'destroy'])->name('orders.destroy');
Route::get('/orders/{id}/print', [OrderController::class, 'printInvoice'])->name('orders.print');

// Customers
Route::get('/customers', [CustomerController::class, 'index'])->name('customers');
Route::get('/customers/{id}', [CustomerController::class, 'show'])->name('customers.show');
Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('customers.destroy');

// Bot
Route::get('/bot', [BotController::class, 'index'])->name('bot');
Route::get('/bot/history', [BotController::class, 'chatHistory'])->name('bot.history');
Route::get('/bot/faq', [FaqTemplateController::class, 'index'])->name('bot.faq');
Route::get('/bot/faq/create', [FaqTemplateController::class, 'create'])->name('bot.faq.create');
Route::post('/bot/faq', [FaqTemplateController::class, 'store'])->name('bot.faq.store');
Route::get('/bot/faq/{id}/edit', [FaqTemplateController::class, 'edit'])->name('bot.faq.edit');
Route::put('/bot/faq/{id}', [FaqTemplateController::class, 'update'])->name('bot.faq.update');
Route::delete('/bot/faq/{id}', [FaqTemplateController::class, 'destroy'])->name('bot.faq.destroy');

// Reports
Route::get('/reports', [ReportController::class, 'index'])->name('reports');
Route::get('/traffic', [TrafficController::class, 'index'])->name('traffic');

// === Webhook (No CSRF, No Auth) ===
Route::post('/webhook/telegram', [WebhookController::class, 'handleTelegram'])
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// === Auth-protected routes ===
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
