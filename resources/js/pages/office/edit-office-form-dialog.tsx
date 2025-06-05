import { useState, useEffect } from "react";
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
        id: office?.id,
        office: office?.office,
    });

    useEffect(() => {
        if (office && isOpen) {
            setData({
                id: office?.id,
                office: String(office?.office ?? '')
            });
        }
    }, [office, isOpen]);

    const handleUpdate = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        setIsSubmitting(true);

        if (!office?.id) {
            console.log('eror id')
            toast.error('No report ID available');
            setIsSubmitting(false);
            return;
        }

        const payload = new FormData();
        payload.append('_method','PUT');
        payload.append('office', formData.office);

        router.post(route('offices.update', office.id), payload, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onSuccess();
                toast.success('Horayyy', {
                    description: 'You have successfully added a new authority office.',
                });
            },
            onError: (e) => {
                onError();
                for (const [field, message] of Object.entries(e)) {
                    toast.error('Oppss, please try again', {
                        description: `${message}`,
                    });
                }
            },
        });
    };

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
            ]}
            onSubmit={handleUpdate}
        />
    );
}
