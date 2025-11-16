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
    periodTotalUsers: number;
    periodTotalReports: number;
    periodTotalIncidents: number;
    selectedPeriod: 'all' | 'weekly' | 'monthly';
    isAdmin: boolean;
    userOffice: string | null;
    userMunicipality: string | null;
    isOfficeUser: boolean;
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
        periodTotalUsers,
        periodTotalReports,
        periodTotalIncidents,
        selectedPeriod: initialPeriod,
        isAdmin,
        userOffice,
        userMunicipality,
        isOfficeUser,
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
    const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

    const handleYearChange = (year: string) => {
        const y = parseInt(year);
        setSelectedYear(y);
        router.get(route('dashboard'), { year: y, period: selectedPeriod }, { preserveState: true, replace: true });
    };

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period as 'all' | 'weekly' | 'monthly');
        router.get(route('dashboard'), { year: selectedYear, period }, { preserveState: true, replace: true });
    };

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case 'weekly':
                return 'This Week';
            case 'monthly':
                return 'This Month';
            default:
                return 'All-time';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Office User Notice */}
                {isOfficeUser && !isAdmin && userOffice && (
                    <div className="rounded-lg border bg-blue-50 p-4 dark:bg-blue-950">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Viewing statistics for: <span className="font-bold">{userOffice}</span>
                            {userMunicipality && (
                                <>
                                    {' '}
                                    - <span className="font-bold">{userMunicipality}</span>
                                </>
                            )}
                        </p>
                        <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                            The dashboard shows data filtered specifically for your office and location.
                        </p>
                    </div>
                )}
                
                {/* Admin Notice */}
                {isAdmin && (
                    <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            <span className="font-bold">Administrator View</span> - Viewing All System Data
                        </p>
                        <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                            You're viewing complete statistics across all offices (PNP, MDRRMO, MSWDO) and all locations.
                        </p>
                    </div>
                )}
                
                {/* Filters */}
                <div className="flex justify-end gap-4">
                    <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue>{getPeriodLabel()}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="weekly">This Week</SelectItem>
                            <SelectItem value="monthly">This Month</SelectItem>
                        </SelectContent>
                    </Select>
                    
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
                    <DashboardCard 
                        title="Total Registered Users" 
                        value={selectedPeriod === 'all' ? totalNoOfUser : periodTotalUsers} 
                        description={getPeriodLabel()} 
                        icon={Users} 
                    />
                    <DashboardCard 
                        title="New Users This Month" 
                        value={newUsersThisMonth} 
                        description="This month" 
                        icon={Calendar} 
                    />
                    <DashboardCard 
                        title="Total Incident Types" 
                        value={selectedPeriod === 'all' ? totalNoOfIncidents : periodTotalIncidents} 
                        description={getPeriodLabel()} 
                        icon={Users} 
                    />
                    <DashboardCard
                        title="Total Reported Incidents"
                        value={selectedPeriod === 'all' ? totalNoOfReportedIncidents : periodTotalReports}
                        description={getPeriodLabel()}
                        icon={ArrowUpNarrowWide}
                    />
                </div>

                {/* Old Charts (All Years) */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="bg-card rounded-xl border p-4">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Monthly Incidents Reported</h2>
                            <p className="text-sm text-muted-foreground">
                                {getPeriodLabel()} - Incident trends across all years
                            </p>
                        </div>
                        <MonthlyIncidentsLineChart chartData={monthlyIncidentData} />
                    </div>
                    <div className="bg-card rounded-xl border p-4">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold">Incidents per Municipality</h2>
                            <p className="text-sm text-muted-foreground">
                                {getPeriodLabel()} - Top reporting municipalities by year
                            </p>
                        </div>
                        <MonthlyIncidentsBarChart chartData={topReportedMunicipality} />
                    </div>
                </div>

                {/* New Charts (Selected Year) */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Monthly Reports ({selectedYear})</h3>
                        <p className="text-muted-foreground mb-1 mb-2 text-sm">
                            {getPeriodLabel()} - Total incidents for each month of {selectedYear}
                        </p>
                        <WeeklyIncidentsLineChart chartData={monthIncidentData} />
                    </div>

                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Weekly Reports ({selectedYear})</h3>
                        <p className="text-muted-foreground mb-1 mb-2 text-sm">
                            {getPeriodLabel()} - Weekly distribution of incidents in {selectedYear}
                        </p>
                        <WeeklyIncidentsLineChart chartData={weeklyIncidentData} />
                    </div>

                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Top Municipality per Month ({selectedYear})</h3>
                        <p className="text-muted-foreground mb-2 text-sm">
                            {getPeriodLabel()} - Municipality with most incidents each month in {selectedYear}
                        </p>
                        <TopMunicipalityMonthlyBar chartData={topMunicipalityMonthly} />
                    </div>
                    <div className="bg-card rounded-xl border p-4">
                        <h3 className="text-lg font-semibold">Top Municipality per Week ({selectedYear})</h3>
                        <p className="text-muted-foreground mb-2 text-sm">
                            {getPeriodLabel()} - Municipality with most incidents each week in {selectedYear}
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
