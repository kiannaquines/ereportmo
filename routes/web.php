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

    // Incident Routes
    Route::get('incidents', [IncidentController::class, 'index'])->name('incidents.index');
    Route::post('incidents', [IncidentController::class, 'store'])->name(name: 'incidents.store');
    Route::delete('incidents/{incident}', [IncidentController::class, 'destroy'])->name('incidents.destroy');

    // Report Routes
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('reports', [ReportController::class, 'store'])->name('reports.store');
    Route::delete('reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');
    Route::put('reports/{id}',[ReportController::class, 'update'])->name('reports.update');
    // Office Routes
    Route::get('offices', [OfficeController::class, 'index'])->name('offices.index');
    Route::post('offices', [OfficeController::class, 'store'])->name('offices.store');
    Route::delete('offices/{office}', [OfficeController::class, 'destroy'])->name('offices.destroy');
    Route::put('offices/{id}',[OfficeController::class, 'update'])->name('offices.update');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
