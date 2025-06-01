import DataTable from '@/components/datatable/data-table';
import { ReportedIncidentsColumns } from '@/components/datatable/report/reported-incidents-columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FormDialog } from '@/components/dialog/form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

type UserProps = {
    id: string;
    name: string;
}

type ReportedByProps = {
    reportedBy: UserProps[];
}

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

type ReportProps = {
    reportedBy: UserProps[];
    reportedIncidents: ReportedIncidentsProps[];
}

function ReportFormDialog({ reportedBy }: ReportedByProps) {
    return (
        <FormDialog
            title="Add New Incident Report"
            triggerLabel="Add Incident Report"
            fields={[
                {
                    id: "reported_by",
                    type: "select",
                    label: "Reported by",
                    placeholder: "Select who reported the incident",
                    required: true,
                    options: reportedBy.length > 0 ? reportedBy.map(user => {
                        return {
                            label: user.name,
                            value: String(user.id),
                        };
                    }) : []
                },
                { 
                    id: "image",
                    type: "file",
                    label: "Image",
                    placeholder: "Upload an image (optional)"
                },
                { 
                    id: "description",
                    type: "textarea",
                    label: "Description (Optional)",
                    placeholder: "Enter report description",
                    required: true
                },
                {
                    id: "latitude",
                    type: "text",
                    label: "Latitude (Optional)",
                    placeholder: "Enter latitude",
                    required: false
                },
                {
                    id: "longitude",
                    type: "text",
                    label: "Longitude (Optional)",
                    placeholder: "Enter longitude",
                    required: false
                }
            ]}
            onSubmit={(data) => {
                console.log("Form submitted:", data);
            }}
        />
    );
}

export default function Report({ reportedBy, reportedIncidents }: ReportProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <DataTable
                        data={reportedIncidents}
                        columns={ReportedIncidentsColumns}
                        filterColumn="source"
                        filterPlaceholder="Filter by source..."
                        tableTitle="Reported Incidents"
                        tableDescription="This table displays reported incidents."
                        formDialog={<ReportFormDialog reportedBy={reportedBy} />}
                    />
                </div>
            </div>
        </AppLayout>
    );
}