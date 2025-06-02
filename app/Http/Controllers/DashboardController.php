<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;

class DashboardController extends Controller
{
    public function index()
    {
        $reportedIncidents = Report::with('incident', 'user')->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'incident' => $report->incident->incident ?? 'Unknown Incident',
                'description' => $report->description,
                'office' => $report->incident->office->office ?? 'Unknown Office',
                'source' => $report->user->name ?? 'Unknown User',
                'image' => $report->image,
                'status' => $report->incident_response_status,
                'latitude' => $report->latitude,
                'longitude' => $report->longitude,
                'created_at' => $report->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $report->updated_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('dashboard', [
            'reportedIncidents' => $reportedIncidents,
        ]);
    }

    public function store(Request $request)
    {
        // Logic to store a new report
    }

    public function update(Request $request, $id)
    {
        // Update logic here
    }

    public function destroy($id)
    {
        // Delete logic here
    }
}
