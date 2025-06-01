import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DataTable from '@/components/datatable/data-table';
import { IncidentsColumns } from '@/components/datatable/incident/incident-columns';
import { FormDialog } from '@/components/dialog/form-dialog';
import { Incidents } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

type OfficeProps = {
    id: string;
    office: string;
}

type IncidentsProps = {
    id: string;
    incident: string;
    office: string;
    created_at: string;
    updated_at: string;
}

type IncidentFormDialogProp = {
    offices: OfficeProps[];
}

type IncidentPageProps = PageProps & {
    offices: OfficeProps[];
    incidents: IncidentsProps[];
}

function IncidentFormDialog({ offices }: IncidentFormDialogProp) {
    console.log("Offices:", offices);
    return (
        <FormDialog
            title="Add Reported Incident"
            triggerLabel="Add New Reported Incident"
            fields={[
                {
                    id: "office",
                    type: "select",
                    label: "Office",
                    placeholder: "Select office",
                    required: true,
                    options: offices.map(office => ({
                        label: office.office,
                        value: String(office.id),
                    })),
                },
                {
                    id: "incident",
                    type: "textarea",
                    label: "Description",
                    placeholder: "Enter description",
                    required: true,
                },
            ]}
            onSubmit={(data) => {
                console.log("Form submitted with data:", data);
            }}
        />
    )
}

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