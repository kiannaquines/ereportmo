"use client"

import { Head } from "@inertiajs/react"
import { DollarSign, TrendingUp, Users } from "lucide-react"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import MonthlyIncidentsLineChart from "@/components/chart/monthly-incidents-linechart";
import MonthlyIncidentsBarChart from "@/components/chart/monthly-incidents-barchart";
import DataTable from "../components/datatable/data-table"
import { ReportedIncidentsData } from "../components/datatable/payment/reported-incidents-data";
import { ReportedIncidentsColumns } from "../components/datatable/payment/reported-incidents-columns";
import DashboardCard from "@/components/card/dashboard-card"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
]

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm">
                        <span>Reload Page</span>
                    </Button>
                </div>
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

                <div className="w-full h-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background flex flex-col">
                    <DataTable
                        data={ReportedIncidentsData}
                        columns={ReportedIncidentsColumns}
                        filterColumn="reported"
                        filterPlaceholder="Filter by reported by..."
                        tableTitle="Reported Incidents"
                        tableDescription="This table displays reported incidents."
                    />
                </div>
            </div>
        </AppLayout>
    )
}
