import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DataTable from '@/components/datatable/data-table';
import { ReportedIncidentsData } from '@/components/datatable/report/reported-incidents-data';
import { ReportedIncidentsColumns } from '@/components/datatable/report/reported-incidents-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

export default function Incident() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incidents" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <DataTable
                        data={ReportedIncidentsData}
                        columns={ReportedIncidentsColumns}
                        filterColumn="reported"
                        filterPlaceholder="Filter by reported by..."
                        tableTitle="Incidents"
                        tableDescription="This table displays incidents."
                    />
                </div>
            </div>
        </AppLayout>
    );
}