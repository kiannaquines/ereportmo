import { useState, useEffect, useCallback } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import { FormDialog } from "@/pages/dialog/form-dialog";
import { OfficeProps } from "@/types";

export type EditOfficeFormDialogProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    office?: OfficeProps;
};

export function EditOfficeFormDialog({ isOpen, setIsOpen, office }: EditOfficeFormDialogProps) {

    const [isSubmitting, setIsSubmitting] = useState(false);


    const { data, setData, reset } = useForm({
        id: '',
        office: '',
        location: '',
        status: '',
    });

    useEffect(() => {
        if (office && isOpen) {
            setData({
                id: office?.id,
                office: String(office?.office ?? ''),
                location: String(office?.location ?? ''),
                status: String(office?.status ?? '')
            });
        }
    }, [office, isOpen]);

    const handleUpdate = useCallback((
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        if (!office?.id) {
            toast.error('No office ID available');
            setIsSubmitting(false);
            return;
        }

        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('office', formData.office);
        payload.append('location', formData.location);
        payload.append('status', formData.status);

        router.post(route('offices.update', office.id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess();
                toast.success('Horayyy', {
                    description: 'You have successfully updated the authority office.',
                });
                setIsSubmitting(false);
            },
            onError: (errors) => {
                onError();
                for (const [field, message] of Object.entries(errors)) {
                    toast.error('Oops, please try again', {
                        description: String(message),
                    });
                }
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    }, [isSubmitting, office?.id, reset]);

    return (
        <FormDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Update Authority"
            description="Update authority information"
            disabled={isSubmitting}
            fields={[
                {
                    id: 'office',
                    label: 'Office Name',
                    type: 'text',
                    placeholder: 'Enter office name',
                    value: data.office,
                },
                {
                    id: 'location',
                    label: 'Location',
                    type: 'text',
                    placeholder: 'Enter office Location',
                    value: data.location,
                },
                {
                    id: 'status',
                    label: 'Office Status',
                    type: 'select',
                    placeholder: 'Select office status',
                    value: data.status,
                    options: [
                        {
                            label: 'ON',
                            value: 'ON'
                        },
                        {
                            label: 'OFF',
                            value: 'OFF'
                        }
                    ],
                },
            ]}
            onSubmit={handleUpdate}
        />
    );
}
