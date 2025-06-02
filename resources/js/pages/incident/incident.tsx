import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DataTable from '@/components/datatable/data-table';
import { IncidentsColumns } from '@/components/datatable/incident/incident-columns';
import { IncidentPageProps } from "@/types";
import IncidentFormDialog from './incident-form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];
 

export default function Incident({ offices, incidents }: IncidentPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incidents" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <DataTable
                        data={incidents}
                        columns={IncidentsColumns}
                        filterColumn="office"
                        filterPlaceholder="Filter by office..."
                        tableTitle="Incidents"
                        tableDescription="This table displays incidents."
                        formDialog={<IncidentFormDialog offices={offices} />}
                    />
                </div>
            </div>
        </AppLayout>
    );
}