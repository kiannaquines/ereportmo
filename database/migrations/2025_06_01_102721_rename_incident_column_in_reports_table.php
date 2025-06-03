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
        Schema::table('reports', function (Blueprint $table) {
            $table->renameColumn('incident', 'incident_id');
            $table->dropForeign(['incident']);
            $table->foreign('incident_id')->references('id')->on('incidents');
            $table->renameColumn('reported_by', 'user_id');
            $table->dropForeign(['reported_by']);
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
        });
    }
};
