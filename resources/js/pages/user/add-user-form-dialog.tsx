import { FormDialog } from "@/pages/dialog/form-dialog";
import { AddUserFormDialogProp } from "@/types";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

function AddUserFormDialog({ offices, roles, isOpen, setIsOpen }: AddUserFormDialogProp & { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const { data, setData, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        municipality: '',
        barangay: '',
        office: '',
        role: '',
    });

    const handleSubmit = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('password', formData.password);
        payload.append('password_confirmation', formData.password_confirmation);
        payload.append('municipality', formData.municipality);
        payload.append('barangay', formData.barangay);
        payload.append('office', formData.office);
        payload.append('role', formData.role);

        router.post(route('admin.users.store'), payload, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                onSuccess();
                toast.success('Horayyy', {
                    description: 'You have successfully added a new user.',
                });
            },
            onError: (e) => {
                onError();

                setData((prev) => ({ ...prev }));
                
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
            title="Add User"
            description="Add a new user to the system."
            disabled={processing}
            fields={[
                {
                    id: "name",
                    type: "text",
                    label: "Name",
                    placeholder: "Enter name",
                    value: data.name,
                },
                {
                    id: "email",
                    type: "email",
                    label: "Email",
                    placeholder: "Enter email",
                    value: data.email,
                },
                {
                    id: "office",
                    type: "select",
                    label: "Office",
                    value: data.office,
                    options: offices?.map((office) => ({
                        label: office.office,
                        value: String(office.id),
                    })) ?? [],
                },
                {
                    id: "role",
                    type: "select",
                    label: "Role",
                    value: data.role,
                    options: roles?.map((role) => ({
                        label: role.role.toUpperCase(),
                        value: String(role.id),
                    })) ?? [],
                },
                {
                    id: "municipality",
                    type: "select",
                    label: "Municipality",
                    value: data.municipality,
                    options: [
                        { label: "Alamada", value: "Alamada" },
                        { label: "Aleosan", value: "Aleosan" },
                        { label: "Antipas", value: "Antipas" },
                        { label: "Arakan", value: "Arakan" },
                        { label: "Banisilan", value: "Banisilan" },
                        { label: "Carmen", value: "Carmen" },
                        { label: "Kabacan", value: "Kabacan" },
                        { label: "Libungan", value: "Libungan" },
                        { label: "Magpet", value: "Magpet" },
                        { label: "Makilala", value: "Makilala" },
                        { label: "Matalam", value: "Matalam" },
                        { label: "M'lang", value: "M'lang" },
                        { label: "Midsayap", value: "Midsayap" },
                        { label: "Pigcawayan", value: "Pigcawayan" },
                        { label: "Pikit", value: "Pikit" },
                        { label: "President Roxas", value: "President Roxas" },
                        { label: "Tulunan", value: "Tulunan" },
                        { label: "Kidapawan City", value: "Kidapawan City" }
                    ],
                },
                {
                    id: "barangay",
                    type: "text",
                    label: "Barangay",
                    placeholder: "Enter barangay",
                    value: data.barangay,
                },
                {
                    id: "password",
                    type: "password",
                    label: "Password",
                    placeholder: "Enter password",
                    value: data.password,
                },
                {
                    id: "password_confirmation",
                    type: "password",
                    label: "Confirm Password",
                    placeholder: "Confirm password",
                    value: data.password_confirmation,
                },
            ]}
            onSubmit={handleSubmit}
        />
    );
}

export default AddUserFormDialog;