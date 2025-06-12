import AppLayout from '@/layouts/app-layout';
import { OfficeDataProps, RoleProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DataTable from '../datatable/datatable';
import { getUserColumns } from './users-column';
import { OfficeProps, UsersDataProps } from "@/types";
import AddUserFormDialog from './add-user-form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type UserPageProps = {
    users: UsersDataProps[]
    offices: OfficeDataProps[]
    roles: RoleProps[]
}

export default function User({ users, offices, roles }: UserPageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Incidents" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <DataTable
                        data={users}
                        columns={getUserColumns(users, offices, roles)}
                        filterColumn="name"
                        filterPlaceholder="Filter by name..."
                        tableTitle="Users"
                        tableDescription="This table displays users."
                        addButtonName='Add New User'
                        renderAddDialog={({ isOpen, setIsOpen }) => (
                            <AddUserFormDialog
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                offices={offices}
                                roles={roles}
                            />
                        )}
                    />
                </div>
            </div>
        </AppLayout>
    );
}