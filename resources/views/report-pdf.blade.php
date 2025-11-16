<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Incident Report Summary</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            margin: 20px;
        }
        h1 {
            font-size: 20px;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        h3 {
            font-size: 14px;
            margin-top: 15px;
            margin-bottom: 8px;
        }
        .chart-container {
            margin: 20px 0;
            page-break-inside: avoid;
        }
        .chart-container img {
            max-width: 100%;
            height: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        table th {
            background-color: #f9fafb;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <h1>Incident Report Summary</h1>
    <p>Generated on: {{ now()->format('F d, Y h:i A') }}</p>
    @if($date_from && $date_to)
        <p>Period: {{ \Carbon\Carbon::parse($date_from)->format('M d, Y') }} - {{ \Carbon\Carbon::parse($date_to)->format('M d, Y') }}</p>
    @else
        <p>Period: All Time</p>
    @endif

    <!-- Chart 1: All-Time Incident Reports -->
    <div class="chart-container">
        <h2>All-Time Incident Reports by Municipality</h2>
        <img src="{{ $chart1Url }}" alt="All-Time Incident Reports">
    </div>

    <!-- Chart 2: Incident Status Distribution -->
    <div class="chart-container">
        <h2>Incident Status Distribution</h2>
        <p style="font-size: 11px;">Status as of {{ date('F d, Y') }}</p>
        <img src="{{ $chart2Url }}" alt="Incident Status Distribution">
    </div>

    <div class="page-break"></div>

    <!-- Chart 3: Top Incidents per Municipality -->
    <div class="chart-container">
        <h2>Top Highest Incidents per Municipality</h2>
        <p style="font-size: 11px;">Top 10 municipalities with the highest number of incidents</p>
        <img src="{{ $chart3Url }}" alt="Top Incidents per Municipality">
    </div>

    <!-- Chart 4: Monthly Reports -->
    <div class="chart-container">
        <h2>Monthly Reports</h2>
        <p style="font-size: 11px;">
            {{ $date_from ? \Carbon\Carbon::parse($date_from)->format('M d, Y') : 'All time' }}
            – {{ $date_to ? \Carbon\Carbon::parse($date_to)->format('M d, Y') : 'All time' }}
        </p>
        <img src="{{ $chart4Url }}" alt="Monthly Reports">
    </div>

    <div class="page-break"></div>

    <!-- Chart 5: Weekly Reports -->
    <div class="chart-container">
        <h2>Weekly Reports</h2>
        <p style="font-size: 11px;">Incidents per week</p>
        <img src="{{ $chart5Url }}" alt="Weekly Reports">
    </div>

    <!-- Chart 6: Top Municipality per Month -->
    <div class="chart-container">
        <h2>Top Municipality per Month</h2>
        <p style="font-size: 11px;">Highest reporter each month</p>
        <img src="{{ $chart6Url }}" alt="Top Municipality Monthly">
    </div>

    <div class="page-break"></div>

    <!-- Chart 7: Top Municipality per Week -->
    <div class="chart-container">
        <h2>Top Municipality per Week</h2>
        <p style="font-size: 11px;">Highest reporter each week</p>
        <img src="{{ $chart7Url }}" alt="Top Municipality Weekly">
    </div>

    <!-- Summary Table -->
    <div class="chart-container">
        <h2>Summary Table</h2>
        <p style="font-size: 11px;">Incident summary data as of {{ now()->format('F d, Y') }}</p>
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Label</th>
                    <th class="text-right">Count</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Total Reports</td>
                    <td>All Incidents</td>
                    <td class="text-right">{{ $overallreport }}</td>
                </tr>
                @foreach ($groupedIncidentTypes as $index => $incident)
                    <tr>
                        @if ($index === 0)
                            <td rowspan="{{ count($groupedIncidentTypes) }}" class="text-center" style="font-weight: bold;">Incident Types</td>
                        @endif
                        <td>{{ $incident['incident'] }}</td>
                        <td class="text-right">{{ $incident['total'] }}</td>
                    </tr>
                @endforeach
                @foreach ($statusSummaryTable as $index => $status)
                    <tr>
                        @if ($index === 0)
                            <td rowspan="{{ count($statusSummaryTable) }}" class="text-center" style="font-weight: bold;">Status</td>
                        @endif
                        <td>{{ $status['status'] }}</td>
                        <td class="text-right">{{ $status['total'] }}</td>
                    </tr>
                @endforeach
                @foreach ($locationSummaryTable as $index => $location)
                    <tr>
                        @if ($index === 0)
                            <td rowspan="{{ count($locationSummaryTable) }}" class="text-center" style="font-weight: bold;">Locations</td>
                        @endif
                        <td>{{ $location['municipality'] }}</td>
                        <td class="text-right">{{ $location['total'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>
