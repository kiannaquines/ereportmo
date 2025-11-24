<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Office;

class OfficeLocationController extends Controller
{
    /**
     * Return distinct locations grouped by office where status = 'ON'.
     *
     * Response format:
     * [
     *   {
     *     "office": "PNP",
     *     "locations": ["Location A", "Location B"]
     *   },
     *   ...
     * ]
     */
    public function index(Request $request)
    {
        // Select only offices with status 'ON' and non-empty location
        $rows = Office::query()
            ->where('status', 'ON')
            ->whereNotNull('location')
            ->where('location', '<>', '')
            ->get(['office', 'location'])
            ->unique(function ($item) {
                return $item->office . '|' . $item->location;
            })
            ->groupBy('office')
            ->map(function ($group) {
                return [
                    'office' => $group->first()->office,
                    'locations' => $group->pluck('location')->values()->all(),
                ];
            })
            ->values();

        return response()->json($rows);
    }

    /**
     * Return distinct locations (strings) where office status = 'ON'.
     *
     * Response:
     * ["Location A", "Location B", ...]
     */
    public function distinct(Request $request)
    {
        $locations = Office::query()
            ->where('status', 'ON')
            ->whereNotNull('location')
            ->where('location', '<>', '')
            ->pluck('location')
            ->unique()
            ->values()
            ->all();

        return response()->json(['municipalities' => $locations]);
    }
}
