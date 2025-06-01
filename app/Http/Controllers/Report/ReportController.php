<?php

namespace App\Http\Controllers\Report;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

use App\Models\User;
use App\Models\Role;
use App\Models\Incident;
use App\Models\Report;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roleId = Role::where('role', 'user')->value('id');
        
        $reportedBy = User::where('role', $roleId)
            ->select('id', 'name')
            ->get();

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

        return Inertia::render('report/report', [
            'reportedBy' => $reportedBy,
            'reportedIncidents' => $reportedIncidents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
