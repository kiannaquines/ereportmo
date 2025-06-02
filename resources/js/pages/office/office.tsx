import DataTable from '@/components/datatable/data-table';
import { OfficeColumns } from '@/components/datatable/office/office-columns';
import AppLayout from '@/layouts/app-layout';
import { OfficeDataProps, type BreadcrumbItem } from '@/types';
import { router, Head, useForm } from '@inertiajs/react';
import { FormDialog } from '@/components/dialog/form-dialog';
import { toast } from "sonner"

export type OfficeProps = {
    offices: OfficeDataProps[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Offices',
        href: '/office',
    },
];

export function OfficeFormDialog() {
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
      title="Add New Authorities"
      isMultipart={false}
      disabled={processing}
      triggerLabel="Add Authorities"
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