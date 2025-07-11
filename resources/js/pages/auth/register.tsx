import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    municipality: string,
    barangay: string,
    email: string;
    office_id: string;
    password: string;
    password_confirmation: string;
};

type Office = {
    id: string;
    office: string;
}

interface OfficeProps {
    offices: Office[]
}

export default function Register({ offices }: OfficeProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        municipality: '',
        barangay: '',
        email: '',
        office_id: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('store.register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your e-report mo account.">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="office_id">Office</Label>
                        <Select
                            value={data.office_id}
                            onValueChange={(value) => setData('office_id', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Office" />
                            </SelectTrigger>
                            <SelectContent>
                                {offices.map((office) => (
                                    <SelectItem key={office.id} value={String(office.id)}>
                                        {office.office}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.office_id} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="municipality">Municipality</Label>
                        <Select
                            value={data.municipality}
                            onValueChange={(value) => setData('municipality', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Municipality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Alamada">Alamada</SelectItem>
                                <SelectItem value="Aleosan">Aleosan</SelectItem>
                                <SelectItem value="Antipas">Antipas</SelectItem>
                                <SelectItem value="Arakan">Arakan</SelectItem>
                                <SelectItem value="Banisilan">Banisilan</SelectItem>
                                <SelectItem value="Carmen">Carmen</SelectItem>
                                <SelectItem value="Kabacan">Kabacan</SelectItem>
                                <SelectItem value="Libungan">Libungan</SelectItem>
                                <SelectItem value="Magpet">Magpet</SelectItem>
                                <SelectItem value="Makilala">Makilala</SelectItem>
                                <SelectItem value="Matalam">Matalam</SelectItem>
                                <SelectItem value="M'lang">M'lang</SelectItem>
                                <SelectItem value="Midsayap">Midsayap</SelectItem>
                                <SelectItem value="Pigcawayan">Pigcawayan</SelectItem>
                                <SelectItem value="Pikit">Pikit</SelectItem>
                                <SelectItem value="President Roxas">President Roxas</SelectItem>
                                <SelectItem value="Tulunan">Tulunan</SelectItem>
                                <SelectItem value="Kidapawan City">Kidapawan City</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.municipality} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="barangay">Barangay</Label>
                        <Input
                            id="barangay"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="barangay"
                            value={data.barangay}
                            onChange={(e) => setData('barangay', e.target.value)}
                            disabled={processing}
                            placeholder="Barangay"
                        />
                        <InputError message={errors.barangay} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="juan@gmail.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('create.login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
