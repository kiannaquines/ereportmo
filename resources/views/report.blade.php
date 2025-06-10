<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Report</title>
    @vite('resources/css/app.css')
</head>

<body class="text-gray-800 font-">

    <div class="max-w-6xl mx-auto bg-white rounded-2xl space-y-10">
        <div class="grid grid-cols-1">
            <div id="incident-per-municipality-chart" class="w-full"></div>
        </div>
        <div class="grid grid-cols-2">
            <div class="flex flex-col">
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
                            <td class="px-4 py-2 border text-right font-medium">245</td>
                        </tr>

                        <tr class="bg-gray-50">
                            <td class="px-4 py-2 border font-semibold" rowspan="4">Incident Types</td>
                            <td class="px-4 py-2 border">Theft</td>
                            <td class="px-4 py-2 border text-right">90</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Vandalism</td>
                            <td class="px-4 py-2 border text-right">55</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Accident</td>
                            <td class="px-4 py-2 border text-right">30</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Assault</td>
                            <td class="px-4 py-2 border text-right">24</td>
                        </tr>

                        <tr class="bg-gray-50">
                            <td class="px-4 py-2 border font-semibold" rowspan="4">Status</td>
                            <td class="px-4 py-2 border">Pending</td>
                            <td class="px-4 py-2 border text-right">75</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">In Progress</td>
                            <td class="px-4 py-2 border text-right">100</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Resolved</td>
                            <td class="px-4 py-2 border text-right">60</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Closed</td>
                            <td class="px-4 py-2 border text-right">10</td>
                        </tr>

                        <tr class="bg-gray-50">
                            <td class="px-4 py-2 border font-semibold" rowspan="3">Locations</td>
                            <td class="px-4 py-2 border">Downtown</td>
                            <td class="px-4 py-2 border text-right">85</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Westside</td>
                            <td class="px-4 py-2 border text-right">60</td>
                        </tr>
                        <tr>
                            <td class="px-4 py-2 border">Riverside</td>
                            <td class="px-4 py-2 border text-right">50</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex flex-col">
                <div id="status-chart" class="w-full"></div>
            </div>
        </div>
    </div>

    <!-- Highcharts -->
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script>
        Highcharts.chart('status-chart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Incident Status Distribution'
            },
            subtitle: {
                text: "Incident status distribution as of {{ date('F d, Y') }}"
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom',
                layout: 'horizontal'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                    },
                    showInLegend: true,
                },
                series: {
                    animation: false
                }
            },
            series: [{
                name: 'Status',
                colorByPoint: true,
                data: [{
                    name: 'New',
                    y: 45.77,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Pending',
                    y: 23.82
                }, {
                    name: 'Assigned',
                    y: 23.63
                }, {
                    name: 'Close',
                    y: 1.44
                }, {
                    name: 'Resolve',
                    y: 1.02
                }, ]
            }]
        });

        Highcharts.chart('incident-per-municipality-chart', {
            chart: {
                type: 'column',
            },
            title: {
                text: 'Top Highest Incidents per Municipality'
            },
            subtitle: {
                text: 'Top 5 municipalities with the highest number of incidents'
            },
            xAxis: {
                categories: ['Matalam', 'Kabacan', 'Mlang', 'Makilala', 'Libungan'],
                crosshair: false,
                lineWidth: 0,
                tickWidth: 0,
                accessibility: {

                    description: 'Municipalities'
                }
            },
            yAxis: {
                min: 0,
                margin: 0,
                title: {
                    text: 'No. of incidents'
                }
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
                    name: 'January',
                    data: [100, 120, 129, 65, 12]
                },
                {
                    name: 'February',
                    data: [34, 23, 54, 12, 23]
                },
                {
                    name: 'March',
                    data: [34, 23, 54, 12, 23]
                },
            ]
        });
    </script>

</body>

</html>