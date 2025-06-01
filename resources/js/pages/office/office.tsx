import DataTable from '@/components/datatable/data-table';
import { OfficeColumns } from '@/components/datatable/office/office-columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FormDialog } from '@/components/dialog/form-dialog';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Offices',
        href: '/office',
    },
];

type OfficeDataProps = {
    id: string;
    office: string;
    created_at: string;
    updated_at: string;
};

type OfficeProps = {
    offices: OfficeDataProps[];
}

function OfficeFormDialog() {
    return (
        <div>
            <FormDialog
                title="Add New Authorities"
                triggerLabel="Add Authorities"
                fields={[
                    { id: "office", label: "Office Name", placeholder: "Enter office name", required: true },
                ]}
                onSubmit={(data) => {
                    console.log("Form submitted:", data);
                }}
            />
        </div>
    );
}


export default function Office({ offices }: OfficeProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Authorities" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <DataTable
                        data={offices}
                        columns={OfficeColumns}
                        filterColumn="office"
                        filterPlaceholder="Filter by office..."
                        tableTitle="Authorities"
                        tableDescription="This table displays authorities."
                        formDialog={<OfficeFormDialog />}
                    />
                </div>
            </div>
        </AppLayout>
    );
}