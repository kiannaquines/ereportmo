import { FormDialog } from "@/pages/dialog/form-dialog";
import { IncidentsProps, OfficeProps } from '@/types';
import { router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
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
        office: '',
        incident: '',
    });

    useEffect(() => {
        if (incident) {
            setData({
                office: String(incident.office_id),
                incident: incident.incident ?? '',
            });
        }
        
        if (!isOpen) {
            reset();
        }
    }, [isOpen]);


    const handleSubmit = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        setIsSubmitting(true);

        if (!incident?.id) {
            toast.error('No incident ID available');
            setIsSubmitting(false);
            return;
        }

        router.put(route('incidents.update', { incident: incident.id }), formData, {
            onSuccess: () => {
                toast.success('Incident updated successfully');
                setIsOpen(false);
                onSuccess();
            },
            onError: () => {
                toast.error('Failed to update incident');
                onError();
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <FormDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Edit Incident"
            isMultipart={false}
            disabled={isSubmitting}
            fields={[
                {
                    id: "office_id",
                    type: "select",
                    label: "Authority",
                    placeholder: "Select Authority",
                    value: data.office,
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