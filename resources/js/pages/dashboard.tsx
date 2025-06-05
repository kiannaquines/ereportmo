"use client"

import { Head } from "@inertiajs/react"
import { DollarSign, TrendingUp, Users } from "lucide-react"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import MonthlyIncidentsLineChart from "./chart/monthly-incidents-linechart";
import MonthlyIncidentsBarChart from "./chart/monthly-incidents-barchart";
import DataTable from "./datatable/datatable";
import { getReportedIncidentsColumns } from "./report/reported-incidents-columns";
import DashboardCard from "./card/dashboard-card";

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
}

type DashboardProps = {
    reportedIncidents: ReportedIncidentsProps[];
}


export default function Dashboard({ reportedIncidents }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <DashboardCard
                        title="Total Registered Users"
                        value="1,245"
                        description="All-time registered users"
                        icon={Users}
                    />

                    <DashboardCard
                        title="New Users This Month"
                        value="57"
                        description="This week ↑ 8%"
                        icon={TrendingUp}
                    />
                    <DashboardCard
                        title="Incidents"
                        value="12,300"
                        description="↑ 2,500 from last month"
                        icon={DollarSign}
                    />

                    <DashboardCard
                        title="Reported Incidents"
                        value="12,300"
                        description="↑ 2,500 from last month"
                        icon={DollarSign}
                    />

                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <MonthlyIncidentsLineChart />
                    <MonthlyIncidentsBarChart />
                </div>

                <div className="w-full h-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-4 md:p-6 bg-background flex flex-col">
                    {/* <DataTable
                        data={reportedIncidents}
                        columns={getReportedIncidentsColumns(reportedIncidents)}
                        filterColumn="source"
                        filterPlaceholder="Filter by source..."
                        tableTitle="Reported Incidents"
                        tableDescription="This table displays reported incidents."
                    /> */}
                </div>
            </div>
        </AppLayout>
    )
}
