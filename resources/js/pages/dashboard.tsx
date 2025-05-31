"use client"

import { Head } from "@inertiajs/react"
import { DollarSign, TrendingUp, Users } from "lucide-react"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import MonthlyIncidentsLineChart from "@/components/chart/monthly-incidents-linechart";
import MonthlyIncidentsBarChart from "@/components/chart/monthly-incidents-barchart";
import DataTable from "../components/datatable/data-table"
import { paymentData } from "../components/datatable/payment/payment-data";
import { paymentColumns } from "../components/datatable/payment/payment-columns";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
]

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-36 overflow-hidden rounded-xl border p-4">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                Total Users
                                <Users className="h-4 w-4" />
                            </div>
                            <div className="text-3xl font-bold">1,245</div>
                            <p className="text-xs text-muted-foreground">All-time registered users</p>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-36 overflow-hidden rounded-xl border p-4">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                New Signups
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-3xl font-bold">57</div>
                            <p className="text-xs text-muted-foreground">This week ↑ 8%</p>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-36 overflow-hidden rounded-xl border p-4">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                Incidents
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <div className="text-3xl font-bold">12,300</div>
                            <p className="text-xs text-muted-foreground">↑ 2,500 from last month</p>
                        </div>
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-36 overflow-hidden rounded-xl border p-4">
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                Incidents
                                <DollarSign className="h-4 w-4" />
                            </div>
                            <div className="text-3xl font-bold">12,300</div>
                            <p className="text-xs text-muted-foreground">↑ 2,500 from last month</p>
                        </div>
                    </div>

                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                    <MonthlyIncidentsLineChart/>
                    <MonthlyIncidentsBarChart/>
                </div>

                <div className="w-full h-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background flex flex-col">
                    <DataTable
                        data={paymentData}
                        columns={paymentColumns}
                        filterColumn="email"
                        filterPlaceholder="Filter by email..."
                    />
                </div>
            </div>
        </AppLayout>
    )
}
