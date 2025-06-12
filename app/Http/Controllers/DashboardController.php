<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use DateTime;

class DashboardController extends Controller
{
    public function index()
    {
        $totalNoOfUsers = User::get()->count();
        $newUsersThisMonth = User::whereMonth('created_at', Carbon::now()->month)->count();

        $totalNoOfIncidents = Incident::get()->count();
        $totalNoOfReportedIncidents = Report::get()->count();

        $reportedIncidents = Report::with('incident', 'user')
            ->whereDate('created_at', Carbon::today())
            ->get()
            ->map(function ($report) {
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

        $reportedIncidentRawData = DB::table('reports')
            ->select(
                DB::raw("strftime('%Y', created_at) as year"),
                DB::raw("strftime('%m', created_at) as month"),
                DB::raw('COUNT(*) as total')
            )
            ->groupBy(
                DB::raw("strftime('%Y', created_at)"),
                DB::raw("strftime('%m', created_at)")
            )
            ->orderBy(DB::raw("strftime('%Y', created_at)"), 'desc')
            ->orderBy(DB::raw("strftime('%m', created_at)"), 'asc')
            ->get()
            ->map(function ($row) {
                $monthName = DateTime::createFromFormat('!m', $row->month)->format('F');
                return [
                    'year' => $row->year,
                    'month_name' => $monthName,
                    'total' => $row->total,
                ];
            });

        $topMunicipalityReportedIncidentRawData = DB::table('reports AS r')
            ->join('users AS u', 'r.user_id', '=', 'u.id')
            ->select(
                DB::raw("strftime('%Y', r.created_at) AS year"),
                DB::raw('u.municipality AS municipality'),
                DB::raw("COUNT(*) AS total")
            )
            ->groupBy(
                DB::raw("strftime('%Y', r.created_at)"),
                DB::raw('u.municipality')
            )
            ->orderBy('year')
            ->orderBy('municipality')
            ->get()
            ->map(function ($row) {
                return [
                    'year' => $row->year,
                    'municipality' => $row->municipality,
                    'total' => $row->total,
                ];
            });

        $groupedReportedIncidentByYear = $reportedIncidentRawData->groupBy('year')->map(function ($items) {
            return $items->map(function ($item) {
                return [
                    'month' => $item['month_name'],
                    'total' => $item['total'],
                ];
            });
        });

        $groupedTopMunicipalityReportedIncidents = $topMunicipalityReportedIncidentRawData->groupBy('year')->map(function($items){
            return $items->map(function($item){
                return [
                    'municipality' => $item['municipality'],
                    'total'=> $item['total'],
                ];
            });
        });

        return Inertia::render('dashboard', [
            'reportedIncidents' => $reportedIncidents,
            'totalNoOfUser' => $totalNoOfUsers,
            'newUsersThisMonth' => $newUsersThisMonth,
            'totalNoOfIncidents' => $totalNoOfIncidents,
            'totalNoOfReportedIncidents' => $totalNoOfReportedIncidents,

            // grouped data
            'monthlyIncidentData' => $groupedReportedIncidentByYear,
            'topReportedMunicipality' => $groupedTopMunicipalityReportedIncidents
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
