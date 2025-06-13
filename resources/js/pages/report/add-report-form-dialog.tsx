import { useForm, router } from '@inertiajs/react';
import { FormDialog } from '@/pages/dialog/form-dialog';
import { toast } from "sonner"
import { ReportedByProps } from '@/types';

export function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export type AddIncidentReportDialogProps = ReportedByProps & {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

export function AddIncidentReportDialog({ reportedBy, incidents, isOpen, setIsOpen }: AddIncidentReportDialogProps) {

    const { data, setData, reset, processing } = useForm({
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
        payload.append('latitude', formData.latitude);
        payload.append('longitude', formData.longitude);

        if (formData.image) payload.append('image', formData.image);
        if (formData.description) payload.append('description', formData.description);

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
                setData({
                    reported_by: formData.reported_by,
                    incident_id: formData.incident_id,
                    image: null,
                    description: formData.description ?? null,
                    latitude: formData.latitude ?? null,
                    longitude: formData.longitude ?? null
                })
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
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Add New Reported Incident"
            description='Add new reported incident dialog'
            isMultipart={true}
            fields={[
                {
                    id: "reported_by",
                    type: "select",
                    label: "Reported by",
                    placeholder: "Select who reported the incident",
                    value: data.reported_by,
                    options: reportedBy?.map(user => ({
                        label: user.name,
                        value: String(user.id),
                    })) ?? []
                },
                {
                    id: "incident_id",
                    type: "select",
                    label: "Incident Type",
                    placeholder: "Select what kind of incident",
                    value: data.incident_id,
                    options: incidents?.map(incident => ({
                        label: `${incident.office} - ${truncate(incident.incident, 25)}`,
                        value: String(incident.id),
                    })) ?? []
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
                    label: "Latitude",
                    placeholder: "Enter latitude",
                    value: data.latitude,
                },
                {
                    id: "longitude",
                    type: "text",
                    label: "Longitude",
                    placeholder: "Enter longitude",
                    value: data.longitude,
                }
            ]}
            disabled={processing}
            onSubmit={handleSubmit}
        />
    );
}
