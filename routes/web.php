<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Incident\IncidentController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Office\OfficeController;
use App\Http\Controllers\Generate\GenerateReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/api.php';


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Incident Routes
    Route::get('incidents', [IncidentController::class, 'index'])->name('incidents.index');
    Route::post('incidents', [IncidentController::class, 'store'])->name(name: 'incidents.store');
    Route::delete('incidents/{incident}', [IncidentController::class, 'destroy'])->name('incidents.destroy');
    Route::put('incidents/{id}', [IncidentController::class, 'update'])->name('incidents.update');

    // Report Routes
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('reports', [ReportController::class, 'store'])->name('reports.store');
    Route::delete('reports/{report}', [ReportController::class, 'destroy'])->name('reports.destroy');
    Route::put('reports/{id}', [ReportController::class, 'update'])->name('reports.update');
    Route::put('reports/status/{id}', [ReportController::class, 'update_status'])->name('reports.status');
    // Office Routes
    Route::get('offices', [OfficeController::class, 'index'])->name('offices.index');
    Route::post('offices', [OfficeController::class, 'store'])->name('offices.store');
    Route::delete('offices/{office}', [OfficeController::class, 'destroy'])->name('offices.destroy');
    Route::put('offices/{id}', [OfficeController::class, 'update'])->name('offices.update');


    // Report Routes
    Route::get('report-incident', [GenerateReportController::class, 'generateIncidentReport'])->name('report.incident');

    // Generate Report Incident Export Data
    Route::get('report-incident-export', [GenerateReportController::class, 'generateIncidentReportExportData'])->name('report.incident.export');


    Route::get('report-incident-visualize', [GenerateReportController::class, 'generateIncidentReportVisualize'])->name('report.incident.visualize');

    // Users Routes
    Route::get('users', [UserController::class, 'index'])->name('admin.users.index');
    Route::post('users', [UserController::class, 'store'])->name('admin.users.store');
    Route::put('users/{id}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
});
