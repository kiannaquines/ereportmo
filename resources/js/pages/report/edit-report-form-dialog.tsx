import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { FormDialog } from '@/components/dialog/form-dialog';
import { toast } from 'sonner';
import { ReportedByProps } from '@/types';

export function truncate(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
export type EditIncidentReport = {
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

    const { data, setData, reset, processing } = useForm({
        image: null,
        incident_id: report?.incident_id ?? '',
        reported_by: report?.reported_by ?? '',
        description: report?.description ?? '',
        latitude: String(report?.latitude ?? ''),
        longitude: String(report?.longitude ?? ''),
    });

    React.useEffect(() => {
        setData({
            image: null,
            incident_id: report?.incident_id ?? '',
            reported_by: report?.reported_by ?? '',
            description: report?.description ?? '',
            latitude: report?.latitude ?? '',
            longitude: report?.longitude ?? '',
        });
    }, [report, setData]);

    const handleUpdate = () => {
        console.log(data)
        console.log('Hello')
    }

    return (
        <FormDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Edit Reported Incident"
            description="Edit reported incident dialog"
            isMultipart={true}
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
            disabled={processing}
            onSubmit={handleUpdate}
        />
    );
}
