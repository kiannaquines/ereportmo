<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Summary Data</title>
    @vite('resources/css/app.css')
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {

            const chart1 = Highcharts.chart('all-year-data', {
                chart: { type: 'bar', animation: false },
                title: { text: 'All-Time Incident Reports' },
                subtitle: { text: 'All incidents grouped by municipality' },
                xAxis: {
                    categories: @json(collect($alltimedata)->pluck('municipality')),
                    lineWidth: 0,
                    tickWidth: 0
                },
                yAxis: { min: 0, title: { text: 'Number of Reports' } },
                plotOptions: {
                    series: { animation: false, states: { hover: { enabled: false } }, enableMouseTracking: false },
                    bar: { dataLabels: { enabled: true }, animation: false, states: { hover: { enabled: false } } }
                },
                legend: { enabled: false },
                series: [{
                    name: 'Reports',
                    data: @json(collect($alltimedata)->pluck('total')),
                    animation: false
                }],
                credits: { enabled: false }
            });

            // Export chart as PNG and store it in hidden input
            chart1.exportChartLocal(
                { type: 'image/png' },
                null,
                function (chart) {
                    const svg = chart.getSVGForLocalExport();
                    document.getElementById('all-year-data-image').value = btoa(svg); // base64 encode
                }
            );


           >
                document.addEventListener('DOMContentLoaded', () => {

                    const statusChart = Highcharts.chart('status-chart', {
                        chart: {
                            type: 'pie',
                            animation: false,
                            events: {
                                load: function () {
                                    this.series.forEach(s => s.update({ animation: false }, false));
                                }
                            }
                        },
                        title: { text: 'Incident Status Distribution' },
                        subtitle: { text: 'Incident status as of {{ date("F d, Y") }}' },
                        plotOptions: {
                            pie: {
                                animation: false,
                                states: { hover: { enabled: false } },
                                dataLabels: { enabled: true, format: '{point.y}' },
                                enableMouseTracking: false
                            },
                            series: {
                                animation: false,
                                states: { hover: { enabled: false } },
                                enableMouseTracking: false
                            }
                        },
                        series: [{
                            name: 'Status',
                            colorByPoint: true,
                            data: @json(collect($incidentStatus)->map(fn($row) => ['name' => $row['status'], 'y' => (int) $row['total']])),
                            animation: false
                        }],
                        credits: { enabled: false },
                    });

                    // Export pie chart to hidden input
                    statusChart.exportChartLocal({ type: 'image/png' }, null, function (chart) {
                        const svg = chart.getSVGForLocalExport();
                        document.getElementById('status-chart-image').value = btoa(svg);
                    });



                    const chart2 = Highcharts.chart('incident-per-municipality-chart', {
                        chart: {
                            type: 'column',
                            animation: false,
                        },
                        title: { text: 'Top Highest Incidents per Municipality' },
                        subtitle: { text: 'Top 10 municipalities with the highest number of incidents' },
                        xAxis: {
                            categories: @json(collect($topMunicipalitiesReportedIncidents)->pluck('municipality')),
                            lineWidth: 0,
                            tickWidth: 0
                        },
                        yAxis: { min: 0, title: { text: 'No. of Incidents' } },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2,
                                borderWidth: 0,
                                animation: false,
                                states: { hover: { enabled: false } }
                            },
                            series: {
                                animation: false,
                                states: { hover: { enabled: false } },
                                enableMouseTracking: false
                            }
                        },
                        series: [{
                            name: 'Municipality',
                            data: @json(collect($topMunicipalitiesReportedIncidents)->pluck('total')),
                            animation: false
                        }],
                        credits: { enabled: false }
                    });

                    // Export chart as PNG and store it in hidden input
                    chart2.exportChartLocal({ type: 'image/png' }, null, function (chart) {
                        const svg = chart.getSVGForLocalExport();
                        document.getElementById('incident-per-municipality-image').value = btoa(svg); // base64 encode
                    });


                    // Monthly Reports Chart
                    const monthlyChart = Highcharts.chart('monthly-reports-chart', {
                        chart: { type: 'line', animation: false },
                        title: { text: null },
                        xAxis: { categories: @json($monthlyReports->pluck('month')) },
                        yAxis: { title: { text: 'Reports' } },
                        plotOptions: {
                            line: { animation: false, states: { hover: { enabled: false } } },
                            series: { animation: false, enableMouseTracking: false }
                        },
                        series: [{
                            name: 'Reports',
                            data: @json($monthlyReports->pluck('total')),
                            animation: false
                        }],
                        tooltip: { enabled: false },
                        credits: { enabled: false }
                    });

                    // Export Monthly Chart to hidden input
                    monthlyChart.exportChartLocal({ type: 'image/png' }, null, function (chart) {
                        const svg = chart.getSVGForLocalExport();
                        document.getElementById('monthly-reports-image').value = btoa(svg);
                    });

                    // Weekly Reports Chart
                    const weeklyChart = Highcharts.chart('weekly-reports-chart', {
                        chart: { type: 'line', animation: false },
                        title: { text: null },
                        xAxis: { categories: @json($weeklyReports->pluck('week')) },
                        yAxis: { title: { text: 'Reports' } },
                        plotOptions: {
                            line: { animation: false, states: { hover: { enabled: false } } },
                            series: { animation: false, enableMouseTracking: false }
                        },
                        series: [{
                            name: 'Reports',
                            data: @json($weeklyReports->pluck('total')),
                            animation: false
                        }],
                        tooltip: { enabled: false },
                        credits: { enabled: false }
                    });

                    // Export Weekly Chart to hidden input
                    weeklyChart.exportChartLocal({ type: 'image/png' }, null, function (chart) {
                        const svg = chart.getSVGForLocalExport();
                        document.getElementById('weekly-reports-image').value = btoa(svg);
                    });

                    // Top Municipality per Month (Bar)
                    Highcharts.chart('top-municipality-monthly-chart', {
                        chart: { type: 'bar', animation: false },
                        title: { text: null },
                        xAxis: { categories: @json($topMunicipalityMonthly->pluck('month')) },
                        yAxis: { title: { text: 'Reports' } },
                        plotOptions: {
                            bar: { animation: false, states: { hover: { enabled: false } } },
                            series: { animation: false, enableMouseTracking: false }
                        },
                        series: [{
                            name: 'Reports',
                            data: @json($topMunicipalityMonthly->pluck('total')),
                            animation: false
                        }],
                        tooltip: { enabled: false },
                        credits: { enabled: false }
                    });

                    // Top Municipality per Week (Bar)
                    Highcharts.chart('top-municipality-weekly-chart', {
                        chart: { type: 'bar', animation: false },
                        title: { text: null },
                        xAxis: { categories: @json($topMunicipalityWeekly->pluck('week')) },
                        yAxis: { title: { text: 'Reports' } },
                        plotOptions: {
                            bar: { animation: false, states: { hover: { enabled: false } } },
                            series: { animation: false, enableMouseTracking: false }
                        },
                        series: [{
                            name: 'Reports',
                            data: @json($topMunicipalityWeekly->pluck('total')),
                            animation: false
                        }],
                        tooltip: { enabled: false },
                        credits: { enabled: false }
                    });


                });
    </script>
</head>

<body class="text-gray-800 font-sans">

    <div class="max-w-6xl mx-auto bg-white rounded-2xl p-6" id="yatiti">

        <!-- OLD CHARTS -->
        <div class="grid grid-cols-1 gap-6 w-full">
            <div id="incident-per-municipality-chart" class="w-full"></div>
        </div>

        <div class="grid grid-cols-1 gap-6 w-full">
            <div id="status-chart" class="w-full"></div>
            <div id="all-year-data" class="w-full"></div>
        </div>

        <!-- DATE-FILTERED CHARTS -->
        <div class="grid grid-cols-1 gap-6 w-full">
            <div class="border rounded p-4 bg-gray-50 w-full">
                <h3 class="text-lg font-semibold">Monthly Reports</h3>
                <p class="text-sm text-muted-foreground mb-2">
                    {{ $date_from ? \Carbon\Carbon::parse($date_from)->format('M d, Y') : 'All time' }}
                    – {{ $date_to ? \Carbon\Carbon::parse($date_to)->format('M d, Y') : 'All time' }}
                </p>
                <div id="monthly-reports-chart" class="w-full"></div>
            </div>

            <div class="border rounded p-4 bg-gray-50 w-full">
                <h3 class="text-lg font-semibold">Weekly Reports</h3>
                <p class="text-sm text-muted-foreground mb-2">Incidents per week</p>
                <div id="weekly-reports-chart" class="w-full"></div>
            </div>

            <div class="border rounded p-4 bg-gray-50 w-full">
                <h3 class="text-lg font-semibold">Top Municipality per Month</h3>
                <p class="text-sm text-muted-foreground mb-2">Highest reporter each month</p>
                <div id="top-municipality-monthly-chart" class="w-full"></div>
            </div>

            <div class="border rounded p-4 bg-gray-50 w-full">
                <h3 class="text-lg font-semibold">Top Municipality per Week</h3>
                <p class="text-sm text-muted-foreground mb-2">Highest reporter each week</p>
                <div id="top-municipality-weekly-chart" class="w-full"></div>
            </div>
        </div>


        <!-- SUMMARY TABLE -->
        <div class="grid grid-cols-1 mt-3">
            <h2 class="text-xl font-semibold">Summary Table</h2>
            <p class="text-sm text-muted-foreground mb-2">
                Incident summary data as of {{ now()->format('F d, Y') }}
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
                                <td class="px-4 py-2 border font-semibold text-center"
                                    rowspan="{{ count($groupedIncidentTypes) }}">Incident Types</td>
                            @endif
                            <td class="px-4 py-2 border">{{ $incident['incident'] }}</td>
                            <td class="px-4 py-2 border text-right">{{ $incident['total'] }}</td>
                        </tr>
                    @endforeach
                    @foreach ($statusSummaryTable as $index => $status)
                        <tr class="{{ $index === 0 ? 'bg-gray-50' : '' }}">
                            @if ($index === 0)
                                <td class="px-4 py-2 border font-semibold text-center"
                                    rowspan="{{ count($statusSummaryTable) }}">Status</td>
                            @endif
                            <td class="px-4 py-2 border">{{ $status['status'] }}</td>
                            <td class="px-4 py-2 border text-right">{{ $status['total'] }}</td>
                        </tr>
                    @endforeach
                    @foreach ($locationSummaryTable as $index => $location)
                        <tr class="{{ $index === 0 ? 'bg-gray-50' : '' }}">
                            @if ($index === 0)
                                <td class="px-4 py-2 border font-semibold text-center"
                                    rowspan="{{ count($locationSummaryTable) }}">Locations</td>
                            @endif
                            <td class="px-4 py-2 border">{{ $location['municipality'] }}</td>
                            <td class="px-4 py-2 border text-right">{{ $location['total'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

</body>

</html>