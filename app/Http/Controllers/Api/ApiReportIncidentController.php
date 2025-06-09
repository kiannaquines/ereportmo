<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Report;
use Illuminate\Http\JsonResponse;

class ApiReportIncidentController extends Controller
{
    /**
     * Summary of store
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'incident_id' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('reported_incidents', 'public');
        }

       Report::create([
            'user_id' => $user->id,
            'incident_id' => $validated['incident_id'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);

        return response()->json([
            'message' => 'Incident reported successfully',
        ], 201);
    }

    /**
     * Summary of get all reported incidents by a specific user
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function getMyReportedIncidents(Request $request): JsonResponse
    {
        $user = $request->user();
        $reportedIncidents = Report::where('user_id', $user->id)->with(['incident','user'])->get();
        return response()->json($reportedIncidents);
    }

    /**
     * Summary of get specific reported incident
     * @param \Illuminate\Http\Request $request
     * @param string $id
     * @return JsonResponse|mixed
     */
    public function getSpeficReportedIncident(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        $reportedIncident = Report::where('user_id', $user->id)->with(['incident','user'])->first();
        if (!$reportedIncident) {
            return response()->json(['message' => 'Reported incident not found'], 404);
        }
        return response()->json($reportedIncident);
    }
}
