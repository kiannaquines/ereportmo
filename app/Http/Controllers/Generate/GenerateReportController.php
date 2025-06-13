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
    private function getLocation($latitude, $longitude)
    {
        $response = Http::withHeaders([
            'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept' => 'application/json',
            'Accept-Language' => 'en-US,en;q=0.9',
            'Accept-Encoding' => 'gzip, deflate, br',
            'Connection' => 'keep-alive',
            'Referer' => 'https://nominatim.openstreetmap.org/',
            'Origin' => 'https://nominatim.openstreetmap.org',
            'Cache-Control' => 'no-cache',
            'Pragma' => 'no-cache',
            'TE' => 'trailers',
            'DNT' => '1',
            'Upgrade-Insecure-Requests' => '1',
            'Sec-Fetch-Dest' => 'document',
            'Sec-Fetch-Mode' => 'navigate',
            'Sec-Fetch-Site' => 'none',
        ])->get('https://nominatim.openstreetmap.org/reverse', [
            'format' => 'json',
            'lat' => $latitude,
            'lon' => $longitude,
            'zoom' => 18,
            'addressdetails' => 1
        ]);
        return $response->json()['address'];
    }

    private function queries()
    {
        $topMunicipalitiesReportedIncidents = DB::table('reports AS r')
            ->join('users AS u', 'r.user_id', '=', 'u.id')
            ->select(
                DB::raw('u.municipality AS municipality'),
                DB::raw('COUNT(*) AS total')
            )
            ->groupBy(
                DB::raw('u.municipality')
            )
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


        $incidentStatus = DB::table('reports AS r')
            ->select(
                DB::raw('r.incident_response_status AS status'),
                DB::raw('COUNT(*) AS total')
            )->groupBy(DB::raw('r.incident_response_status'))
            ->orderBy('status')
            ->get()
            ->map(function ($row) {
                return [
                    'status' => $row->status,
                    'total' => $row->total
                ];
            });

        $allTimeIncidentReport = DB::table('reports AS r')
            ->join('users AS u', 'r.user_id', '=', 'u.id')
            ->select(
                DB::raw('u.municipality AS municipality'),
                DB::raw('COUNT(*) AS total')
            )->groupBy(
                DB::raw('u.municipality')
            )->orderBy(
                DB::raw('municipality')
            )->get()
            ->map(function ($row) {
                return [
                    'municipality' => $row->municipality,
                    'total' => $row->total
                ];
            });
        
        //  total number of incident reported summary table
        $totalIncidentReported = Report::count();
        
        // incident total per incident type summary table
        $groupedIncidentTypes = DB::table('reports as r')
        ->join('incidents as i', 'r.incident_id', '=', 'i.id')
        ->select(
            DB::raw('i.incident as incident'),
            DB::raw('COUNT(*) AS total')
        )->groupBy(
            DB::raw('i.incident')
        )->orderBy('incident')
        ->orderBy('total')->get()->map(function($row) {
            return [
                'incident' => $row->incident,
                'total' => $row->total,
            ];
        });

        // status section in the summary table
        $statusSummaryTable = DB::table('reports AS r')
        ->select(
            DB::raw('r.incident_response_status AS status'),
            DB::raw('COUNT(*) AS total')
        )->groupBy(
            DB::raw('r.incident_response_status')
        )->orderBy('status')->orderBy('status')->get()->map(function($row){
            return [
                'status' => $row->status,
                'total' => $row->total
            ];
        });

        $locationSummaryTable = DB::table('reports AS r')
        ->join('users AS u','r.user_id','=','u.id')
        ->select(DB::raw('u.municipality AS municipality'),DB::raw('COUNT(*) AS total'))->groupBy(DB::raw('u.municipality'))
        ->orderBy('municipality')
        ->get()->map(function($row) {
            return [
                'municipality' => $row->municipality,
                'total' => $row->total,
            ];
        });

        return [
            'locationSummaryTable' => $locationSummaryTable,
            'statusSummaryTable' => $statusSummaryTable,
            'groupedIncidentTypes' => $groupedIncidentTypes,
            'overallreport' => $totalIncidentReported,
            'alltimedata' => $allTimeIncidentReport,
            'incidentStatus' => $incidentStatus,
            'topMunicipalitiesReportedIncidents' => $topMunicipalitiesReportedIncidents
        ];
    }

    public function generateIncidentReportVisualize(Request $request)
    {
        $queries = $this->queries();

        return view('report', [
            'locationSummaryTable' => $queries['locationSummaryTable'],
            'statusSummaryTable' => $queries['statusSummaryTable'],
            'groupedIncidentTypes' => $queries['groupedIncidentTypes'],
            'overallreport' => $queries['overallreport'],
            'alltimedata' => $queries['alltimedata'],
            'incidentStatus' => $queries['incidentStatus'],
            'topMunicipalitiesReportedIncidents' => $queries['topMunicipalitiesReportedIncidents'],
        ]);
    }

    public function generateIncidentReportExportData(Request $request)
    {
        $queries = $this->queries();

        $template = view('report', [
            'locationSummaryTable' => $queries['locationSummaryTable'],
            'statusSummaryTable' => $queries['statusSummaryTable'],
            'groupedIncidentTypes' => $queries['groupedIncidentTypes'],
            'overallreport' => $queries['overallreport'],
            'alltimedata' => $queries['alltimedata'],
            'incidentStatus' => $queries['incidentStatus'],
            'topMunicipalitiesReportedIncidents' => $queries['topMunicipalitiesReportedIncidents'],
        ])->render();

        Browsershot::html(html: $template)->format('A4')->margins(top: 5, right: 5, bottom: 5, left: 5)->showBackground()->save(targetPath: storage_path(path:'app/reports/report.pdf'));
        return response()->download(file: storage_path(path: 'app/reports/report.pdf'));
    }
}
