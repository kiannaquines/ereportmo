<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ApiReportIncidentController;
use App\Http\Controllers\Api\ApiAuthenticationController;
use App\Http\Controllers\Api\ApiIncidentTypeController;
use App\Http\Controllers\Api\ApiOfficeController;
use App\Http\Controllers\Api\OfficeLocationController;

Route::prefix('v1')->group(function () {
    Route::post('/register', [ApiAuthenticationController::class, 'api_register'])->name('api_register');
    Route::post('/login', [ApiAuthenticationController::class, 'api_login'])->name('api_login');
    // Public endpoint: distinct locations per office where office status is ON
    Route::get('/offices/locations', [OfficeLocationController::class, 'index']);
    // Public endpoint: list of distinct locations (strings) where office status is ON
    Route::get('/locations', [OfficeLocationController::class, 'distinct']);
});

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::post('/logout', [ApiAuthenticationController::class, 'api_logout'])->name('api_logout');
    Route::post('/report-incident', [ApiReportIncidentController::class, 'store']);
    Route::get('/my-reported-incidents', [ApiReportIncidentController::class, 'getMyReportedIncidents']);
    Route::get('/reported-incidents/{id}', [ApiReportIncidentController::class, 'getSpeficReportedIncident']);
    Route::get('/incident-types', [ApiIncidentTypeController::class, 'getIncidentTypes']);
    Route::get('/offices', [ApiOfficeController::class, 'getOffices']);
    Route::delete('/report-incident/{id}',[ApiReportIncidentController::class,'deleteReportedIncident']);
});