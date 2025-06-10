"use client"

import { Head } from "@inertiajs/react"
import { ArrowUpNarrowWide, Calendar, Users } from "lucide-react"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import MonthlyIncidentsLineChart from "./chart/monthly-incidents-linechart";
import MonthlyIncidentsBarChart from "./chart/municipality-incidents-barchart";
import DataTable from "./datatable/datatable";
import DashboardCard from "./card/dashboard-card";
import { getReportedIncidentsColumnsForDashboard } from "./dashboard-reported-columns"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
]

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
}

type DashboardProps = {
    reportedIncidents: ReportedIncidentsProps[];
    totalNoOfUser: string
    newUsersThisMonth: string
    totalNoOfIncidents: string
    totalNoOfReportedIncidents: string
}


export default function Dashboard({ reportedIncidents, totalNoOfUser, newUsersThisMonth, totalNoOfIncidents, totalNoOfReportedIncidents }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <DashboardCard
                        title="Total Registered Users"
                        value={totalNoOfUser}
                        description="All-time registered users"
                        icon={Users}
                    />

                    <DashboardCard
                        title="New Users This Month"
                        value={newUsersThisMonth}
                        description="New users this month"
                        icon={Calendar}
                    />
                    <DashboardCard
                        title="Total Incident Types"
                        value={totalNoOfIncidents}
                        description="All-time incident types"
                        icon={Users}
                    />

                    <DashboardCard
                        title="Total Reported Incidents"
                        value={totalNoOfReportedIncidents}
                        description="Total reported incidents"
                        icon={ArrowUpNarrowWide}
                    />

                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <MonthlyIncidentsLineChart />
                    <MonthlyIncidentsBarChart />
                </div>

                <div className="w-full h-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4 md:p-6 bg-background flex flex-col">
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
    )
}
