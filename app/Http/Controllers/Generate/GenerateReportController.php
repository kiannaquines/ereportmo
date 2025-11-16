<?php

namespace App\Http\Controllers\Generate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Spatie\Browsershot\Browsershot;
use Illuminate\Support\Facades\DB;
use App\Models\Report;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class GenerateReportController extends Controller
{
    private function queries($from = null, $to = null)
    {
        // Base query for reports with users and incidents
        $baseQuery = function ($query) use ($from, $to) {
            $query->from('reports AS r')
                ->join('users AS u', 'r.user_id', '=', 'u.id')
                ->join('incidents AS i', 'r.incident_id', '=', 'i.id');

            if ($from)
                $query->whereDate('r.created_at', '>=', $from);
            if ($to)
                $query->whereDate('r.created_at', '<=', $to);

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
        $incidentStatus = DB::table('reports AS r')
            ->select(
                DB::raw('r.incident_response_status AS status'),
                DB::raw('COUNT(*) AS total')
            )
            ->when($from, fn($q) => $q->whereDate('r.created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('r.created_at', '<=', $to))
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
        $totalIncidentReported = Report::when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to))
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
        $statusSummaryTable = DB::table('reports AS r')
            ->select(
                DB::raw('r.incident_response_status AS status'),
                DB::raw('COUNT(*) AS total')
            )
            ->when($from, fn($q) => $q->whereDate('r.created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('r.created_at', '<=', $to))
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
        $monthlyReports = DB::table('reports')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") AS ym, COUNT(*) AS total')
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to))
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
        $weeklyReports = DB::table('reports')
            ->selectRaw('YEARWEEK(created_at, 1) AS yw, COUNT(*) AS total')
            ->when($from, fn($q) => $q->whereDate('created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('created_at', '<=', $to))
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
        $topMunicipalityMonthly = DB::table('reports AS r')
            ->join('users AS u', 'r.user_id', '=', 'u.id')
            ->selectRaw('MONTH(r.created_at) AS m, u.municipality, COUNT(*) AS total')
            ->when($from, fn($q) => $q->whereDate('r.created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('r.created_at', '<=', $to))
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
        $topMunicipalityWeekly = DB::table('reports AS r')
            ->join('users AS u', 'r.user_id', '=', 'u.id')
            ->selectRaw('YEARWEEK(r.created_at, 1) AS yw, u.municipality, COUNT(*) AS total')
            ->when($from, fn($q) => $q->whereDate('r.created_at', '>=', $from))
            ->when($to, fn($q) => $q->whereDate('r.created_at', '<=', $to))
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

        $queries = $this->queries($from, $to); // Pass dates

        return view('report', $queries); // Pass all data directly
    }

    public function generateIncidentReportExportData(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $queries = $this->queries($from, $to); // Your filtered data
        $template = view('report', $queries)->render();

        Browsershot::html($template)
            ->noSandbox()
            ->setNodeBinary('/home/heist/.nvm/versions/node/v24.8.0/bin/node')
            ->setNpmBinary('/home/heist/.nvm/versions/node/v24.8.0/bin/npm')
            ->waitUntilNetworkIdle()
            ->evaluateBeforePrinting('
                // Wait for all 7 charts to be exported
                new Promise((resolve) => {
                    const checkReady = () => {
                        if (window.chartsReady === true) {
                            console.log("All charts ready for PDF generation");
                            resolve();
                        } else {
                            setTimeout(checkReady, 100);
                        }
                    };
                    checkReady();
                });
            ')
            ->timeout(120) // Increase timeout to 2 minutes
            ->format('A4')
            ->showBackground()
            ->save(storage_path('app/reports/report.pdf'));


        return response()->download(storage_path('app/reports/report.pdf'));
    }
}
