<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use Illuminate\Http\JsonResponse;

class ApiReportIncidentController extends Controller
{
    /**
     * Store a new reported incident.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'incident_id' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reported_incidents', 'public');
        }

        $incident = Report::create([
            'user_id' => $user->id,
            'incident_id' => $validated['incident_id'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);

        return response()->json($incident, 201);
    }

    /**
     * Get all reported incidents by a specific user ID.
     */
    public function getMyReportedIncidents(Request $request): JsonResponse
    {
        $user = $request->user();
        $reportedIncidents = Report::where('user_id', $user->id)->get();
        return response()->json($reportedIncidents);
    }
}
