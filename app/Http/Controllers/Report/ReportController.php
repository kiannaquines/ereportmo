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
                'incident_id' => $report->incident->id,
                'office_id' => $report->incident->office->id,
                'description' => $report->description,
                'office' => $report->incident->office->office ?? 'Unknown Office',
                'source_id' => $report->user->id,
                'source' => $report->user->name ?? 'Unknown User',
                'image' => $report->image,
                'status' => $report->incident_response_status,
                'latitude' => $report->latitude,
                'longitude' => $report->longitude,
                'created_at' => $report->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $report->updated_at->format('Y-m-d H:i:s'),
            ];
        });

        $incidents = Incident::with('office')->get()->map(function ($incident) {
            return [
                'id' => $incident->id,
                'office' => $incident->office->office,
                'incident' => $incident->incident,
            ];
        });

        return Inertia::render('report/report', [
            'reportedBy' => $reportedBy,
            'reportedIncidents' => $reportedIncidents,
            'incidents' => $incidents,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'reported_by' => 'required|string|max:255',
            'incident_id' => 'required|string|max:1000',
            'description' => 'nullable|string|max:255',
            'latitude' => 'nullable|string|max:255',
            'longitude' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reported_incidents', 'public');
        }

        Report::create([
            'user_id' => $request->reported_by,
            'incident_id' => $request->incident_id,
            'description' => $request->description,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'image' => $imagePath
        ]);

        return redirect()->route('reports.store')->with('success', 'Reported Incident created successfully.');
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
    public function destroy(Report $report)
    {
        try {
            $report->delete();
            return redirect()->route('reports.index')
                ->with('success', 'Reported incident deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete reported incident: ' . $e->getMessage());
        }
    }
}
