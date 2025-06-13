import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import { FormDialog } from "@/pages/dialog/form-dialog";

export type OfficeFormDialogProps = {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}

export function OfficeFormDialog({ isOpen, setIsOpen }: OfficeFormDialogProps) {
    const { data, setData, processing, reset } = useForm({
        office: '',
    });

    const handleSubmit = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        const payload = new FormData();
        payload.append('office', formData.office);

        router.post(route('offices.store'), payload, {
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
                setData({
                    office: formData.office,
                })
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
            title="Add New Authorities"
            isMultipart={false}
            disabled={processing}
            fields={[
                {
                    id: 'office',
                    label: 'Office Name',
                    type: 'text',
                    placeholder: 'Enter office name',
                    value: data.office,
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
}
