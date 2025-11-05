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
        location: '',
        status: '',
    });

    const handleSubmit = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        const payload = new FormData();
        payload.append('office', formData.office);
        payload.append('location', formData.location);
        payload.append('status', formData.status);


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
                    location: formData.location,
                    status: formData.status,
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
            onSubmit={handleSubmit}
        />
    );
}
