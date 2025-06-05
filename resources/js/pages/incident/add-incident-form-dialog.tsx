import { FormDialog } from "@/pages/dialog/form-dialog";
import { IncidentFormDialogProp } from '@/types';
import { router, useForm } from "@inertiajs/react";
import { toast } from "sonner"


function IncidentFormDialog({ offices, isOpen, setIsOpen }: IncidentFormDialogProp & { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const { data, processing, errors, reset } = useForm({
        office_id: '',
        incident: '',
    });

    const handleSubmit = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        router.post(
            route("incidents.store"),
            {
                office_id: formData.office_id,
                incident: formData.incident,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    onSuccess();
                    toast.success('Horayy, success', {
                        description: 'You have successfully added new incident type.'
                    })
                },
                onError: (e) => {
                    onError();

                    for (const [field, message] of Object.entries(e)) {
                        toast.error('Oppss, please try again', {
                            description: `${message}`,
                        })
                    }

                },
            }
        );
    };

    return (
        <FormDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Add Incident"
            isMultipart={false}
            disabled={processing}
            fields={[
                {
                    id: "office_id",
                    type: "select",
                    label: "Authority",
                    placeholder: "Select Authority",
                    value: data.office_id,
                    options: offices.map((office) => ({
                        label: office.office,
                        value: String(office.id),
                    })),
                },
                {
                    id: "incident",
                    type: "textarea",
                    label: "Description",
                    placeholder: "Enter description",
                    value: data.incident,
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
}

export default IncidentFormDialog;