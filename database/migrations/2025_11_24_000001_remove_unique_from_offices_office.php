<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('offices', function (Blueprint $table) {
            // Remove unique constraint on `office` column if it exists
            // Laravel's dropUnique accepts an array of column names and will derive the index name.
            try {
                $table->dropUnique(['office']);
            } catch (\Exception $e) {
                // If the index doesn't exist, swallow the exception to keep migration idempotent.
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('offices', function (Blueprint $table) {
            // Re-add unique constraint on `office` column
            // If duplicates exist, this will fail when rolling back; that's expected behavior.
            $table->unique('office');
        });
    }
};
