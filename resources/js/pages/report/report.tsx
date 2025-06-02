import DataTable from '@/components/datatable/data-table';
import { ReportedIncidentsColumns } from '@/components/datatable/report/reported-incidents-columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, ReportedByProps, ReportProps } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { FormDialog } from '@/components/dialog/form-dialog';
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function ReportFormDialog({ reportedBy, incidents }: ReportedByProps) {

    const { data, reset, processing } = useForm({
        reported_by: '',
        incident_id: '',
        image: null,
        description: '',
        latitude: '',
        longitude: ''
    });

    const handleSubmit = (formData: Record<string, any>, { onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
        const payload = new FormData();

        payload.append('reported_by', formData.reported_by);
        payload.append('incident_id', formData.incident_id);
        if (formData.image) payload.append('image', formData.image);
        if (formData.description) payload.append('description', formData.description);
        if (formData.latitude) payload.append('latitude', formData.latitude);
        if (formData.longitude) payload.append('longitude', formData.longitude);

        router.post(route('reports.store'), payload, {
            onSuccess: () => {
                reset();
                onSuccess();
                toast.success('Horayy, success', {
                    description: 'You have successfully added new incident report.'
                })
            },
            onError: (e) => {
                onError();
                for (const [field, message] of Object.entries(e)) {
                    toast.error('Oppss, please try again', {
                        description: `${message}`,
                    });
                }
            }
        });
    };

    return (
        <FormDialog
            title="Add New Reported Incident"
            triggerLabel="Add Reported Incident"
            isMultipart={true}
            fields={[
                {
                    id: "reported_by",
                    type: "select",
                    label: "Reported by",
                    placeholder: "Select who reported the incident",
                    value: data.reported_by,
                    options: reportedBy.map(user => ({
                        label: user.name,
                        value: String(user.id),
                    }))
                },
                {
                    id: "incident_id",
                    type: "select",
                    label: "Incident Type",
                    placeholder: "Select what kind of incident",
                    value: data.incident_id,
                    options: incidents.map(incident => ({
                        label: `${incident.office} - ${truncate(incident.incident, 25)}`,
                        value: String(incident.id),
                    }))
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
                    value: data.description,
                },
                {
                    id: "latitude",
                    type: "text",
                    label: "Latitude (Optional)",
                    placeholder: "Enter latitude",
                    value: data.latitude,
                },
                {
                    id: "longitude",
                    type: "text",
                    label: "Longitude (Optional)",
                    placeholder: "Enter longitude",
                    value: data.longitude,
                }
            ]}
            disabled={processing}
            onSubmit={handleSubmit}
        />
    );
}

export default function Report({ reportedBy, reportedIncidents, incidents }: ReportProps) {
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
                        formDialog={<ReportFormDialog reportedBy={reportedBy} incidents={incidents} />}
                    />
                </div>
            </div>
        </AppLayout>
    );
}