<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('admin_fallback_messages', function (Blueprint $table) {
            $table->id();
            $table->string('telegram_chat_id');
            $table->text('message');
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('admin_fallback_messages');
    }
};
