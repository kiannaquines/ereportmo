import { type BreadcrumbItem, type SharedData, type ProfileForm } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        municipality: auth.user.municipality,
        barangay: auth.user.barangay,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
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

                            <InputError className="mt-2" message={errors.municipality} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="barangay">Barangay</Label>

                            <Input
                                id="barangay"
                                className="mt-1 block w-full"
                                value={data.barangay}
                                onChange={(e) => setData('barangay', e.target.value)}
                                required
                                autoComplete="barangay"
                                placeholder="Barangay"
                            />
                            <InputError className="mt-2" message={errors.barangay} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
