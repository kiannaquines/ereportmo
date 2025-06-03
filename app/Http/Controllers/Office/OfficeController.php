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
            'office' => 'required|string|max:255'
        ]);

        Office::create($request->all());

        return redirect()->route('offices.store')->with('success', 'You have successfully added you office autority.');
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
