import { useState, useEffect, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import { FormDialog } from '@/pages/dialog/form-dialog';
import { toast } from 'sonner';
import { ReportedByProps } from '@/types';

export function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export type EditIncidentReport = {
    id: string
    incident_id: string
    reported_by: string
    description: string
    latitude: string
    longitude: string
};

export type EditIncidentReportDialogProps = ReportedByProps & {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    report?: EditIncidentReport
};

export function EditIncidentReportDialog({
    reportedBy,
    incidents,
    isOpen,
    setIsOpen,
    report,
}: EditIncidentReportDialogProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData } = useForm({
        id: String(report?.id ?? ''),
        incident_id: report?.incident_id ?? '',
        reported_by: report?.reported_by ?? '',
        description: report?.description ?? '',
        latitude: String(report?.latitude ?? ''),
        longitude: String(report?.longitude ?? ''),
    });

    useEffect(() => {
        if (report && isOpen) {
            setData({
                id: report.id,
                incident_id: report.incident_id ?? '',
                reported_by: report.reported_by ?? '',
                description: report.description ?? '',
                latitude: String(report.latitude ?? ''),
                longitude: String(report.longitude ?? ''),
            });
        }
    }, [report, isOpen]);

    const handleUpdate = useCallback((
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        if (!report?.id) {
            onError();
            toast.error('No report ID available');
            setIsSubmitting(false);
            return;
        }

        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('incident_id', formData.incident_id);
        payload.append('reported_by', formData.reported_by);
        payload.append('description', formData.description || '');
        payload.append('latitude', formData.latitude || '');
        payload.append('longitude', formData.longitude || '');

        if (formData.image instanceof File) {
            payload.append('image', formData.image);
        }

        router.post(route('reports.update', report.id), payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                toast.success('Incident report updated');
                setIsOpen(false);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                onError();
                toast.error('Failed to update incident report');
                setIsSubmitting(false);
            },
        });
    }, [isSubmitting, report?.id, setIsOpen]);

    return (
        <FormDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Edit Reported Incident"
            description="Edit reported incident dialog"
            isMultipart={true}
            submitLabel="Update Report"
            fields={[
                {
                    id: 'reported_by',
                    type: 'select',
                    label: 'Reported by',
                    placeholder: 'Select who reported the incident',
                    value: String(data.reported_by),
                    options: reportedBy.map((user) => ({
                        label: user.name,
                        value: String(user.id),
                    })),
                },
                {
                    id: 'incident_id',
                    type: 'select',
                    label: 'Incident Type',
                    placeholder: 'Select what kind of incident',
                    value: String(data.incident_id),
                    options: incidents.map((incident) => ({
                        label: `${incident.office} - ${truncate(incident.incident, 25)}`,
                        value: String(incident.id),
                    })),
                },
                {
                    id: 'image',
                    type: 'file',
                    label: 'Image',
                    placeholder: 'Upload an image (optional)',
                    value: undefined,
                },
                {
                    id: 'description',
                    type: 'textarea',
                    label: 'Description (Optional)',
                    placeholder: 'Enter report description',
                    value: data.description ?? '',
                },
                {
                    id: 'latitude',
                    type: 'text',
                    label: 'Latitude (Optional)',
                    placeholder: 'Enter latitude',
                    value: data.latitude ?? '',
                },
                {
                    id: 'longitude',
                    type: 'text',
                    label: 'Longitude (Optional)',
                    placeholder: 'Enter longitude',
                    value: data.longitude ?? '',
                },
            ]}
            disabled={isSubmitting}
            onSubmit={handleUpdate}
        />
    );
}