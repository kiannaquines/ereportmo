<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Incident\IncidentController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Office\OfficeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('incidents', [IncidentController::class, 'index'])->name('incidents.index');
    Route::post('incidents', [IncidentController::class, 'store'])->name('incidents.store');
    Route::get('reports', [ReportController::class, 'index'])->name('reports');
    Route::post('reports', [ReportController::class, 'store'])->name('reports.store');

    Route::get('offices', [OfficeController::class, 'index'])->name('offices');
    Route::post('offices', [OfficeController::class, 'store'])->name('offices.store');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
