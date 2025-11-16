<?php

namespace App\Http\Controllers\Generate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;
use App\Models\Report;
use App\Models\Role;
use App\Models\User;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class GenerateReportController extends Controller
{
    private function queries($from = null, $to = null, $user = null)
    {
        // Determine user role and office filtering (same logic as DashboardController)
        $isAdmin = false;
        $userOffice = null;
        $isOfficeUser = false;
        
        if ($user) {
            $userRole = Role::find($user->role);
            $isAdmin = $userRole && $userRole->role === 'admin';
            $userOffice = $user->office;
            $isOfficeUser = !$isAdmin && $userOffice && in_array($userOffice->office, ['PNP', 'MDRRMO', 'MSWDO (VAWC)']);
        }

        // Base query for reports with users and incidents
        $baseQuery = function ($query) use ($from, $to, $isOfficeUser, $userOffice, $user) {
            $query->from('reports AS r')
                ->join('users AS u', 'r.user_id', '=', 'u.id')
                ->join('incidents AS i', 'r.incident_id', '=', 'i.id');

            if ($from)
                $query->whereDate('r.created_at', '>=', $from);
            if ($to)
                $query->whereDate('r.created_at', '<=', $to);

            // Apply office filtering for non-admin office users
            if ($isOfficeUser && $userOffice) {
                $query->where('i.office_id', $userOffice->id);
                
                // Also filter by municipality if user has one
                if ($user && $user->municipality) {
                    $query->where('u.municipality', $user->municipality);
                }
            }

            return $query;
        };

        // 1. Top 10 Municipalities with Most Incidents
        $topMunicipalitiesReportedIncidents = $baseQuery(DB::table('reports AS r'))
            ->select(
                DB::raw('u.municipality AS municipality'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(DB::raw('u.municipality'))
            ->orderBy('total', 'desc')
            ->orderBy('municipality')
            ->limit(10)
            ->get()
            ->map(function ($row) {
                return [
                    'municipality' => $row->municipality,
                    'total' => $row->total
                ];
            });

        // 2. Incident Status Distribution
        $incidentStatus = $baseQuery(DB::table('reports AS r'))
            ->select(
                DB::raw('r.incident_response_status AS status'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(DB::raw('r.incident_response_status'))
            ->orderBy('status')
            ->get()
            ->map(function ($row) {
                return [
                    'status' => $row->status,
                    'total' => $row->total
                ];
            });

        // 3. All-Time Incident Report by Municipality
        $allTimeIncidentReport = $baseQuery(DB::table('reports AS r'))
            ->select(
                DB::raw('u.municipality AS municipality'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(DB::raw('u.municipality'))
            ->orderBy(DB::raw('municipality'))
            ->get()
            ->map(function ($row) {
                return [
                    'municipality' => $row->municipality,
                    'total' => $row->total
                ];
            });

        // 4. Total number of incident reported
        $totalIncidentReported = $baseQuery(DB::table('reports as r'))
            ->count();

        // 5. Incident total per incident type
        $groupedIncidentTypes = $baseQuery(DB::table('reports as r'))
            ->select(
                DB::raw('i.incident as incident'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(DB::raw('i.incident'))
            ->orderBy('incident')
            ->orderBy('total')
            ->get()
            ->map(function ($row) {
                return [
                    'incident' => $row->incident,
                    'total' => $row->total,
                ];
            });

        // 6. Status section in summary table
        $statusSummaryTable = $baseQuery(DB::table('reports AS r'))
            ->select(
                DB::raw('r.incident_response_status AS status'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(DB::raw('r.incident_response_status'))
            ->orderBy('status')
            ->get()
            ->map(function ($row) {
                return [
                    'status' => $row->status,
                    'total' => $row->total
                ];
            });

        // 7. Location section in summary table
        $locationSummaryTable = $baseQuery(DB::table('reports AS r'))
            ->select(
                DB::raw('u.municipality AS municipality'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(DB::raw('u.municipality'))
            ->orderBy('municipality')
            ->get()
            ->map(function ($row) {
                return [
                    'municipality' => $row->municipality,
                    'total' => $row->total,
                ];
            });

        // === NEW CHARTS: Monthly, Weekly, Top per Month, Top per Week ===

        // 8. Monthly Reports (Line Chart)
        $monthlyReports = $baseQuery(DB::table('reports AS r'))
            ->selectRaw('DATE_FORMAT(r.created_at, "%Y-%m") AS ym, COUNT(*) AS total')
            ->groupBy('ym')
            ->orderBy('ym')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => \Carbon\Carbon::createFromFormat('Y-m', $row->ym)->format('M Y'),
                    'total' => (int) $row->total,
                ];
            });

        // 9. Weekly Reports (Line Chart)
        $weeklyReports = $baseQuery(DB::table('reports AS r'))
            ->selectRaw('YEARWEEK(r.created_at, 1) AS yw, COUNT(*) AS total')
            ->groupBy('yw')
            ->orderBy('yw')
            ->get()
            ->map(function ($row) {
                $year = substr($row->yw, 0, 4);
                $week = substr($row->yw, 4);
                $start = \Carbon\Carbon::now()->setISODate($year, $week)->startOfWeek();
                $end = $start->copy()->endOfWeek();
                return [
                    'week' => "W{$week} ({$start->format('M d')}-{$end->format('d')})",
                    'total' => (int) $row->total,
                ];
            });

        // 10. Top Municipality per Month (Bar Chart)
        $topMunicipalityMonthly = $baseQuery(DB::table('reports AS r'))
            ->selectRaw('MONTH(r.created_at) AS m, u.municipality, COUNT(*) AS total')
            ->groupBy('m', 'u.municipality')
            ->get()
            ->groupBy('m')
            ->map(fn($group) => $group->sortByDesc('total')->first())
            ->map(function ($row) {
                $month = \Carbon\Carbon::create()->month($row->m)->format('M');
                return [
                    'month' => "{$month} – {$row->municipality}",
                    'municipality' => $row->municipality,
                    'total' => $row->total,
                ];
            })
            ->sortBy(fn($item) => $item['m'] ?? 0)
            ->values();

        // 11. Top Municipality per Week (Bar Chart)
        $topMunicipalityWeekly = $baseQuery(DB::table('reports AS r'))
            ->selectRaw('YEARWEEK(r.created_at, 1) AS yw, u.municipality, COUNT(*) AS total')
            ->groupBy('yw', 'u.municipality')
            ->get()
            ->groupBy('yw')
            ->map(fn($group) => $group->sortByDesc('total')->first())
            ->map(function ($row) {
                $year = substr($row->yw, 0, 4);
                $week = substr($row->yw, 4);
                $start = \Carbon\Carbon::now()->setISODate($year, $week)->startOfWeek();
                $end = $start->copy()->endOfWeek();
                return [
                    'week' => "W{$week} ({$start->format('M d')}-{$end->format('d')}) – {$row->municipality}",
                    'municipality' => $row->municipality,
                    'total' => $row->total,
                ];
            })
            ->sortBy('yw')
            ->values();

        // === RETURN ALL ===
        return [
            'locationSummaryTable' => $locationSummaryTable,
            'statusSummaryTable' => $statusSummaryTable,
            'groupedIncidentTypes' => $groupedIncidentTypes,
            'overallreport' => $totalIncidentReported,
            'alltimedata' => $allTimeIncidentReport,
            'incidentStatus' => $incidentStatus,
            'topMunicipalitiesReportedIncidents' => $topMunicipalitiesReportedIncidents,

            // New Charts
            'monthlyReports' => $monthlyReports,
            'weeklyReports' => $weeklyReports,
            'topMunicipalityMonthly' => $topMunicipalityMonthly,
            'topMunicipalityWeekly' => $topMunicipalityWeekly,

            // For subtitles in Blade
            'date_from' => $from,
            'date_to' => $to,
        ];
    }

    public function generateIncidentReportVisualize(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $user = $request->user(); // Get authenticated user

        $queries = $this->queries($from, $to, $user); // Pass user for filtering

        return view('report', $queries); // Pass all data directly
    }

    public function generateIncidentReportExportData(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $user = $request->user(); // Get authenticated user

        $queries = $this->queries($from, $to, $user); // Pass user for filtering
        
        // Generate chart URLs using QuickChart.io (free Highcharts-compatible API)
        $chartUrls = $this->generateChartUrls($queries);
        
        // Add user context info (similar to dashboard)
        $userRole = Role::find($user->role);
        $isAdmin = $userRole && $userRole->role === 'admin';
        $userOffice = $user->office;
        
        // Merge chart URLs with query data
        $data = array_merge($queries, $chartUrls, [
            'date_from' => $from,
            'date_to' => $to,
            'generated_by' => $user->name,
            'user_role' => $userRole ? $userRole->role : 'User',
            'is_admin' => $isAdmin,
            'user_office' => $userOffice ? $userOffice->office : null,
            'user_municipality' => $user->municipality,
        ]);

        // Generate PDF using DomPDF (no Browsershot needed!)
        $pdf = Pdf::loadView('report-pdf', $data)
            ->setPaper('a4', 'portrait')
            ->setOption('isHtml5ParserEnabled', true)
            ->setOption('isRemoteEnabled', true); // Allow external chart images

        return $pdf->download('incident-report-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Generate chart image URLs using QuickChart.io API
     */
    private function generateChartUrls($queries)
    {
        $baseUrl = 'https://quickchart.io/chart';

        // Chart 1: All-Time Bar Chart
        $chart1Config = [
            'type' => 'bar',
            'data' => [
                'labels' => collect($queries['alltimedata'])->pluck('municipality')->toArray(),
                'datasets' => [[
                    'label' => 'Reports',
                    'data' => collect($queries['alltimedata'])->pluck('total')->toArray(),
                    'backgroundColor' => '#3b82f6',
                ]]
            ],
            'options' => [
                'indexAxis' => 'y',
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'All-Time Incident Reports'
                    ],
                    'legend' => ['display' => false]
                ]
            ]
        ];

        // Chart 2: Pie Chart - Status Distribution
        $statusData = collect($queries['incidentStatus'])->map(fn($row) => ['name' => $row['status'], 'y' => (int) $row['total']]);
        $chart2Config = [
            'type' => 'pie',
            'data' => [
                'labels' => $statusData->pluck('name')->toArray(),
                'datasets' => [[
                    'data' => $statusData->pluck('y')->toArray(),
                    'backgroundColor' => ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Incident Status Distribution'
                    ]
                ]
            ]
        ];

        // Chart 3: Column Chart - Top Municipalities
        $chart3Config = [
            'type' => 'bar',
            'data' => [
                'labels' => collect($queries['topMunicipalitiesReportedIncidents'])->pluck('municipality')->toArray(),
                'datasets' => [[
                    'label' => 'Incidents',
                    'data' => collect($queries['topMunicipalitiesReportedIncidents'])->pluck('total')->toArray(),
                    'backgroundColor' => '#3b82f6',
                ]]
            ],
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Top 10 Municipalities'
                    ],
                    'legend' => ['display' => false]
                ]
            ]
        ];

        // Chart 4: Line Chart - Monthly Reports
        $chart4Config = [
            'type' => 'line',
            'data' => [
                'labels' => $queries['monthlyReports']->pluck('month')->toArray(),
                'datasets' => [[
                    'label' => 'Reports',
                    'data' => $queries['monthlyReports']->pluck('total')->toArray(),
                    'borderColor' => '#3b82f6',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'fill' => true,
                ]]
            ]
        ];

        // Chart 5: Line Chart - Weekly Reports
        $chart5Config = [
            'type' => 'line',
            'data' => [
                'labels' => $queries['weeklyReports']->pluck('week')->toArray(),
                'datasets' => [[
                    'label' => 'Reports',
                    'data' => $queries['weeklyReports']->pluck('total')->toArray(),
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                ]]
            ]
        ];

        // Chart 6: Bar Chart - Top Municipality Monthly
        $chart6Config = [
            'type' => 'bar',
            'data' => [
                'labels' => $queries['topMunicipalityMonthly']->pluck('month')->toArray(),
                'datasets' => [[
                    'label' => 'Reports',
                    'data' => $queries['topMunicipalityMonthly']->pluck('total')->toArray(),
                    'backgroundColor' => '#f59e0b',
                ]]
            ],
            'options' => [
                'indexAxis' => 'y',
                'plugins' => ['legend' => ['display' => false]]
            ]
        ];

        // Chart 7: Bar Chart - Top Municipality Weekly
        $chart7Config = [
            'type' => 'bar',
            'data' => [
                'labels' => $queries['topMunicipalityWeekly']->pluck('week')->toArray(),
                'datasets' => [[
                    'label' => 'Reports',
                    'data' => $queries['topMunicipalityWeekly']->pluck('total')->toArray(),
                    'backgroundColor' => '#8b5cf6',
                ]]
            ],
            'options' => [
                'indexAxis' => 'y',
                'plugins' => ['legend' => ['display' => false]]
            ]
        ];

        // Generate URLs
        return [
            'chart1Url' => $baseUrl . '?c=' . urlencode(json_encode($chart1Config)) . '&width=700&height=400',
            'chart2Url' => $baseUrl . '?c=' . urlencode(json_encode($chart2Config)) . '&width=500&height=400',
            'chart3Url' => $baseUrl . '?c=' . urlencode(json_encode($chart3Config)) . '&width=700&height=400',
            'chart4Url' => $baseUrl . '?c=' . urlencode(json_encode($chart4Config)) . '&width=700&height=300',
            'chart5Url' => $baseUrl . '?c=' . urlencode(json_encode($chart5Config)) . '&width=700&height=300',
            'chart6Url' => $baseUrl . '?c=' . urlencode(json_encode($chart6Config)) . '&width=700&height=300',
            'chart7Url' => $baseUrl . '?c=' . urlencode(json_encode($chart7Config)) . '&width=700&height=300',
        ];
    }
}
