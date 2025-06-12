import { FormDialog } from "@/pages/dialog/form-dialog";
import { EditUserFormDialogProp } from "@/types";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { useEffect } from "react";

function EditUserFormDialog({ offices, roles, user, isOpen, setIsOpen }: EditUserFormDialogProp & { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const { data, setData, processing, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        municipality: '',
        office_id: '',
        role_id: '',
        barangay: '',
    });

    useEffect(() => {
        if (user && isOpen) {
            setData({
                name: user.name,
                email: user.email,
                password: '',
                password_confirmation: '',
                municipality: user.municipality,
                office_id: user.office_id,
                role_id: user.role_id,
                barangay: user.barangay,
            });
        }
    }, [user, isOpen, setData]);
    
    const handleSubmit = (
        formData: Record<string, any>,
        { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
        const payload = new FormData();
        payload.append('_method', 'PUT');
        payload.append('name', formData.name);
        payload.append('email', formData.email);
        payload.append('password', formData.password);
        payload.append('password_confirmation', formData.password_confirmation);
        payload.append('municipality', formData.municipality);
        payload.append('barangay', formData.barangay);
        payload.append('office_id', formData.office_id);
        payload.append('role_id', formData.role_id);


        router.post(route('admin.users.update', { id: user.id }), payload, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                onSuccess();
                reset();
                toast.success('Horayyy', {
                    description: 'You have successfully updated a user.',
                });
            },
            onError: (e) => {
                onError();

                setData({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.password_confirmation,
                    municipality: formData.municipality,
                    office_id: formData.office_id,
                    role_id: formData.role_id,
                    barangay: formData.barangay,    
                });

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
            title="Edit User"
            description="Edit a user to the system."
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
                    id: "office_id",
                    type: "select",
                    label: "Office",
                    value: String(data.office_id) ?? '',
                    placeholder: "Select office",
                    options: offices?.map((office) => ({
                        label: office.office,
                        value: String(office.id),
                    })) ?? [],
                },
                {
                    id: "role_id",
                    type: "select",
                    label: "Role",
                    value: String(data.role_id),
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

export default EditUserFormDialog;