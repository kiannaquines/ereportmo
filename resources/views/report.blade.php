<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Summary Data</title>
    @vite('resources/css/app.css')
</head>

<body class="text-gray-800 font-">

    <div class="max-w-6xl mx-auto bg-white rounded-2xl space-y-10">
        <div class="grid grid-cols-1">
            <div id="incident-per-municipality-chart" class="w-full"></div>
        </div>
        <div class="grid grid-cols-2">
            <div class="flex flex-col">
                <div id="status-chart" class="w-full"></div>
            </div>
            <div class="flex flex-col">
                <div id="all-year-data" class="w-full"></div>
            </div>
        </div>
        @pageBreak
        <div class="grid grid-cols-1">
            <h2 class="text-xl font-semibold">Summary Table</h2>
            <p class="text-sm text-muted-foreground mb-2">
                Incident summary data as of {{ date('F d, Y') }}
            </p>
            <table class="min-w-full table-auto border-collapse">
                <thead>
                    <tr class="bg-gray-50 text-left">
                        <th class="px-4 py-2 border">Category</th>
                        <th class="px-4 py-2 border">Label</th>
                        <th class="px-4 py-2 border text-right">Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="px-4 py-2 border">Total Reports</td>
                        <td class="px-4 py-2 border">All Incidents</td>
                        <td class="px-4 py-2 border text-right font-medium">{{ $overallreport }}</td>
                    </tr>

                    @foreach ($groupedIncidentTypes as $index => $incident)
                        <tr class="{{ $index === 0 ? 'bg-gray-50' : '' }}">
                            @if ($index === 0)
                                <td class="px-4 py-2 border font-semibold text-center" rowspan="{{ count($groupedIncidentTypes) }}">
                                    Incident Types
                                </td>
                            @endif
                            <td class="px-4 py-2 border">{{ $incident['incident'] }}</td>
                            <td class="px-4 py-2 border text-right">{{ $incident['total'] }}</td>
                        </tr>
                    @endforeach


                    @foreach ($statusSummaryTable as $index => $status)
                        <tr class="{{ $index === 0 ? 'bg-gray-50' : '' }}">
                            @if ($index === 0)
                                <td class="px-4 py-2 border font-semibold text-center" rowspan="{{ count($statusSummaryTable) }}">
                                Status
                                </td>
                            @endif
                            <td class="px-4 py-2 border">{{ $status['status'] }}</td>
                            <td class="px-4 py-2 border text-right">{{ $status['total'] }}</td>
                        </tr>
                    @endforeach

                    @foreach ($locationSummaryTable as $index => $location)
                        <tr class="{{ $index === 0 ? 'bg-gray-50' : '' }}">
                            @if ($index === 0)
                                <td class="px-4 py-2 border font-semibold text-center" rowspan="{{ count($locationSummaryTable) }}">
                                Locations
                                </td>
                            @endif
                            <td class="px-4 py-2 border">{{ $location['municipality'] }}</td>
                            <td class="px-4 py-2 border text-right">{{ $location['total'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script>
        Highcharts.chart('all-year-data', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'All-Time Incident Reports'
            },
            subtitle: {
                text: 'All incidents grouped by municipality'
            },
            xAxis: {
                categories: @json(collect($alltimedata)->pluck('municipality')),
                title: {
                    text: null
                },
                lineWidth: 0,
                tickWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of Reports'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                enabled: true
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                },
                series: {
                    animation: false
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'Reports',
                data: @json(collect($alltimedata)->pluck('total'))
            }]
        });


        Highcharts.chart('status-chart', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Incident Status Distribution'
            },
            subtitle: {
                text: 'Incident status as of {{ date("F d, Y") }}'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '{point.y}'
                    },
                    showInLegend: true
                },
                series: {
                    animation: false
                }
            },
            tooltip: {
                enabled: true
            },
            series: [{
                name: 'Status',
                colorByPoint: true,
                data: @json(
                    collect($incidentStatus)->map(fn($row) => [
                        'name' => $row['status'],
                        'y' => (int) $row['total']
                    ])
                )
            }]
        });

        Highcharts.chart('incident-per-municipality-chart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Top Highest Incidents per Municipality'
            },
            subtitle: {
                text: 'Top 10 municipalities with the highest number of incidents'
            },
            xAxis: {
                categories: @json(collect($topMunicipalitiesReportedIncidents)->pluck('municipality')),
                crosshair: false,
                lineWidth: 0,
                tickWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'No. of Incidents'
                }
            },
            tooltip: {
                enabled: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                series: {
                    animation: false
                }
            },
            series: [{
                name: 'Municipality',
                data: @json(collect($topMunicipalitiesReportedIncidents)->pluck('total'))
            }]
        });
    </script>

</body>

</html>