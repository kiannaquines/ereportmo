<?php

namespace App\Http\Controllers\Generate;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Models\Report;
use Spatie\Browsershot\Browsershot;
use Spatie\LaravelPdf\Enums\Format;

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

    public function generateIncidentReportVisualize(Request $request)
    {
        return view('report');
    }

    public function generateIncidentReportExportData(Request $request)
    {
        $template = view('report')->render();
        Browsershot::html($template)->format('A4')->margins(4,4,4,4)->showBackground()->save(storage_path('app/reports/report.pdf'));
        return response()->download(storage_path('app/reports/report.pdf'));
    }
}
