<?php

namespace App\Http\Controllers\Incident;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Incident;
use App\Models\Office;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('incident/incident', [
            'offices' => Office::select('id', 'office')->get(),
            'incidents' => Incident::with('office:id,office')
                ->get()
                ->map(function ($incident) {
                    return [
                        'id' => $incident->id,
                        'incident' => $incident->incident,
                        'office' => $incident->office ? $incident->office->office : null,
                        'created_at' => $incident->created_at->toDateTimeString(),
                        'updated_at' => $incident->updated_at->toDateTimeString(),
                    ];
                }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'office_id' => 'required|string|max:255',
            'incident' => 'required|string|max:1000',
        ]);

        Incident::create([
            'incident' => $request->incident,
            'office_id' => $request->office_id
        ]);

        return redirect()->route('incidents.index')->with('success', 'Incident created successfully.');
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
    public function destroy(Incident $incident)
    {
        try {
            $incident->delete();
            return redirect()->route('incidents.index')
                ->with('success', 'Incident deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete incident: ' . $e->getMessage());
        }
    }
}
