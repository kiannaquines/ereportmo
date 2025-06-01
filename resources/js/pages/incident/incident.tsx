import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DataTable from '@/components/datatable/data-table';
import { ReportedIncidentsData } from '@/components/datatable/report/reported-incidents-data';
import { ReportedIncidentsColumns } from '@/components/datatable/report/reported-incidents-columns';
import { FormDialog } from '@/components/dialog/form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

type OfficeProps = {
    id: string;
    name: string;
}

const offices: OfficeProps[] = [
    { id: '1', name: 'PNP' },
    { id: '2', name: 'MDRRMO (VAWC)' },
    { id: '3', name: 'MDRRMO' },
];

function IncidentFormDialog() {
    return (
        <FormDialog
            title="Add Reported Incident"
            triggerLabel="Add New Reported Incident"
            fields={[
                { id: "office", type: "select", label: "Office", placeholder: "Select office", required: true, options: offices.map(office => ({ label: office.name, value: office.id })) },
                { id: "incident", type: "textarea", label: "Description", placeholder: "Enter description", required: true },
            ]}
            onSubmit={(data) => {
                console.log("Form submitted:", data);
            }}
        />
    )
}

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
                        formDialog={<IncidentFormDialog />}
                    />
                </div>
            </div>
        </AppLayout>
    );
}