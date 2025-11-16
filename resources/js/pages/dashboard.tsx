'use client';

import { Head, router, usePage } from '@inertiajs/react';
import { ArrowUpNarrowWide, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import DashboardCard from './card/dashboard-card';
import MonthlyIncidentsLineChart from './chart/monthly-incidents-linechart';
import MonthlyIncidentsBarChart from './chart/municipality-incidents-barchart';
import { getReportedIncidentsColumnsForDashboard } from './dashboard-reported-columns';
import DataTable from './datatable/datatable';

// New Charts
import TopMunicipalityMonthlyBar from '@/pages/chart/top-municipality-monthly-bar';
import TopMunicipalityWeeklyBar from '@/pages/chart/top-municipality-weekly-bar';
import WeeklyIncidentsLineChart from '@/pages/chart/weekly-incidents-linechart';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

type ReportedIncidentsProps = {
    id: string;
    incident: string;
    description: string;
    office: string;
    source: string;
    image: string;
    status: string;
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
    source_id: string;
    incident_id: string;
};

export type DashboardPageProps = PageProps<{
    reportedIncidents: ReportedIncidentsProps[];
    totalNoOfUser: number;
    newUsersThisMonth: number;
    totalNoOfIncidents: number;
    totalNoOfReportedIncidents: number;
    monthlyIncidentData: any;
    topReportedMunicipality: any;
    monthIncidentData: { month: string; total: number }[];
    weeklyIncidentData: { week: string; total: number }[];
    topMunicipalityMonthly: { month: string; municipality: string; total: number }[];
    topMunicipalityWeekly: { week: string; municipality: string; total: number }[];
    selectedYear: number;
    availableYears: number[];
}>;

export default function Dashboard() {
    const props = usePage<DashboardPageProps>().props;
    const {
        auth,
        reportedIncidents,
        totalNoOfUser,
        newUsersThisMonth,
        totalNoOfIncidents,
        totalNoOfReportedIncidents,
        monthlyIncidentData,
        topReportedMunicipality,
        monthIncidentData,
        weeklyIncidentData,
        topMunicipalityMonthly,
        topMunicipalityWeekly,
        selectedYear: initialYear,
        availableYears,
    } = props;

    const [selectedYear, setSelectedYear] = useState(initialYear);

    const handleYearChange = (year: string) => {
        const y = parseInt(year);
        setSelectedYear(y);
        router.get(route('dashboard'), { year: y }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Year Filter */}
                <div className="flex justify-end">
                    <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue>{selectedYear}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Stats Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <DashboardCard title="Total Registered Users" value={totalNoOfUser} description="All-time" icon={Users} />
                    <DashboardCard title="New Users This Month" value={newUsersThisMonth} description="This month" icon={Calendar} />
                    <DashboardCard title="Total Incident Types" value={totalNoOfIncidents} description="All-time" icon={Users} />
                    <DashboardCard
                        title="Total Reported Incidents"
                        value={totalNoOfReportedIncidents}
                        description="All-time"
                        icon={ArrowUpNarrowWide}
                    />
                </div>

                {/* Old Charts (All Years) */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <MonthlyIncidentsLineChart chartData={monthlyIncidentData} />
                    <MonthlyIncidentsBarChart chartData={topReportedMunicipality} />
                </div>

                {/* New Charts (Selected Year) */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Monthly Reports ({selectedYear})</h3>
                        <p className="text-muted-foreground mb-1 mb-2 text-sm">
                            Displays the total number of reported incidents for each month of the selected year.
                        </p>
                        <WeeklyIncidentsLineChart chartData={monthIncidentData} />
                    </div>

                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Weekly Reports ({selectedYear})</h3>
                        <p className="text-muted-foreground mb-1 mb-2 text-sm">
                            Shows the weekly distribution of reported incidents throughout the selected year.
                        </p>
                        <WeeklyIncidentsLineChart chartData={weeklyIncidentData} />
                    </div>

                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Top Municipality per Month {selectedYear}</h3>
                        <p className="text-muted-foreground mb-2 text-sm">
                            The municipality with the most reported incidents each month in {selectedYear}.
                        </p>
                        <TopMunicipalityMonthlyBar chartData={topMunicipalityMonthly} />
                    </div>
                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Top Municipality per Week {selectedYear}</h3>
                        <p className="text-muted-foreground mb-2 text-sm">
                            The municipality with the most reported incidents each week in {selectedYear}.
                        </p>
                        <TopMunicipalityWeeklyBar chartData={topMunicipalityWeekly} />
                    </div>
                </div>

                {/* Table */}
                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-background relative flex w-full flex-col overflow-hidden rounded-xl border p-4 md:p-6">
                    <DataTable
                        data={reportedIncidents}
                        columns={getReportedIncidentsColumnsForDashboard(reportedIncidents)}
                        filterColumn="source"
                        filterPlaceholder="Filter by source..."
                        tableTitle="Today's Reported Incidents"
                        tableDescription="This table displays today's reported incidents."
                        displayAddButton={false}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
