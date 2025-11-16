<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Report;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use DateTime;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $selectedYear = $request->input('year', Report::max(DB::raw('YEAR(created_at)')));
        $selectedPeriod = $request->input('period', 'all'); // 'all', 'weekly', 'monthly'
        
        // Check user's role - Admin users should see ALL data regardless of office
        $userRole = Role::find($user->role);
        $isAdmin = $userRole && $userRole->role === 'admin';
        
        // Check if user has specific office (PNP, MDRRMO, MSWDO) and is NOT admin
        $userOffice = $user->office;
        $isOfficeUser = !$isAdmin && $userOffice && in_array($userOffice->office, ['PNP', 'MDRRMO', 'MSWDO (VAWC)']);
        
        // Base queries with office filtering if applicable
        $baseUserQuery = User::query();
        $baseReportQuery = Report::query();
        $baseIncidentQuery = Incident::query();
        
        // Apply office filtering ONLY for non-admin office users
        if ($isOfficeUser) {
            $baseReportQuery->whereHas('incident', function($q) use ($userOffice) {
                $q->where('office_id', $userOffice->id);
            });
            $baseIncidentQuery->where('office_id', $userOffice->id);
            
            // Also filter by user's municipality if they have one
            if ($user->municipality) {
                $baseReportQuery->whereHas('user', function($q) use ($user) {
                    $q->where('municipality', $user->municipality);
                });
                
                // Filter users by municipality for non-admin office users
                $baseUserQuery->where('municipality', $user->municipality);
            }
        }
        
        // $selectedYear = $request->input('year', now()->year)
        // Cards statistics now filtered based on user role
        $totalNoOfUsers = (clone $baseUserQuery)->count();
        $newUsersThisMonth = (clone $baseUserQuery)->whereMonth('created_at', Carbon::now()->month)->count();

        $totalNoOfIncidents = (clone $baseIncidentQuery)->count();
        $totalNoOfReportedIncidents = (clone $baseReportQuery)->count();

        // Filtered counts based on period
        $periodFilteredUsers = clone $baseUserQuery;
        $periodFilteredReports = clone $baseReportQuery;
        
        if ($selectedPeriod === 'weekly') {
            $periodFilteredUsers->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
            $periodFilteredReports->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        } elseif ($selectedPeriod === 'monthly') {
            $periodFilteredUsers->whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year);
            $periodFilteredReports->whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year);
        }
        
        $periodTotalUsers = $periodFilteredUsers->count();
        $periodTotalReports = $periodFilteredReports->count();

        $reportedIncidentsQuery = (clone $baseReportQuery)->with('incident', 'user')
            ->whereDate('created_at', Carbon::today());
            
        $reportedIncidents = $reportedIncidentsQuery->get()
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

        $reportedIncidentRawDataQuery = DB::table('reports');
        if ($isOfficeUser) {
            $reportedIncidentRawDataQuery->join('incidents', 'reports.incident_id', '=', 'incidents.id')
                ->where('incidents.office_id', $userOffice->id);
            if ($user->municipality) {
                $reportedIncidentRawDataQuery->join('users', 'reports.user_id', '=', 'users.id')
                    ->where('users.municipality', $user->municipality);
            }
        }
        
        $reportedIncidentRawData = $reportedIncidentRawDataQuery
            ->select(
                DB::raw("YEAR(reports.created_at) as year"),
                DB::raw("MONTH(reports.created_at) as month"),
                DB::raw("COUNT(*) as total")
            )
            ->groupBy(
                DB::raw("YEAR(reports.created_at)"),
                DB::raw("MONTH(reports.created_at)")
            )
            ->orderBy(DB::raw("YEAR(reports.created_at)"), 'desc')
            ->orderBy(DB::raw("MONTH(reports.created_at)"), 'asc')
            ->get()
            ->map(function ($row) {
                $monthName = DateTime::createFromFormat('!m', $row->month)->format('F');
                return [
                    'year' => $row->year,
                    'month_name' => $monthName,
                    'total' => $row->total,
                ];
            });

        $topMunicipalityQuery = DB::table('reports AS r')
            ->join('users AS u', 'r.user_id', '=', 'u.id');
        
        if ($isOfficeUser) {
            $topMunicipalityQuery->join('incidents AS i', 'r.incident_id', '=', 'i.id')
                ->where('i.office_id', $userOffice->id);
            if ($user->municipality) {
                $topMunicipalityQuery->where('u.municipality', $user->municipality);
            }
        }
        
        $topMunicipalityReportedIncidentRawData = $topMunicipalityQuery
            ->select(
                DB::raw("YEAR(r.created_at) AS year"),
                DB::raw('u.municipality AS municipality'),
                DB::raw("COUNT(*) AS total")
            )
            ->groupBy(
                DB::raw("YEAR(r.created_at)"),
                DB::raw('u.municipality')
            )
            ->orderBy(DB::raw("YEAR(r.created_at)"), 'asc')
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

        $groupedTopMunicipalityReportedIncidents = $topMunicipalityReportedIncidentRawData->groupBy('year')->map(function ($items) {
            return $items->map(function ($item) {
                return [
                    'municipality' => $item['municipality'],
                    'total' => $item['total'],
                ];
            });
        });

        // === Monthly Incidents ===
        $monthlyIncidentDataQuery = clone $baseReportQuery;
        $monthlyIncidentData = $monthlyIncidentDataQuery->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->whereYear('created_at', $selectedYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month' => Carbon::create()->month($row->month)->format('F'),
                'total' => $row->total,
            ]);

        // === Weekly Incidents ===
        $weeklyIncidentDataQuery = clone $baseReportQuery;
        $weeklyIncidentData = $weeklyIncidentDataQuery->selectRaw('WEEK(created_at, 1) as week, COUNT(*) as total')
            ->whereYear('created_at', $selectedYear)
            ->groupBy('week')
            ->orderBy('week')
            ->get()
            ->map(function ($row) use ($selectedYear) {
                $start = Carbon::now()->setISODate($selectedYear, $row->week)->startOfWeek();
                $end = $start->copy()->endOfWeek();
                return [
                    'week' => "Week {$row->week} ({$start->format('M d')} - {$end->format('M d')})",
                    'total' => $row->total,
                ];
            });

        // === Top Municipality Monthly ===
        $topMunicipalityMonthlyQuery = Report::join('users', 'reports.user_id', '=', 'users.id');
        if ($isOfficeUser) {
            $topMunicipalityMonthlyQuery->join('incidents', 'reports.incident_id', '=', 'incidents.id')
                ->where('incidents.office_id', $userOffice->id);
            if ($user->municipality) {
                $topMunicipalityMonthlyQuery->where('users.municipality', $user->municipality);
            }
        }
        
        $topMunicipalityMonthly = $topMunicipalityMonthlyQuery
            ->selectRaw('MONTH(reports.created_at) as month, users.municipality, COUNT(*) as total')
            ->whereYear('reports.created_at', $selectedYear)
            ->groupBy('month', 'users.municipality')
            ->get()
            ->groupBy('month')
            ->map(fn($group) => $group->sortByDesc('total')->first())
            ->map(function ($item) use ($selectedYear) {
                $monthName = Carbon::create()->month($item->month)->format('M'); // e.g. Jan, Feb
                $municipality = $item->municipality ?? 'Unknown';

                $label = "{$monthName}";

                return [
                    'month' => $label,
                    'municipality' => $municipality,
                    'total' => $item->total,
                    'month_number' => $item->month, 
                ];
            })
            ->sortBy('month_number')
            ->values();

        // === Top Municipality Weekly ===
        $topMunicipalityWeeklyQuery = Report::join('users', 'reports.user_id', '=', 'users.id');
        if ($isOfficeUser) {
            $topMunicipalityWeeklyQuery->join('incidents', 'reports.incident_id', '=', 'incidents.id')
                ->where('incidents.office_id', $userOffice->id);
            if ($user->municipality) {
                $topMunicipalityWeeklyQuery->where('users.municipality', $user->municipality);
            }
        }
        
        $topMunicipalityWeekly = $topMunicipalityWeeklyQuery
            ->selectRaw('WEEK(reports.created_at, 1) as week, users.municipality, COUNT(*) as total')
            ->whereYear('reports.created_at', $selectedYear)
            ->groupBy('week', 'users.municipality')
            ->get()
            ->groupBy('week')
            ->map(fn($group) => $group->sortByDesc('total')->first())
            ->map(function ($item) use ($selectedYear) {
                $start = Carbon::now()->setISODate($selectedYear, $item->week)->startOfWeek();
                $end = $start->copy()->endOfWeek();

                // Short label: W45 (Nov 03-09) – Cebu City
                $label = "W{$item->week} ({$start->format('M d')}-{$end->format('d')}) – {$item->municipality}";

                return [
                    'week' => $label,
                    'municipality' => $item->municipality ?? 'Unknown',
                    'total' => $item->total,
                ];
            })->values();

        // Available years
        $availableYearsQuery = clone $baseReportQuery;
        $availableYears = $availableYearsQuery->selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year');

        return Inertia::render('dashboard', [
            'reportedIncidents' => $reportedIncidents,
            'totalNoOfUser' => $totalNoOfUsers,
            'newUsersThisMonth' => $newUsersThisMonth,
            'totalNoOfIncidents' => $totalNoOfIncidents,
            'totalNoOfReportedIncidents' => $totalNoOfReportedIncidents,
            
            // Period filtered stats
            'periodTotalUsers' => $periodTotalUsers,
            'periodTotalReports' => $periodTotalReports,
            'selectedPeriod' => $selectedPeriod,
            
            // User office context
            'isAdmin' => $isAdmin,
            'userOffice' => $userOffice ? $userOffice->office : null,
            'userMunicipality' => $user->municipality,
            'isOfficeUser' => $isOfficeUser,

            // Old (all years)
            'monthlyIncidentData' => $groupedReportedIncidentByYear,
            'topReportedMunicipality' => $groupedTopMunicipalityReportedIncidents,

            // New (selected year)
            'monthIncidentData' => $monthlyIncidentData,
            'weeklyIncidentData' => $weeklyIncidentData,
            'topMunicipalityMonthly' => $topMunicipalityMonthly,
            'topMunicipalityWeekly' => $topMunicipalityWeekly,
            'selectedYear' => $selectedYear,
            'availableYears' => $availableYears,
        ]);
    }
}
