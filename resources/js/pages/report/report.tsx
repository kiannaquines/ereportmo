import DataTable from '@/components/datatable/data-table';
import { ReportedIncidentsColumns } from '@/components/datatable/report/reported-incidents-columns';
import { ReportedIncidentsData } from '@/components/datatable/report/reported-incidents-data';
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
                    options: reportedBy.map(user => {
                        return {
                            label: user.name,
                            value: String(user.id),
                        };
                    })
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
            ]}
            onSubmit={(data) => {
                console.log("Form submitted:", data);
            }}
        />
    );
}

export default function Report({ reportedBy }: ReportedByProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <DataTable
                        data={ReportedIncidentsData}
                        columns={ReportedIncidentsColumns}
                        filterColumn="reported"
                        filterPlaceholder="Filter by reported by..."
                        tableTitle="Reported Incidents"
                        tableDescription="This table displays reported incidents."
                        formDialog={<ReportFormDialog reportedBy={reportedBy} />}
                    />
                </div>
            </div>
        </AppLayout>
    );
}