import { FormDialog } from "@/pages/dialog/form-dialog";
import { IncidentsProps, OfficeProps } from '@/types';
import { router, useForm } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner"

export type EditIncidentFormDialogProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    incident?: IncidentsProps;
    offices?: OfficeProps[]
};

export function EditIncidentFormDialog({ isOpen, setIsOpen, incident, offices }: EditIncidentFormDialogProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, reset } = useForm({
        office_id: '',
        incident: '',
    });

    useEffect(() => {
        if (incident && isOpen) {
            setData({
                office_id: incident.office_id,
                incident: incident.incident ?? '',
            });
        }
    }, [incident, isOpen, setData]);
    
    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const handleSubmit = useCallback((
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        if (!incident?.id) {
            toast.error('No incident ID available');
            setIsSubmitting(false);
            return;
        }

        const payload = new FormData();

        payload.append('_method', 'PUT');
        payload.append('office_id', formData.office_id);
        payload.append('incident', formData.incident);

        router.put(route('incidents.update',incident.id), payload, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (e) => {
                toast.success('Incident updated successfully');
                setIsOpen(false);
                onSuccess();
            },
            onError: (e) => {
                for (const [field, message] of Object.entries(e)) {
                    toast.error('Failed to update incident', {
                        description: String(message),
                    });
                }
                onError();
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    }, [incident?.id, isSubmitting, setIsOpen]);

    return (
        <FormDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Edit Incident"
            description="Edit incident dialog"
            disabled={isSubmitting}
            fields={[
                {
                    id: "office_id",
                    type: "select",
                    label: "Authority",
                    placeholder: "Select Authority",
                    value: String(data.office_id),
                    options: offices?.map((office) => ({
                        label: office.office,
                        value: String(office.id),
                    })) ?? [],
                },
                {
                    id: "incident",
                    type: "textarea",
                    label: "Description",
                    placeholder: "Enter description",
                    value: String(data.incident),
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
}