<?php

namespace App\Http\Controllers\Office;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Models\Office;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('office/office', [
            'offices' => Office::get()->map(function ($office) {
                return [
                    'id' => $office->id,
                    'office' => $office->office,
                    'location' => $office->location,
                    'status' => $office->status,
                    'created_at' => $office->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $office->updated_at->format('Y-m-d H:i:s'),
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
            'office' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'status' => 'required|string|max:255|in:ON,OFF'
        ]);

        Office::create($request->all());

        return redirect()->route('offices.index')->with('success', 'You have successfully added your office authority.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $office = Office::findOrFail($id);
        $validated = $request->validate([
            'office' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'status' => 'required|string|max:255|in:ON,OFF'
        ]);

        $office->office = $validated['office'];
        $office->location = $validated['location'];
        $office->status = $validated['status'];

        $office->save();

        return back()->with('success', 'Authority name has been updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Office $office)
    {
        try {
            $office->delete();
            return redirect()->route('offices.index')
                ->with('success', 'Reported incident deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete reported incident: ' . $e->getMessage());
        }
    }
}
